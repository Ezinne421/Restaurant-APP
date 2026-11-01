const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.BASE_URL||'http://127.0.0.1:3000';
 await page.goto(base);await page.locator('[data-start-role="customer"]').first().click();
 await page.getByRole('button',{name:'Send demo code',exact:true}).click();await page.locator('#otp').fill('123456');await page.getByRole('button',{name:'Verify & continue',exact:true}).click();
 assert.equal(await page.locator('#outlet-select').inputValue(),'Utako');
 assert.match(await page.getByRole('link',{name:'Pickup directions for Utako'}).getAttribute('href'),/51%20Anthony/);
 await page.locator('[data-favourite="jollof"]').click();await page.locator('[data-filter="Favourites"]').click();assert.equal(await page.locator('.product-card').count(),1);
 await page.reload();await page.locator('[data-filter="Favourites"]').click();assert.equal(await page.locator('.product-card').count(),1);
 await page.locator('[data-favourite="jollof"]').click();assert.equal(await page.locator('.product-card').count(),0);
 await page.locator('[data-view="orders"]').click();await page.locator('[data-reorder="seed-ready"]').click();
 assert.equal(await page.getByRole('heading',{name:'Order again',exact:true}).isVisible(),true);await page.getByRole('button',{name:'Add available items to basket',exact:true}).click();
 assert.match(await page.locator('.basket-head').innerText(),/2 items/);
 await page.locator('[data-open-role]').click();await page.locator('[data-role="owner"]').click();await page.locator('[data-owner-view="menu"]').click();
 await page.locator('[data-edit-labels="jollof"]').click();await page.locator('#label-spice').selectOption('Mild');await page.locator('#label-vegetarian').check();await page.locator('#label-allergens').fill('milk');await page.getByRole('button',{name:'Save meal labels',exact:true}).click();
 await page.locator('[data-owner-view="overview"]').click();await page.locator('#report-period').selectOption('yesterday');assert.match(await page.locator('.dashboard-metrics').innerText(),/Yesterday/);assert.doesNotMatch(await page.locator('.dashboard-metrics').innerText(),/NaN|Infinity/);
 await page.locator('[data-export]').click();assert.equal(await page.getByRole('heading',{name:'Yesterday’s demo summary',exact:true}).isVisible(),true);await page.locator('#modal-report-period').selectOption('week');assert.equal(await page.getByRole('heading',{name:'Last 7 days demo summary',exact:true}).isVisible(),true);await page.getByRole('button',{name:'Done',exact:true}).click();
 await page.locator('[data-owner-view="settings"]').click();assert.equal(await page.locator('#pickup-address-0').inputValue(),'51 Anthony Enahoro Street, Utako, Abuja');await page.getByRole('button',{name:'Save pickup addresses',exact:true}).click();
 await page.locator('[data-open-role]').click();await page.locator('[data-role="kitchen"]').click();await page.locator('#kitchen-outlet').selectOption('Wuse II');await page.locator('#kitchen-status').selectOption('2');assert.equal(await page.locator('.kitchen-order').count(),1);await page.locator('#kitchen-status').selectOption('all');await page.locator('#kitchen-slot').selectOption('Today|14:00');assert.equal(await page.locator('.kitchen-order').count(),1);assert.match(await page.locator('.kitchen-order').innerText(),/VF3712/);
 for(const role of ['customer','owner','kitchen']){await page.locator('[data-open-role]').click();await page.locator('[data-role="'+role+'"]').click();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,role+' mobile overflow');}
 await page.locator('[data-open-role]').click();await page.locator('[data-role="customer"]').click();await page.locator('[data-filter="All"]').click();await page.locator('[data-item="jollof"]').click();assert.match(await page.locator('#modal').innerText(),/Mild/);assert.match(await page.locator('#modal').innerText(),/Contains: milk/);await page.locator('[data-close]').click();
 await page.waitForFunction(()=>navigator.serviceWorker.controller);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});assert.equal(await page.getByRole('heading',{name:'Explore the menu',exact:true}).isVisible(),true);await context.setOffline(false);
 await page.setViewportSize({width:1280,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
 if(process.env.SCREENSHOT_PATH){await page.screenshot({path:process.env.SCREENSHOT_PATH,fullPage:true});}
 assert.deepEqual(errors,[]);console.log('PASS: six features through UI, saved favourites, owner edits, report filters, mobile roles, offline reload and desktop layout');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
