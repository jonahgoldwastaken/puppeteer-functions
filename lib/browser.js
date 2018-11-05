const launchBrowser = (puppeteer, browserModule) => async devMode => {
  const browser = await puppeteer.launch({ devtools: !!devMode })
  return browserModule(browser)
}
const launchPage = (browser, pageModule) => async url => {
  const page = await browser.newPage()
  if (url) await page.goto(url)
  return pageModule(page)
}
const exit = browser => async _ => await browser.close()

module.exports = {
  launchBrowser,
  launchPage,
  exit
}
