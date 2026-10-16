// Local browser QA; PLAYWRIGHT_PATH can point to a separately installed Playwright.
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'C:/Users/rakho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  fs.mkdirSync('artifacts/contact', { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const results = [];
  const errors = [];
  try {
    for (const [width, height] of [[360,800], [390,844], [768,1024], [1024,900], [1440,1000], [844,390]]) {
      const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => sessionStorage.setItem('k72-multilingual-loader-seen', 'true'));
      await page.route('**/api/contact/likes', route => route.fulfill({ status: 503, contentType: 'application/json', body: '{}' }));
      await page.route('**/resume/ayush-rakholiya-resume.pdf', route => route.fulfill({ status: 404, body: '' }));
      await page.goto('http://127.0.0.1:5176/contact');
      await page.getByRole('heading', { name: 'LET’S TALK.' }).waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false, `overflow at ${width}`);
      assert.equal(await page.locator('iframe.contact-calendar').count(), 1);
      await page.screenshot({ path: `artifacts/contact/contact-${width}.png`, fullPage: true });
      await page.getByRole('link', { name: 'View résumé' }).click();
      await page.getByRole('heading', { name: 'The latest résumé is on its way.' }).waitFor();
      assert.equal(await page.getByRole('link', { name: 'Download PDF' }).count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.getByRole('link', { name: 'Back to contact' }).click();
      await page.getByRole('heading', { name: 'LET’S TALK.' }).waitFor();
      results.push({ width, height, overflow, resumeFallback: true, routeNavigation: true });
      await page.close();
    }
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.addInitScript(() => sessionStorage.setItem('k72-multilingual-loader-seen', 'true'));
    const visitors = new Set();
    let fail = false;
    let writes = 0;
    await page.route('**/api/contact/likes', async route => {
      const req = route.request();
      const id = req.headers()['x-visitor-id'];
      if (req.method() === 'POST') {
        writes++;
        if (fail) return route.fulfill({ status: 503, body: '{}' });
        visitors.add(id);
      }
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ count: visitors.size, liked: visitors.has(id) }) });
    });
    await page.goto('http://127.0.0.1:5176/contact');
    await page.waitForFunction(() => document.querySelector('.contact-like__count')?.textContent === '0');
    fail = true;
    await page.getByRole('button', { name: 'Like this website', exact: true }).click();
    await page.getByText('Likes are unavailable right now. Please try again.').waitFor();
    assert.equal(await page.locator('.contact-like__count').textContent(), '0');
    fail = false;
    await page.getByRole('button', { name: 'Like this website', exact: true }).click();
    await page.getByText('Thanks for the love.', { exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'You liked this website' }).isDisabled(), true);
    await page.reload();
    await page.getByText('Thanks for the love.', { exact: true }).waitFor();
    assert.equal(await page.locator('.contact-like__count').textContent(), '1');
    assert.equal(writes, 2);
    // Enlarged text must reflow without horizontal overflow.
    await page.addStyleTag({ content: '.contact-introduction > p, .contact-pill, .contact-like, .contact-like__status, .contact-booking-description, .contact-booking-empty p { font-size: 200% !important; }' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.screenshot({ path: 'artifacts/contact/enlarged-text.png', fullPage: true });
    results.push({ likeRetry: true, reloadPersistence: true, duplicateButtonDisabled: true, enlargedText: true });
    await page.close();
    const motion = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    motion.on('pageerror', error => errors.push(error.message));
    await motion.addInitScript(() => sessionStorage.setItem('k72-multilingual-loader-seen', 'true'));
    await motion.route('**/api/contact/likes', route => route.fulfill({ contentType: 'application/json', body: '{"count":7,"liked":false}' }));
    await motion.goto('http://127.0.0.1:5176/contact');
    await motion.waitForTimeout(2500);
    assert.equal(await motion.locator('.contact-title').evaluate(el => getComputedStyle(el).opacity), '1');
    await motion.getByRole('link', { name: 'Send an email' }).focus();
    assert.equal(await motion.getByRole('link', { name: 'Send an email' }).evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
    await motion.evaluate(() => window.scrollTo(0, document.querySelector('#book-a-chat').offsetTop + 80));
    await motion.waitForTimeout(800);
    assert.equal(await motion.evaluate(() => document.body.classList.contains('logo-black')), true);
    await motion.screenshot({ path: 'artifacts/contact/booking-desktop.png' });
    // Exercise the configured PDF UI without pretending this fixture is the user's résumé.
    await motion.route('**/resume/ayush-rakholiya-resume.pdf', route => route.fulfill({ contentType: 'application/pdf', body: '%PDF-1.4\n%%EOF' }));
    await motion.goto('http://127.0.0.1:5176/resume');
    await motion.getByRole('link', { name: 'Download PDF' }).waitFor();
    assert.equal(await motion.locator('object[type="application/pdf"]').count(), 1);
    assert.equal(await motion.getByRole('link', { name: 'Open PDF' }).getAttribute('href'), '/resume/ayush-rakholiya-resume.pdf');
    await motion.waitForTimeout(1800);
    const downloadEvent = motion.waitForEvent('download');
    await motion.getByRole('link', { name: 'Download PDF' }).click();
    assert.equal((await downloadEvent).suggestedFilename(), 'Ayush-Rakholiya-Resume.pdf');
    results.push({ motionReveal: true, keyboardFocus: true, bookingLogoContrast: true, pdfActionsWithFixture: true });
    await motion.close();
    const blocked = await browser.newPage({ reducedMotion: 'reduce' });
    await blocked.addInitScript(() => {
      sessionStorage.setItem('k72-multilingual-loader-seen', 'true');
      Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
    });
    await blocked.goto('http://127.0.0.1:5176/contact');
    await blocked.getByText('Allow browser storage to leave a like.').waitFor();
    await blocked.getByRole('button', { name: 'Like this website', exact: true }).click();
    await blocked.getByText('Allow browser storage to leave a like.').waitFor();
    assert.equal(await blocked.locator('.contact-like__count').count(), 0);
    results.push({ blockedStorage: true });
    await blocked.close();
    assert.deepEqual(errors, []);
    fs.writeFileSync('artifacts/contact/results.json', JSON.stringify(results, null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
