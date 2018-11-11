const puppeteer = require('./index')
puppeteer
  .launchBrowser()
  .launchPage('https://youtube.com')
  .type('#search', 'funhaus')
  .press('Enter')
  .wait(2000)
  .evaluate(() => document.querySelector('#video-title').textContent)
  .saveVal()
  .close()
  .exit()
  .getVals(values => {
    console.log(values)
  })
