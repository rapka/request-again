/* REQUIREMENTS */

var request = require('request');
var nodeCache = require('node-cache');
var clone = require('clone');

/* DEFAULTS */

var defaults = {
  stdTTL: 0,
  checkperiod: 600
};

/* CONSTRUCTORS */

var RequestAgain = function() {
  var self = this;
  self.cacheOptions = defaults;
  self.cache = new nodeCache(self.cacheOptions);
};

module.exports = new RequestAgain();

/* PROTOTYPE FUNCTIONS */

RequestAgain.prototype.enableCache = function(cacheOptions) {
  var self = this;
  self.cacheOptions = cacheOptions;
  self.cache = new nodeCache(self.cacheOptions);
  return self;
};

RequestAgain.prototype.cached = function(param1, param2, param3) {
  var self = this;
  var url, options, callback;
  url = param1;
  options = param2;
  callback = param3;

  var optionsClone = clone(options);

  self.getCache(url, optionsClone, function(err, cachedResponse) {
    if (cachedResponse) {
      return callback(null, null, cachedResponse);
    }
    request(url, options, function(err, res, body) {
      if (err) {
        return callback(err, null, null);
      }
      self.setCache(url, optionsClone, body, function(err, cacheSetSuccess) {
        return callback(null, res, body);
      });
    });
  });
};

RequestAgain.prototype.setCache = function(url, options, value, fn) {
  var self = this;
  if (self.cache) {
    var key = genKey(url, options);
    self.cache.set(key, value, function(err, success) {
      if (err || !success) {
        return fn(err);
      }
      return fn();
    });
  } else {
    throw new Error('Cache not set on request-again object. You may have not constructed it properly.');
  }
};

RequestAgain.prototype.getCache = function(url, options, fn) {
  var self = this;
  if (self.cache) {
    var key = genKey(url, options);
    return self.cache.get(key, function(err, value) {
      if (err || !value) {
        return fn(err);
      }
      return fn(null, value);
    });
  } else {
    throw new Error('Cache not set on request-again object. You may have not constructed it properly.');
  }
};

/* HELPERS */

function genKey(url, options) {
  return JSON.stringify({
    url: url,
    options: options
  });
}
