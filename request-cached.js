/* REQUIREMENTS */
var request = require('request');

/* DEFAULTS */
var defaults = {
  expires: 300000
};

/* CONSTRUCTORS */
function constructor(param1, param2, param3) {

  // handle constructor overloading
  var url, options, fn;
  if (typeof param1 === 'string') {
    url = param1;
  } else if (typeof param1 === 'object') {
    options = param1;
    url = param2;
  }

  // handle constructor errors
  if (!url) {
    throw new Error('Error calling request - URL string is undefined or malformed.');
  }

}

module.exports = constructor;

/* HELPERS */
