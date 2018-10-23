class SlidingWindowTimestams {
  constructor(timeWindowMs, nowFn = Date.now) {
    this.timeWindowMs = timeWindowMs
    this.nowFn = nowFn
    this.timestamps = []
  }

  push(timestamp) {
    this.timestamps.push(timestamp)
  }

  count() {
    const now = this.nowFn()
    const windowedTimestamps = this.timestamps.filter(
      timestamp => timestamp >= now - this.timeWindowMs
    )

    this.timestamps = windowedTimestamps

    return windowedTimestamps.length
  }

  clear() {
    this.timestamps = []
  }

  oldestInWindow() {
    return this.count() > 0 ? this.timestamps[0] : undefined
  }
}

module.exports = SlidingWindowTimestams
