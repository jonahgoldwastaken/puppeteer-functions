const browser = require('./index')
;(async initBrowser => {
  const browser = await initBrowser(true)
  const page = await browser.launchPage('https://youtube.com')
  page
    .click('#thumbnail')
    .fillInput('#search', 'RTGame')
    .press('Enter')
    .delay(2000)
    .close()
    .exit()
})(browser)
