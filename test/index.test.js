const callRateLimiter = require('../')

const { rateLimit, objectRateLimit, } = callRateLimiter

describe('CallRateLimit module interface', () => {
  it('rateLimit should work', async () => {
    const fn = jest.fn().mockImplementation(() => Promise.resolve(42))

    const now = Date.now()
    const wrappedFn = rateLimit(2, 1000, fn)

    const result1 = await wrappedFn(1)

    expect(fn).toHaveBeenCalledWith(1)
    expect(result1).toBe(42)
    expect(Date.now() - now).toBeLessThan(1000)

    const result2 = await wrappedFn(2)

    expect(fn).toHaveBeenCalledWith(2)
    expect(result2).toBe(42)
    expect(Date.now() - now).toBeLessThan(1000)

    const result3 = await wrappedFn(3)

    expect(fn).toHaveBeenCalledWith(3)
    expect(result3).toBe(42)
    expect(Date.now() - now).toBeGreaterThan(1000)
  })

  it('objectRateLimit should work', async () => {
    const api = {
      fn1: jest.fn().mockImplementation(() => Promise.resolve('first')),
      fn2: jest.fn().mockImplementation(() => Promise.resolve('second')),
    }

    const now = Date.now()
    const wrappedApi = objectRateLimit(2, 1000, api)

    const result1 = await wrappedApi.fn1(1)

    expect(api.fn1).toHaveBeenCalledWith(1)
    expect(result1).toBe('first')
    expect(Date.now() - now).toBeLessThan(1000)

    const result2 = await wrappedApi.fn2(2)

    expect(api.fn2).toHaveBeenCalledWith(2)
    expect(result2).toBe('second')
    expect(Date.now() - now).toBeLessThan(1000)

    const result3 = await wrappedApi.fn1(3)

    expect(api.fn1).toHaveBeenCalledWith(3)
    expect(result3).toBe('first')
    expect(Date.now() - now).toBeGreaterThan(1000)
  })
})
