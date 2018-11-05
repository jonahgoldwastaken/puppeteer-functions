const { currier } = require('../utils')
const { launchPage, exit } = require('../lib/browser')
const {
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
} = require('../lib/page')

const browserModule = browser => ({
  launchPage: launchPage(browser, pageModule),
  exit: currier(browser, exit)
})

const pageModule = page => ({
  navigate: currier(page, navigate, pageModule),
  goBack: currier(page, goBack, pageModule),
  goForward: currier(page, goForward, pageModule),
  reload: currier(page, reload, pageModule),
  evaluate: currier(page, evaluate, pageModule),
  click: currier(page, click, pageModule),
  selectInput: currier(page, selectInput, pageModule),
  checkBoxes: currier(page, checkBoxes, pageModule),
  checkRadio: currier(page, checkRadio, pageModule),
  fillInput: currier(page, fillInput, pageModule),
  close: currier(page, close, browserModule(page.browser())),
  awaitNavigation: currier(page, awaitNavigation, pageModule),
  delay: currier(page, delay, pageModule),
  press: currier(page, press, pageModule)
})

module.exports = { pageModule, browserModule }
