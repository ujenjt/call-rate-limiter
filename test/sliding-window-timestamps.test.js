const SlidingWindowTimestamps = require('../sliding-window-timestamps')
const MockNow = require('./mock-now')

describe('SlidingWindowTimestamps', () => {
  const mockNow = new MockNow(0)
  const timestamps = new SlidingWindowTimestamps(5, () => mockNow.now())

  beforeEach(() => {
    timestamps.clear()
    mockNow.resetTime()
  })

  it('initial state', () => {
    expect(timestamps.count()).toBe(0)
  })

  it('uses default nowFn if it has not passed', () => {
    const t = new SlidingWindowTimestamps(1)
    expect(t.nowFn).toBe(Date.now)
  })

  it('take into account the timestamps of the window boundary', () => {
    timestamps.push(mockNow.now())
    mockNow.advanceTime(5)
    timestamps.push(mockNow.now())

    expect(timestamps.count()).toBe(2)
  })

  it('handle equals timestamps correctly', () => {
    timestamps.push(mockNow.now())
    timestamps.push(mockNow.now())

    expect(timestamps.count()).toBe(2)
  })

  it('handle different timestamps correctly', () => {
    timestamps.push(mockNow.now())
    timestamps.push(mockNow.now())
    mockNow.advanceTime(1)
    timestamps.push(mockNow.now())
    mockNow.advanceTime(1)
    timestamps.push(mockNow.now())
    mockNow.advanceTime(1)

    expect(timestamps.count()).toBe(4)
  })

  it('should displace timestamps out of the window', () => {
    timestamps.push(mockNow.now())
    mockNow.advanceTime(6)

    expect(timestamps.count()).toBe(0)
  })

  it('should return undefined if there is no oldest one in the window', () => {
    expect(timestamps.oldestInWindow()).toBe(undefined)
  })

  it('should return undefined in case when oldest one out of the window', () => {
    mockNow.advanceTime(1)
    timestamps.push(mockNow.now())

    mockNow.advanceTime(6)

    expect(timestamps.oldestInWindow()).toBe(undefined)
  })

  it('should correct calucalte the oldest one', () => {
    mockNow.advanceTime(1)
    timestamps.push(mockNow.now())
    mockNow.advanceTime(1)

    expect(timestamps.oldestInWindow()).toBe(1)
  })
})
