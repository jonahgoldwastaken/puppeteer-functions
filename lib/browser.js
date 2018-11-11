const puppeteer = require('puppeteer')
const launchBrowser = puppeteer =>
  async function launchBrowser(opts) {
    return [await puppeteer.launch(opts)]
  }

const launchPage = browser => async url => {
  const page = await browser.newPage()
  if (url) await page.goto(url)
  return [page]
}

const exit = browser => async _ => {
  await browser.close()
  return [puppeteer]
}

module.exports = {
  launchBrowser: launchBrowser,
  launchPage,
  exit
}
