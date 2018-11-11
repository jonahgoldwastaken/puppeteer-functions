function sequentialiser(funcObj, defaultNS, ctx) {
  const defaultNamespace = defaultNS
  const registeredFuncs = {}
  const queuedFuncs = []
  const savedValues = []
  let isFuncRunning = false
  let currentCtx

  function createNameSpaces(obj) {
    Object.keys(obj).forEach(ns => {
      registeredFuncs[ns] = {}
    })
  }

  function mapFuncsToNamespace(obj) {
    Object.keys(obj).forEach(ns => {
      const namespace = obj[ns]
      mapValueFunctionsToNamespace(namespace)
      mapContextReferences(namespace)
      mapFunctionsToRegisteredFuncs(namespace, ns)
    })
  }

  function mapValueFunctionsToNamespace(namespace) {
    namespace.saveVal = saveVal
    namespace.getVals = getVals
  }

  function mapContextReferences(namespace) {
    const context = namespace.contexts
    return Object.keys(context).forEach(func => {
      namespace[func].nsRef = context[func]
    })
  }

  function mapFunctionsToRegisteredFuncs(namespace, nsName) {
    return Object.keys(namespace).forEach(key => {
      if (key !== 'contexts') {
        const func = namespace[key]
        func.ns = nsName
        registeredFuncs[nsName][func.name] = queueifyFunc(func)
      }
    })
  }

  function queueifyFunc(func) {
    return function(...args) {
      queuedFuncs.push({ func, args })
      if (!isFuncRunning) runFunc(queuedFuncs[0])
      return retrieveCtx(func)
    }
  }

  function retrieveCtx(func) {
    if (func.nsRef) return registeredFuncs[func.nsRef]
    else return registeredFuncs[func.ns]
  }

  function runFunc({ func, args }, ctx) {
    isFuncRunning = true
    removeFuncFromQueue()

    let parsedFunc
    if (ctx) parsedFunc = func(ctx)
    else parsedFunc = func(currentCtx)

    if (args)
      parsedFunc(...args)
        .then(funcCallback)
        .catch(console.log)
    else
      parsedFunc()
        .then(funcCallback)
        .catch(console.log)
  }

  function funcCallback([newCtx, valToSave]) {
    const [nextFunc] = queuedFuncs
    isFuncRunning = false
    currentCtx = newCtx
    if (nextFunc) {
      if (nextFunc.func.name === 'saveVal') {
        const func = nextFunc.func(
          valToSave.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
        )
        runFunc({ func }, newCtx)
      } else {
        runFunc(nextFunc, newCtx)
      }
    }
  }

  function saveVal(val) {
    return function(ctx) {
      return function() {
        return new Promise(resolve => {
          savedValues.push(val)
          resolve([ctx])
        })
      }
    }
  }

  function getVals(ctx) {
    return function(cb) {
      return new Promise(resolve => {
        cb(savedValues)
        resolve([ctx])
      })
    }
  }

  function removeFuncFromQueue() {
    queuedFuncs.splice(0, 1)
  }

  createNameSpaces(funcObj)
  mapFuncsToNamespace(funcObj)
  currentCtx = ctx
  return registeredFuncs[defaultNamespace]
}

module.exports = sequentialiser
