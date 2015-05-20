/* REQUIREMENTS */

var request = require('request');
var lru = require('lru-cache');
var clone = require('clone');

/* DEFAULTS */

var defaults = {
  max: 10,
  maxAge: 1000 * 60 * 1
};

/* CONSTRUCTORS */

var RequestAgain = function() {
  var self = this;
  self.cacheOptions = defaults;
  self.cache = lru(self.cacheOptions);
};

module.exports = new RequestAgain();

/* PROTOTYPE FUNCTIONS */

RequestAgain.prototype.enableCache = function(cacheOptions) {
  var self = this;
  self.cacheOptions = cacheOptions;
  self.cache = lru(self.cacheOptions);
  return self;
};

RequestAgain.prototype.cached = function(param1, param2, param3) {
  var self = this;
  var url, options, callback;
  url = param1;
  options = param2;
  callback = param3;

  var optionsClone = clone(options);

  var cachedResponse = self.getCache(url, optionsClone);
  if (cachedResponse) {
    return callback(null, null, cachedResponse);
  }

  request(url, options, function(err, res, body) {
    if (err) {
      return callback(err, null, null);
    }
    self.setCache(url, optionsClone, body);
    return callback(err, res, body);
  });
};

RequestAgain.prototype.setCache = function(url, options, value) {
  var self = this;
  if (self.cache) {
    var key = genKey(url, options);
    self.cache.set(key, value);
  } else {
    throw new Error('Cache not set on request-again object. You may have not constructed it properly.');
  }
};

RequestAgain.prototype.getCache = function(url, options) {
  var self = this;
  if (self.cache) {
    var key = genKey(url, options);
    return self.cache.get(key);
  } else {
    throw new Error('Cache not set on request-again object. You may have not constructed it properly.');
  }
};

RequestAgain.prototype.resetCache = function() {
  var self = this;
  if (self.cache) {
    self.cache.reset();
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
