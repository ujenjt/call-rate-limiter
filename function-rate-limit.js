const RateLimitedQueue = require('./rate-limited-queue')

module.exports = function(limitCount, limitInterval, fn) {
  const rateLimitedQueue = new RateLimitedQueue(limitCount, limitInterval)

  return function(...args) {
    return rateLimitedQueue.enqueue(fn, null, args)
  }
}
