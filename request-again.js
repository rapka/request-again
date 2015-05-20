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
  url = param1;
  options = param2;
  callback = param3;

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

/* HELPERS */

function genKey(url, options) {
  return JSON.stringify({
    url: url,
    options: options
  });
}
