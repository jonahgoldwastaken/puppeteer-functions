const browser = require('./index')

const page = browser
  .launchBrowser({ devtools: true })
  .launchPage('https://youtube.com')

page
  .click('#thumbnail')
  .type('#search', 'RTGame')
  .press('Enter')
  .delay(2000)
  .close()
  .exit()
