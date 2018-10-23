const SlidingWindowTimestams = require('../sliding-window-timestamps')
const MockNow = require('./mock-now')

describe('SlidingWindowTimestams', () => {
  const mockNow = new MockNow(0)
  const timestamps = new SlidingWindowTimestams(5, () => mockNow.now())

  beforeEach(() => {
    timestamps.clear()
    mockNow.resetTime()
  })

  it('initial state', () => {
    expect(timestamps.count()).toBe(0)
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

  it('should displace timestamps out of window', () => {
    timestamps.push(mockNow.now())
    mockNow.advanceTime(6)

    expect(timestamps.count()).toBe(0)
  })

  it('should return undefined if there is no oldest one in window', () => {
    expect(timestamps.oldestInWindow()).toBe(undefined)
  })

  it('should return undefined in case when oldest one out of window', () => {
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
