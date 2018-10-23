const RateLimitedQueue = require('../rate-limited-queue')
const MockNow = require('./mock-now')

describe('RateLimitedQueue', () => {
  const mockNow = new MockNow()
  const queue = new RateLimitedQueue(2, 1000, () => Date.now())

  beforeEach(() => {
    queue.clearQueue()
    mockNow.resetTime()
  })

  it('should works', async () => {
    const result = await queue.enqueue(() => Promise.resolve(42), this, [])

    expect(result).toBe(42)
  })

  it('should respects rate limits', async () => {
    const now = Date.now()
    const elapsedMs = _ => {
      return Promise.resolve(Date.now() - now)
    }

    const result1 = await queue.enqueue(elapsedMs, this, [])
    const result2 = await queue.enqueue(elapsedMs, this, [])
    const result3 = await queue.enqueue(elapsedMs, this, [])

    expect(result3).not.toBeLessThan(1000)
  })

  it('should throw out errors transparently', async () => {
    const shouldThrow = _ => queue.enqueue(_ => {throw new Error()}, this, [])
    expect(shouldThrow()).rejects.toEqual(new Error())
  })
})
