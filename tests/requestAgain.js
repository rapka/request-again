var chai = require('chai');
var expect = chai.expect;
var requestAgain = require('../request-again').defaults({
  timeout: 5000,
  strictSSL: false
});

function makeTheCall() {
  var startTime = Date.now();
  requestAgain.cached('http://pokeapi.co/api/v1/pokemon/1', {
    someOption: 'aValueForTheOption'
  }, function(err, res, body) {
    console.log('\nerr::', err);
    return console.log('The request took:', Date.now() - startTime + ' ms\n');
  });
}

makeTheCall();
setTimeout(makeTheCall, 10);
setTimeout(makeTheCall, 800);
setTimeout(makeTheCall, 2000);
