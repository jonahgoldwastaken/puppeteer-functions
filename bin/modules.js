const sequentialiser = require('../sequentialiser')
const { launchPage, launchBrowser, exit } = require('../lib/browser')
const page = require('../lib/page')

const sequencedModules = sequentialiser({
  defaultNS: 'puppeteer'
})({
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
})

module.exports = sequencedModules
