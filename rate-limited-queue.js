const SlidingWindowTimestams = require('./sliding-window-timestamps')

class RateLimitedQueue {
  constructor(limitCount, limitInterval, nowFn = Date.now) {
    this.limitCount = limitCount
    this.limitInterval = limitInterval
    this.nowFn = nowFn

    this.queue = []
    this.nextCallScheduled = false
    this.timestamps = new SlidingWindowTimestams(limitInterval, nowFn)

    this._performExecution = this._performExecution.bind(this)
  }

  enqueue(fn, ctx, args) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        fn,
        ctx,
        args,
        resolve,
        reject,
      })

      this._scheduleNextExecutionIfNeeded()
    })
  }

  _remainingExecutions() {
    return this.limitCount - this.timestamps.count()
  }

  _scheduleNextExecutionIfNeeded() {
    if (this._remainingExecutions() > 0) {
      this._performExecution()
    }


    const needsToSchedule = this.queue.length > 0 && !this.nextCallScheduled
    if (needsToSchedule) {
      const waitUntilNextExecution
        = this.limitInterval - (this.nowFn() - this.timestamps.oldestInWindow())
      this.timeoutId = setTimeout(
        this._performExecution,
        waitUntilNextExecution
      )
      this.nextCallScheduled = true
    }
  }

  _performExecution() {
    this.nextCallScheduled = false

    const task = this.queue.shift()

    if (task) {
      this.timestamps.push(this.nowFn())
      const { fn, ctx, args, resolve, reject, } = task
      try {
        resolve(fn.apply(ctx, args))
      } catch (err) {
        reject(err)
      }

      this._scheduleNextExecutionIfNeeded()
    }
  }

  clearQueue() {
    this.queue = []
    this.timestamps.clear()
    this.nextCallScheduled = false
    clearTimeout(this.timeoutId)
  }
}

module.exports = RateLimitedQueue
