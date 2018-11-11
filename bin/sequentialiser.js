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
    namespace.saveValue = saveValue
    namespace.getValues = getValues
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
    if (ctx) {
      if (args) func(ctx, ...args).then(funcCallback)
      else func(ctx).then(funcCallback)
    } else {
      if (args) func(currentCtx, ...args).then(funcCallback)
      else func(currentCtx).then(funcCallback)
    }
  }

  function funcCallback([newCtx, valToSave]) {
    const [nextFunc] = queuedFuncs
    isFuncRunning = false
    currentCtx = newCtx
    if (nextFunc) {
      if (nextFunc.func.name === 'saveValue') {
        const func = nextFunc.func(
          valToSave.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
        )
        runFunc({ func }, newCtx)
      } else {
        runFunc(nextFunc, newCtx)
      }
    }
  }

  function saveValue(val) {
    return function saveValue(ctx) {
      return new Promise(resolve => {
        savedValues.push(val)
        resolve([ctx])
      })
    }
  }

  function getValues(ctx, cb) {
    return new Promise(resolve => {
      cb(savedValues)
      resolve([ctx])
    })
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
