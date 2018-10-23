class MockNow {
  constructor() {
    this.currentTimestamp = 0
  }

  resetTime() {
    this.currentTimestamp = 0
  }

  advanceTime(delta) {
    this.currentTimestamp += delta
  }

  now() {
    return this.currentTimestamp
  }
}

module.exports = MockNow
