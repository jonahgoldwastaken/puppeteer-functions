const sequentialiser = require('../sequentialiser')
const { launchPage, launchBrowser, exit } = require('../lib/browser')
const page = require('../lib/page')

module.exports = sequentialiser(
  {
    puppeteer: {
      launchBrowser,
      contexts: {
        launchBrowser: 'browser'
      }
    },
    browser: {
      launchPage,
      exit,
      contexts: {
        launchPage: 'page'
      }
    },
    page: {
      ...page,
      contexts: {
        close: 'browser'
      }
    }
  },
  {
    defaultNS: 'puppeteer'
  }
)
