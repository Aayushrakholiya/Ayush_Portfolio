import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact/likes.js';

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };
afterEach(() => { globalThis.fetch = originalFetch; process.env = { ...originalEnv }; });
const visitor = 'c05f3351-7eb1-4c6f-82f2-d7084bc8e957';
function configure() {
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'server-secret';
  process.env.CONTACT_RATE_LIMIT_SECRET = 'test-rate-secret';
}
async function call(method = 'GET', headers = {}) {
  const response = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
  await handler({ method, headers: { 'x-visitor-id': visitor, ...headers }, socket: { remoteAddress: '127.0.0.1' } }, response);
  return response;
}
test('rejects unsupported methods and malformed browser identifiers', async () => {
  assert.equal((await call('DELETE')).code, 405);
  assert.equal((await call('POST', { 'x-visitor-id': 'invalid' })).code, 400);
  assert.equal((await call('POST', { 'sec-fetch-site': 'cross-site' })).code, 403);
});
test('unconfigured backend returns unavailable without a fabricated count', async () => {
  delete process.env.SUPABASE_URL;
  const result = await call();
  assert.equal(result.code, 503);
  assert.equal(result.body.count, undefined);
});
test('GET returns authoritative state, keeps secrets server-side, and hashes the trusted IP', async () => {
  configure();
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://example.supabase.co/rest/v1/rpc/contact_like');
    const payload = JSON.parse(options.body);
    assert.equal(payload.add_like, false);
    assert.equal(payload.visitor_id, visitor);
    assert.match(payload.rate_key, /^[a-f0-9]{64}$/);
    return Response.json({ count: 42, liked: false });
  };
  const result = await call();
  assert.deepEqual(result.body, { count: 42, liked: false });
  assert.equal(result.headers['Cache-Control'], 'no-store');
});
test('POST delegates insertion to the atomic database RPC', async () => {
  configure();
  globalThis.fetch = async (_url, options) => {
    assert.equal(JSON.parse(options.body).add_like, true);
    return Response.json({ count: 43, liked: true });
  };
  assert.deepEqual((await call('POST')).body, { count: 43, liked: true });
});

test('new Supabase secret keys are sent as API keys rather than bearer JWTs', async () => {
  configure();
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_test';
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.apikey, 'sb_secret_test');
    assert.equal(options.headers.Authorization, undefined);
    return Response.json({ count: 0, liked: false });
  };
  assert.equal((await call()).code, 200);
});
test('rate limits include a retry interval', async () => {
  configure();
  globalThis.fetch = async () => Response.json({ limited: true });
  const result = await call('POST');
  assert.equal(result.code, 429);
  assert.equal(result.headers['Retry-After'], '60');
});
test('database outages and malformed data do not leak errors or report success', async () => {
  configure();
  globalThis.fetch = async () => { throw new Error('sensitive details'); };
  assert.equal((await call('POST')).code, 503);
  globalThis.fetch = async () => Response.json({ count: 'wrong', liked: true });
  assert.equal((await call()).code, 503);
});
