const puppeteer = require('puppeteer')
const { browserModule } = require('../bin/modules')
const { launchBrowser } = require('../lib/browser')

module.exports = launchBrowser(puppeteer, browserModule)
