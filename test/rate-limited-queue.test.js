const RateLimitedQueue = require('../rate-limited-queue')
const MockNow = require('./mock-now')

describe('RateLimitedQueue', () => {
  const mockNow = new MockNow()
  const queue = new RateLimitedQueue(2, 1000, () => Date.now())

  beforeEach(() => {
    queue.clearQueue()
    mockNow.resetTime()
  })

  it('should work with sync function', async () => {
    const result = await queue.enqueue(() => 42, this, [])

    expect(result).toBe(42)
  })

  it('should work with async function', async () => {
    const result = await queue.enqueue(() => Promise.resolve(42), this, [])

    expect(result).toBe(42)
  })

  it('should respects rate limits', async () => {
    const now = Date.now()
    const elapsedMs = () => Promise.resolve(Date.now() - now)

    await queue.enqueue(elapsedMs, this, [])
    await queue.enqueue(elapsedMs, this, [])
    const result = await queue.enqueue(elapsedMs, this, [])

    expect(result).not.toBeLessThan(1000)
  })

  it('should throw out errors transparently', async () => {
    const shouldThrow = () => queue.enqueue(() => { throw new Error() }, this, [])
    expect(shouldThrow()).rejects.toEqual(new Error())
  })
})
