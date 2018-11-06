const selectInput = page => async (selector, ...items) => {
  await page.select(selector, ...items)
  return page
}

const checkBoxes = page => async (listSelector, ...valuesToCheck) => {
  await page.evaluate(
    (list, values) => {
      const parsedValues = JSON.parse(values)
      parsedValues.forEach(value =>
        document
          .querySelector(list)
          .querySelector(`[value="${value}"]`)
          .click()
      )
    },
    listSelector,
    valuesToCheck
  )
  return page
}

const checkRadio = page => async (listSelector, valueToCheck) => {
  await page.evaluate(
    (list, value) =>
      document
        .querySelector(list)
        .querySelector(`[value="${value}"]`)
        .click(),
    listSelector,
    valueToCheck
  )
  return page
}

const type = page => async (inputSelector, text) => {
  await page.type(inputSelector, text.toString())
  return page
}

module.exports = {
  selectInput,
  checkBoxes,
  checkRadio,
  type
}
