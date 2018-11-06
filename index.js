const puppeteer = require('puppeteer')
const browser = require('./bin/browser')

module.exports = browser(puppeteer)
