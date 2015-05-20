/* Requirements */
var chai = require('chai');
var expect = chai.expect;

var request = require('../request-again');

request.enableCache({
  max: 100,
  maxAge: 1000 * 60 * 1
});

function makeTheCall() {
  var startTime = Date.now();
  request.cached('http://pokeapi.co/api/v1/pokemon/1', {}, function(err, res, body) {
    // console.log('err::', err);
    // console.log('body::', body);
    return console.log('It took:', Date.now() - startTime);
  });
}

makeTheCall();

setTimeout(makeTheCall, 2000);
