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

  function mapFuncsToNamespace(item) {
    const [func, namespace, namespaceRef] = item
    func.ns = namespace
    if (namespaceRef) func.nsRef = namespaceRef
    registeredFuncs[namespace][func.name] = queueifyFunc(func)
  }

  function createNameSpaces(item) {
    const namespace = item[1]
    if (!registeredFuncs[namespace]) registeredFuncs[namespace] = {}
  }

  return function(funcArray) {
    funcArray.forEach(createNameSpaces)
    funcArray.forEach(mapFuncsToNamespace)
    return registeredFuncs[defaultNamespace]
  }
}

module.exports = sequentialiser
