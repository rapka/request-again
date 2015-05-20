[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-image]][npm-url] [![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url]

# request-again

Install via npm:

    npm install --save request-again

## What Does it Do?

This module is a plugin for [request](https://www.npmjs.com/package/request), not a direct replacement. For now, it only supports a limited portion of request's functionality.

The request-again module allows you to cache the body of a request http call for a period of time. This is helpful if you regularly call an external API, but the information you are retrieving is updated infrequently.

## How to Use It

After installing the module:

    var request = require('request-again');

Then call ``request.cached()`` like you would call request ordinarily. Here's an example calling the Pokémon API:

    request.cached('http://pokeapi.co/api/v1/pokemon/1', {
      someOption: value
    }, function(err, res, body) {
      return console.log('The request took:',
        Date.now() - startTime + ' ms');
    });

If you make the same request call within a period of time, you will retrieve the cached object immediately instead of calling the API again.

## Defaults and Settings

A cache will be created automatically when you require the module with the following default settings:

* ``stdTTL: 0``. This is the maximum time (in seconds) which an object will be stored in the cache before new data is requested from the external API. The default is 0, which indicates ``unlimited`` TTL.
* `checkperiod: 600``. The period (in seconds) used to determine the automatic delete check interval. Setting this to 0 means there will be no periodic check.

You can override the default settings:

    request.enableCache({
      stdTTL: 60,
      checkperiod: 120
    });

## How It Works

The cache is set based on the ``url`` of the request as well as the ``options`` object. Future request calls must match both of these parameters for the cache to be retrieved, otherwise a new http call will be made and that new response will be stored in the cache.

## Future Development

Right now the module only supports a request structure of:

    request.cached(url, optionsObject, callbackFunction);

So it is not quite as flexible as a standard request object. Additionally, if you retrieve a cached response, the first two parameters of the callback function (``error`` and ``response``) will be ``null``, so you will only get back the ``body``.

We plan to make this more flexible and full-featured in the feature.

## Version History

* 0.1.0 Switched the module used for caching.
* 0.0.5 Initial release. This will need some work before I consider it production ready.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square
[license-url]: https://github.com/hemphillcc/request-again/blob/master/LICENSE

[npm-version-image]: http://img.shields.io/npm/v/request-again.svg?style=flat-square
[npm-downloads-image]: http://img.shields.io/npm/dm/request-again.svg?style=flat-square
[npm-url]: https://npmjs.org/package/request-again

[travis-image]: http://img.shields.io/travis/hemphillcc/request-again.svg?style=flat-square
[travis-url]: http://travis-ci.org/hemphillcc/request-again