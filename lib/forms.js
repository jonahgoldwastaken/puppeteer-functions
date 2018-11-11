const selectInput = async (page, selector, ...items) => {
  await page.select(selector, ...items)
  return [page]
}

const checkBoxes = async (page, listSelector, ...valuesToCheck) => {
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
  return [page]
}

const checkRadio = async (page, listSelector, valueToCheck) => {
  await page.evaluate(
    (list, value) =>
      document
        .querySelector(list)
        .querySelector(`[value="${value}"]`)
        .click(),
    listSelector,
    valueToCheck
  )
  return [page]
}

const type = async (page, inputSelector, text) => {
  await page.type(inputSelector, text.toString())
  return [page]
}

module.exports = {
  selectInput,
  checkBoxes,
  checkRadio,
  type
}
