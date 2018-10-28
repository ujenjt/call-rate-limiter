[![Build Status](https://travis-ci.org/ujenjt/call-rate-limiter.svg?branch=master)](https://travis-ci.org/ujenjt/call-rate-limiter)
[![Coverage Status](https://coveralls.io/repos/github/ujenjt/call-rate-limiter/badge.svg)](https://coveralls.io/github/ujenjt/call-rate-limiter)

# Call Rate Limiter

This is `async/await` friendly utility to limit the execution rate of any function. If you call the wrapped function more frequently than the rate limit allows, the wrapper avoided immediate call but arranges calls in the internal queue and call them later to ensure rate limit.

Often API providers prevent (or even ban) you from calling their API endpoints more often than specified number of times during defined time frame. As a responsible developer, you want to respect this restrictions on your own side and not give API provider a reason to restrict your code from the API access. `call-rate-limiter` package provides utility functions to help you in achieving this goal.

Rate limiting functions provided use sliding window rate limiter under the hood. Every function wrapped in rate limiter becomes a `Promise`-returning function. This `Promise` resolves then the function is called and, if it was async as well, only after returned `Promise` is resolved. Result of function execution is passed to `resolve` function.

## Install

```bash
npm install --save call-rate-limiter
```

## Usage
### Rate Limited Function

`rateLimit` takes `limitCount`, `limitInterval` and `fn` as arguments and returns rate limited function which should be called instead of the function passed as `fn`.

This means if you call `rateLimitedFunc` 150 times and only 100 can be called in time frame, the next 50 calls will be postponed and executed later to respect given rate limits.

```javascript

import {rateLimit} from 'call-rate-limiter'

const rateLimitedFetch = rateLimit(
  1200,
  60 * 1000,
  id => fetch('https://swapi.co/api/starships/${id}/').then(res => res.json())
)

/*
  fetch Death Star specs
  rateLimit transparently passes args to wrapped function
*/
const deathStar = await rateLimitedFetch('9')
```

### Rate limiting multiple functions by single limiter with `objectRateLimit` method

Suppose, there's number of APIs which have the same and only rate limit.

```javascript
const basePath = 'https://swapi.co/api/'

function character(id) {
  return fetch(`${basePath}/people/${id}`).then(res => res.json())
}

function planet(id) {
  return fetch(`${basePath}/planet/${id}`).then(res => res.json())
}

module.exports = {
  character: character,
  planet: planet
}
```

You can setup single rate limiter for a bunch of functions with `objectRateLimit` method. `objectRateLimit` takes `object` as last argument and return new object with rate-limited functions assigned for same keys:

```javascript
import {objectRateLimit} from 'call-rate-limiter'
import api from './api'

const rateLimitedApi = objectRateLimit(1200, 60 * 1000, api)

// trying to list all planets in a galaxy far away
let i = 0
while(i < 100000) {
  console.log(await rateLimitedApi.planet(i))
  i++
}
```

## Burst prevention

`Call burst` is a situation where single function is called many times during short time frame. That's a common issue with rate limiters, as they tend to unfreeze and send multiple requests to limited APIs as limit time window slides to allow new calls. Often you want to separate this calls by small timeout. To achieve this, you could use `throttle` functions, like the one [lodash provides](https://lodash.com/docs/4.17.10#throttle). Just wrap your API-calling function with `throttle` first and then wrap it in `rateLimit`.

```javascript
import {yourFunction} from 'your-module'

import {rateLimit} from 'call-rate-limiter'
import throttle from 'lodash.throttle'

const waitBetweenCalls = 100 // 100ms
const limitCount = 30 // max 30 calls per minute
const limitInterval = 60 * 1000 // one minute

const rateLimitedNoBurstingFunc = rateLimit(
  limitCount,
  limitInterval,
  throttle(yourFunction, waitBetweenCalls)
)
```
