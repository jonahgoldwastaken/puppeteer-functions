function currier() {
  let isFuncRunning = false
  const queuedFuncs = []
  function registerFunc(func, params, obj) {
    queuedFuncs.push({ func, params, obj })
    return runFunc(queuedFuncs[0])
  }
  function runFunc(funcObj) {
    if (isFuncRunning) return
    isFuncRunning = true
    funcObj.func(...funcObj.params).then(_ => {
      removeFunc()
      const [newFuncObj] = queuedFuncs
      if (newFuncObj) {
        isFuncRunning = false
        runFunc(newFuncObj)
      }
    })
  }
  function removeFunc() {
    queuedFuncs.splice(0, 1)
  }
  return function curryFunc(param, func, obj) {
    return function(...funcParams) {
      registerFunc(func(param), funcParams, obj)
      return typeof obj === 'function' ? obj(param) : obj
    }
  }
}

module.exports = {
  currier: currier()
}
