const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/rakho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const scenario of ['desktop', 'mobile', 'failure', 'reduced']) {
      const page = await browser.newPage({ viewport: { width: scenario === 'mobile' ? 390 : 1440, height: 900 }, reducedMotion: scenario === 'reduced' ? 'reduce' : 'no-preference' });
      const requests = [];
      const errors = [];
      // Offline browser smoke test when the host disallows loopback networking.
      // This mode tests behavior, not network throughput or loading speed.
      if (process.env.QA_FROM_DISK) await page.route('http://127.0.0.1:5178/**', async route => {
        const pathname = new URL(route.request().url()).pathname;
        const file = path.resolve('dist', pathname === '/' ? 'index.html' : pathname.slice(1));
        assert(file.startsWith(path.resolve('dist') + path.sep));
        const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
        try { await route.fulfill({ body: await fs.readFile(file), contentType: types[path.extname(file)] || 'application/octet-stream' }); }
        catch { await route.fulfill({ status: 404, body: '' }); }
      });
      page.on('request', r => requests.push(r.url()));
      page.on('pageerror', e => errors.push(e.message));
      if (scenario === 'failure') await page.route('**/media/*.mp4', r => r.abort());
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Network.enable');
      if (!process.env.QA_FROM_DISK) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 4 * 1024 * 1024 / 8, uploadThroughput: 1024 * 1024 / 8 });
      await page.goto('http://127.0.0.1:5178/', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('.multilingual-loader', { state: 'hidden', timeout: 30000 });
      const atReveal = await page.locator('.home-video').evaluateAll(nodes => nodes.map(n => ({ poster: n.querySelector('img').naturalWidth > 0, ready: n.querySelector('video')?.readyState, playing: n.querySelector('video') ? !n.querySelector('video').paused : false })));
      assert(atReveal.every(v => v.poster), `${scenario}: missing poster at reveal`);
      assert(!requests.some(u => /contact\.gif|canadian-workforce-analytics\.png|dayflow\.png/.test(u)), 'closed menu downloads artwork');
      if (scenario === 'desktop' || scenario === 'mobile') {
        await page.waitForFunction(() => [...document.querySelectorAll('.home-video video')].every(v => v.currentTime > 0 && !v.paused), { timeout: 20000 });
        assert(requests.some(u => u.includes(`home-${scenario === 'mobile' ? '360' : '720'}-v1.mp4`)));
      }
      if (scenario === 'failure') assert.equal(await page.locator('.home-video__player--ready').count(), 0);
      if (scenario === 'reduced') assert(!requests.some(u => /\.mp4/.test(u)));
      assert.deepEqual(errors, []);
      console.log(JSON.stringify({ scenario, mode: process.env.QA_FROM_DISK ? 'offline-behavior-only' : '4Mbps', atReveal }));
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
