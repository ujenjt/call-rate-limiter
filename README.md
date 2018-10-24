[![Build Status](https://travis-ci.org/ujenjt/call-rate-limiter.svg?branch=master)](https://travis-ci.org/ujenjt/call-rate-limiter)

# Call Rate Limiter

Limit the execution rate of any function by wrapping it with a function that returns `Promise`. Module uses sliding window rate limiter under the hood. For implementation details check out "How it works" section.

## Install

```bash
npm install --save call-rate-limiter
```

## Usage
### Rate Limited Function

Te basic use case is when you ninteracting with REST api and want to repspect rate limits upfront to prevent be banned by the server.

`rateLimit` takes `limitCount`, `limitInterval` and `fn` as arguments and returns rate limited function which should be called instead of the function passed as `fn`.

This means if you call `rateLimitedFunc` 150 times and only 100 can be called in time, the next 50 calls will be postponed and executed later to respect given rate limits.

```javascript

import {rateLimit} from 'call-rate-limiter'

const rateLimitedFunc = rateLimit(
  1200,
  60 * 1000,
  id => fetch('https://swapi.co/api/starships/${id}/').then(res => res.json())
)

/*
  fetch Death Star specs, rateLimitedFunc
  transparently passes args to wrapped function
*/
const deathStar = await rateLimitedFunc('9')
```

### Rate Limited API

Suppose, you have a bunch of api calls specified somewhere that you want to call under the same rate limits. It can be easily done with `objectRateLimit`:

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

`objectRateLimit` takes `object` as last argument and return new object with rate-limited functions assigned for same keys:

```javascript
import {objectRateLimit} from 'call-rate-limiter'
import api from './api'

const rateLimitedApi = objectRateLimit(1200, 60 * 1000, api)

// trying to enumerate all planets in a galaxy far away
let i = 0
while(i < 100000) {
  console.log(await rateLimitedApi.planet(i))
  i++
}
```

## Preventing bursting

Quite often, it is necessary to check not only compliance with the rate limits but also to avoid bursting. We want the function to be called no more than once each `N` milliseconds. To obtain this wrap your function with `throttle` than with `rateLimit`.

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

## How it works

TODO: implement
