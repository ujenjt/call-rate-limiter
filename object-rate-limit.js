const RateLimitedQueue = require('./rate-limited-queue')

module.exports = function(limitCount, limitInterval, object) {
  const rateLimitedQueue = new RateLimitedQueue(limitCount, limitInterval)

  const rateLimitedObject = {}
  Object.keys(object).forEach(fnName => {
    rateLimitedObject[fnName] = function(...args) {
      return rateLimitedQueue.enqueue(object[fnName], null, args)
    }
  })

  return rateLimitedObject
}
