const sequentialiser = require('../sequentialiser')
const { launchPage, launchBrowser, exit } = require('../lib/browser')
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

const sequencedModules = sequentialiser({
  defaultNS: 'puppeteer'
})([
  [launchBrowser, 'puppeteer', 'browser'],
  [launchPage, 'browser', 'page'],
  [exit, 'browser'],
  [navigate, 'page'],
  [goBack, 'page'],
  [goForward, 'page'],
  [reload, 'page'],
  [evaluate, 'page'],
  [click, 'page'],
  [selectInput, 'page'],
  [checkBoxes, 'page'],
  [checkRadio, 'page'],
  [fillInput, 'page'],
  [close, 'page', 'browser'],
  [awaitNavigation, 'page'],
  [delay, 'page'],
  [press, 'page']
])

module.exports = sequencedModules
