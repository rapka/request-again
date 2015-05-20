/* Requirements */
var chai = require('chai');
var expect = chai.expect;

var request = require('../request-again');

request.enableCache({
  max: 5,
  maxAge: 1000 * 60 * 1
});

function makeTheCall() {
  var startTime = Date.now();
  request.cached('http://pokeapi.co/api/v1/pokemon/1', {}, function(err, res, body) {
    return console.log('The request took:', Date.now() - startTime + ' ms');
  });
}

makeTheCall();
setTimeout(makeTheCall, 10);
setTimeout(makeTheCall, 800);
setTimeout(makeTheCall, 2000);
