function sequentialiser(funcObj, options) {
  const defaultNamespace = options.defaultNS
  const registeredFuncs = {}
  const queuedFuncs = []
  let isFuncRunning = false
  let firstCtx

  function queueifyFunc(func) {
    return function(...args) {
      queuedFuncs.push({ func, args })
      if (!isFuncRunning) runFunc(queuedFuncs[0])
      return retrieveCtx(func)
    }
  }

  function removeFuncFromQueue() {
    queuedFuncs.splice(0, 1)
  }

  function retrieveCtx(func) {
    if (func.nsRef) return registeredFuncs[func.nsRef]
    else return registeredFuncs[func.ns]
  }

  function runFunc({ func, args }, ctx) {
    if (isFuncRunning) return
    isFuncRunning = true

    let parsedFunc
    if (ctx) {
      parsedFunc = func(ctx)
    } else {
      parsedFunc = func(firstCtx)
      firstCtx = null
    }

    if (args) parsedFunc(...args).then(funcCallBack)
    else func().then(funcCallBack)
  }

  function funcCallBack(newCtx) {
    removeFuncFromQueue()
    const [nextFunc] = queuedFuncs
    isFuncRunning = false
    if (nextFunc) runFunc(nextFunc, newCtx)
  }

  function mapFuncsToNamespace(obj) {
    Object.keys(obj).forEach(ns => {
      const namespace = obj[ns]
      const context = namespace.contexts
      Object.keys(context).forEach(func => {
        namespace[func].nsRef = context[func]
      })
      Object.keys(namespace).forEach(key => {
        if (key !== 'contexts') {
          const func = namespace[key]
          func.ns = ns
          registeredFuncs[ns][func.name] = queueifyFunc(func)
        }
      })
    })
  }

  function createNameSpaces(obj) {
    Object.keys(obj).forEach(ns => {
      registeredFuncs[ns] = {}
    })
  }

  createNameSpaces(funcObj)
  mapFuncsToNamespace(funcObj)
  return function(ctx) {
    firstCtx = ctx
    return registeredFuncs[defaultNamespace]
  }
}

module.exports = sequentialiser
