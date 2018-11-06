function sequentialiser(options) {
  const defaultNamespace = options.defaultNS
  const registeredFuncs = {}
  const queuedFuncs = []
  let isFuncRunning = false

  function queueifyFunc(func) {
    return function(...args) {
      queuedFuncs.push({ func, args })
      return runFunc(queuedFuncs[queuedFuncs.length - 1])
    }
  }

  function removeFuncFromQueue() {
    queuedFuncs.splice(0, 1)
  }

  function runFunc({ func, args }, ctx) {
    if (!isFuncRunning) {
      isFuncRunning = true
      let parsedFunc
      if (ctx) parsedFunc = func(ctx)
      else parsedFunc = func
      if (args) parsedFunc(...args).then(funcCallBack)
      else func().then(funcCallBack)
    }
    if (func.nsRef) return registeredFuncs[func.nsRef]
    else return registeredFuncs[func.ns]
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

  return function(funcObj) {
    createNameSpaces(funcObj)
    mapFuncsToNamespace(funcObj)
    return registeredFuncs[defaultNamespace]
  }
}

module.exports = sequentialiser
