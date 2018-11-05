const selectInput = page => async (selector, ...items) =>
  await page.select(selector, ...items)

const checkBoxes = page => async (listSelector, ...valuesToCheck) =>
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

const checkRadio = page => async (listSelector, valueToCheck) =>
  await page.evaluate(
    (list, value) =>
      document
        .querySelector(list)
        .querySelector(`[value="${value}"]`)
        .click(),
    listSelector,
    valueToCheck
  )

const fillInput = page => async (inputSelector, newValue) =>
  await page.type(inputSelector, newValue.toString())

module.exports = {
  selectInput,
  checkBoxes,
  checkRadio,
  fillInput
}
