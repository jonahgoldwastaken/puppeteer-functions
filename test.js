const puppeteer = require('./index')
puppeteer
  .launchBrowser()
  .launchPage('https://youtube.com')
  .type('#search', 'funhaus')
  .press('Enter')
  .wait(2000)
  .evaluate(() => document.querySelector('#video-title').textContent)
  .saveValue()
  .close()
  .exit()
  .getValues(values => {
    console.log(values[0])
  })
