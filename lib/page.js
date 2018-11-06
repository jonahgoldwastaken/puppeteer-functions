const forms = require('./forms')

const navigate = page => async url => {
  await page.goto(url, { waitUntil: 'networkidle2' })
  return page
}

const goBack = page => async _ => {
  await page.goBack({ waitUntil: 'networkidle2' })
  return page
}

const goForward = page => async _ => {
  await page.goForward({ waitUntil: 'networkidle2' })
  return page
}

const reload = page => async _ => {
  await page.reload({ waitUntil: 'networkidle2' })
  return page
}

const click = page => async selector => {
  await page.$eval(selector, el => el.click())
  return page
}

const press = page => async key => {
  await page.keyboard.press(key)
  return page
}

const awaitNavigation = page => async _ => {
  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  return page
}

const delay = page => async amt => {
  await page.waitFor(amt)
  return page
}

const evaluate = page => async (func, ...args) => {
  await page.evaluate(func, ...args)
  return page
}

const close = page => async () => {
  const browser = page.browser()
  await page.close()
  return browser
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
  delay,
  press
}
