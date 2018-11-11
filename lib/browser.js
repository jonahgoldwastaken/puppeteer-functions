const puppeteer = require('puppeteer')
const launchBrowser = async (puppeteer, opts) => {
  return [await puppeteer.launch(opts)]
}

const launchPage = async (browser, url) => {
  const page = await browser.newPage()
  if (url) await page.goto(url)
  return [page]
}

const exit = async browser => {
  await browser.close()
  return [puppeteer]
}

module.exports = {
  launchBrowser: launchBrowser,
  launchPage,
  exit
}
