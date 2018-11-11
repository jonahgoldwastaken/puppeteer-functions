const forms = require('./forms')

const navigate = async (page, url) => {
  await page.goto(url, { waitUntil: 'networkidle2' })
  return [page]
}

const goBack = async page => {
  await page.goBack({ waitUntil: 'networkidle2' })
  return [page]
}

const goForward = async page => {
  await page.goForward({ waitUntil: 'networkidle2' })
  return [page]
}

const reload = async page => {
  await page.reload({ waitUntil: 'networkidle2' })
  return [page]
}

const click = async (page, selector) => {
  await page.$eval(selector, el => el.click())
  return [page]
}

const press = async (page, key) => {
  await page.keyboard.press(key)
  return [page]
}

const awaitNavigation = async page => {
  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  return [page]
}

const wait = async (page, amt) => {
  await page.waitFor(amt)
  return [page]
}

const evaluate = async (page, func, ...args) => {
  const val = await page.evaluate(func, ...args)
  return [page, val]
}

const close = async page => {
  const browser = page.browser()
  await page.close()
  return [browser]
}

module.exports = {
  ...forms,
  navigate,
  goBack,
  goForward,
  reload,
  evaluate,
  click,
  close,
  awaitNavigation,
  wait,
  press
}
