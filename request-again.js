'use-strict';

/* REQUIREMENTS */

var request = require('request');
var cache = require('lru-cache-for-clusters-as-promised');
var rp = require('request-promise');
var cloner = require('clone');

/* DEFAULTS */

var defaults = {
  max: 10,
  maxAge: 60000
};

/* CONSTRUCTORS */

var RequestAgain = function() {
  var self = this;
  self.cacheOptions = defaults;
  self.cache = new cache(self.cacheOptions);
};

module.exports = new RequestAgain();

/* PROTOTYPE FUNCTIONS */

RequestAgain.prototype.enableCache = function(cacheOptions) {
  var self = this;
  self.cacheOptions = {
    max: cacheOptions.max || defaults.max,
    maxAge: cacheOptions.maxAge || defaults.maxAge,
    namespace: 'images'
  };
  self.cache = new cache(self.cacheOptions);
  return self;
};

RequestAgain.prototype.cached = function() {
  var self = this;
  var url, options, callback;

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (typeof arg === 'string') {
      // url string
      url = arg;
    } else if (typeof arg === 'object') {
      // options object
      options = arg;
    } else if (typeof arg === 'function') {
      // callback function
      callback = arg;
    }
  }

  if (!url) {
    if (options.url || options.uri) {
      url = options.url || options.uri;
    } else {
      throw new Error('Request URL appears to be undefined or invalid.');
    }
  } else if (!callback) {
    throw new Error('Request callback appears to be undefined or invalid.');
  }

  // check for a cached response
  var optionsClone = cloner(options);

  var key = genKey(url, options);
  self.cache.get(key).then((value) => {
    if (value) {
      // Return the cached value
      // Need to create a new buffer here because reasons???
      var valueClone = cloner(new Buffer(value.data));
      return callback(null, null, valueClone);
    } else {
      // No cache yet - make the request
      return rp(options).then(function(body, skipCache) {
        var valueClone = cloner(body);

        return self.cache.set(key, valueClone).then(function() {
          return body;
        });
      })
      .then((body) => {
        return callback(null, null, body);
      }).catch(function (err) {
        callback(err, null, null);
      });
    }
  })
};

/* REQUEST FUNCTIONS */

RequestAgain.prototype.defaults = function(requestDefaults) {
  var self = this;
  request = request.defaults(requestDefaults);
  return self;
};

/* HELPERS */

function genKey(url, options) {
  return JSON.stringify({
    url: url,
    options: options
  });
}
