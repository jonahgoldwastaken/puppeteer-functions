const { selectInput, checkBoxes, checkRadio, fillInput } = require('./forms')

const navigate = page => async url =>
  await page.goto(url, { waitUntil: 'networkidle2' })

const goBack = page => async _ =>
  await page.goBack({ waitUntil: 'networkidle2' })

const goForward = page => async _ =>
  await page.goForward({ waitUntil: 'networkidle2' })

const reload = page => async _ =>
  await page.reload({ waitUntil: 'networkidle2' })

const click = page => async selector => {
  try {
    return await page.click(selector)
  } catch (err) {
    return await page.$eval(selector, el => el.click())
  }
}

const press = page => async key => await page.keyboard.press(key)

const awaitNavigation = page => async _ =>
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

const delay = page => async amt => await page.waitFor(amt)

const evaluate = page => async (func, ...args) =>
  await page.evaluate(func, ...args)

const close = page => async () => await page.close()

module.exports = {
  navigate,
  goBack,
  goForward,
  reload,
  evaluate,
  click,
  selectInput,
  checkBoxes,
  checkRadio,
  fillInput,
  close,
  awaitNavigation,
  delay,
  press
}
