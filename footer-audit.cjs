const { chromium } = require('C:/Users/rakho/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({ headless: true, channel: 'msedge' });
 const results=[];
 for (const width of [1440,1280,1100,1024,768,720,430,390,375,320]) {
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  for (const route of ['/', '/agence','/project','/blog','/contact']) {
   await page.goto('http://127.0.0.1:5174'+route);
   await page.waitForTimeout(1800);
   const footer=page.locator('#site-footer');
   if(await footer.count()) await footer.scrollIntoViewIfNeeded();
   const data=await page.evaluate(()=>{
    const f=document.querySelector('#site-footer');
    if(!f)return {present:false};
    const selectors=['.site-footer','.site-footer__socials','.site-footer__contact','.site-footer__location','.site-footer__legal','.site-footer__back-to-top'];
    const boxes=Object.fromEntries(selectors.map(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect(),c=getComputedStyle(e);return [s,{x:r.x,y:r.y-f.getBoundingClientRect().y,w:r.width,h:r.height,paddingTop:c.paddingTop,display:c.display,fontSize:c.fontSize}]}));
    const overflow=[...f.querySelectorAll('a,button,svg')].filter(e=>{const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth}).map(e=>e.textContent||e.getAttribute('class'));
    return {present:true,socials:[...f.querySelectorAll('.site-footer__social-link')].map(e=>e.textContent),boxes,overflow,consentAvailable:typeof window.OneTrust?.ToggleInfoDisplay==='function'};
   });
   if(data.present){await footer.getByRole('button',{name:'Back to top'}).click();await page.waitForTimeout(1200);data.backToTop=await page.evaluate(()=>scrollY<8);}
   results.push({width,route,...data});
  }
  await page.close();
 }
 fs.writeFileSync('footer-audit-results.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results.map(({width,route,present,overflow,backToTop})=>({width,route,present,overflow,backToTop}))));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
