'use-strict';

/* REQUIREMENTS */

var request = require('request');
var cache = require('lru-cache');

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
  self.cloner = require('clone');
};

module.exports = new RequestAgain();

/* PROTOTYPE FUNCTIONS */

RequestAgain.prototype.enableCache = function(cacheOptions) {
  var self = this;
  self.cacheOptions = {
    max: cacheOptions.max || defaults.max,
    maxAge: cacheOptions.maxAge || defaults.maxAge
  };
  self.cache = new cache(self.cacheOptions);
  return self;
};

RequestAgain.prototype.cached = function(param1, param2, param3) {
  var self = this;
  var url, options, callback;

  if (typeof param1 === 'string') {
    // first param is the url
    url = param1;
    if (typeof param2 == 'object') {
      options = param2;
      callback = param3;
    } else if (typeof param2 == 'function') {
      options = {};
      callback = param2;
    } else {
      throw new Error('Request callback appears to be undefined or invalid.');
    }
  } else if (typeof param1 === 'object') {
    // first param is the options
    url = param1.url || param1.uri;
    if (param1.baseUrl) {
      url = param1.baseUrl + param1.uri;
    }
    options = param1;
    if (typeof param2 == 'function') {
      callback = param2;
    } else {
      throw new Error('Request callback appears to be undefined or invalid.');
    }
  }

  if (!url) {
    throw new Error('Request URL appears to be undefined or invalid.');
  }

  var optionsClone = self.cloner(options);
  var cachedResponse = self.getCache(url, optionsClone);
  if (cachedResponse) {
    return callback(null, null, cachedResponse);
  }
  request(url, options, function(err, res, body) {
    if (err) {
      return callback(err, null, null);
    }
    self.setCache(url, optionsClone, body);
    return callback(null, res, body);
  });
};

RequestAgain.prototype.setCache = function(url, options, value) {
  var self = this;
  var key = genKey(url, options);
  var valueClone = self.cloner(value);
  self.cache.set(key, valueClone);
  return;
};

RequestAgain.prototype.getCache = function(url, options) {
  var self = this;
  var key = genKey(url, options);
  var value = self.cache.get(key);
  var valueClone = self.cloner(value);
  return valueClone;
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
