const puppeteer = require('puppeteer')

const launchBrowser = puppeteer =>
  async function launchBrowser(devMode) {
    return await puppeteer.launch({ devtools: !!devMode })
  }

const launchPage = browser => async url => {
  const page = await browser.newPage()
  if (url) await page.goto(url)
  return page
}

const exit = browser => async _ => await browser.close()

module.exports = {
  launchBrowser: launchBrowser(puppeteer),
  launchPage,
  exit
}
