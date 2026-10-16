import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';

test('Postgres migration, idempotent likes, shared counts, rate limits, and permissions', async () => {
  const db = new PGlite();
  try {
    await db.exec('create role anon; create role authenticated; create role service_role;');
    const sql = await readFile(new URL('../supabase/contact-likes.sql', import.meta.url), 'utf8');
    await db.exec(sql);
    await db.exec(sql); // Reapplying setup must not reset the total.
    const rpc = async (visitor, add = false, ip = 'test') => (await db.query('select public.contact_like($1::uuid, $2, $3) as result', [visitor, add, ip])).rows[0].result;
    const first = randomUUID();
    assert.deepEqual(await rpc(first), { count: 0, liked: false });
    assert.deepEqual(await rpc(first, true), { count: 1, liked: true });
    const retries = await Promise.all(Array.from({ length: 5 }, () => rpc(first, true)));
    for (const result of retries) assert.deepEqual(result, { count: 1, liked: true });
    const second = randomUUID();
    assert.deepEqual(await rpc(second, false, 'second'), { count: 1, liked: false });
    assert.deepEqual(await rpc(second, true, 'second'), { count: 2, liked: true });
    for (let i = 0; i < 10; i++) await rpc(randomUUID(), true, 'limited');
    assert.deepEqual(await rpc(randomUUID(), true, 'limited'), { limited: true });
    assert.equal((await rpc(first)).count, 12);
    await db.query("update public.contact_like_limits set window_start = now() - interval '2 minutes' where key = 'limited:write'");
    assert.equal((await rpc(randomUUID(), true, 'limited')).count, 13);
    await db.exec(sql);
    assert.equal((await rpc(first)).count, 13);
    for (const role of ['anon', 'authenticated']) {
      await db.exec(`set role ${role}`);
      await assert.rejects(rpc(first), /permission denied/);
      await assert.rejects(db.query('select * from public.contact_likes'), /permission denied/);
      await db.exec('reset role');
    }
    await db.exec('set role service_role');
    assert.equal((await rpc(first)).liked, true);
  } finally { await db.close(); }
});
