var dotenv      = require('dotenv');
dotenv.load();

var gpio        = require("gpio");

// Constants
var e               = module.exports;
e.ENV               = process.env.NODE_ENV || 'development';
var FORWARD_PIN     = 18;
var LEFT_PIN        = 23;
var DEFAULT_TIMEOUT = 500;
var COMMAND_TIMEOUT = 300;
var forward;
var left;

var port        = parseInt(process.env.PORT) || 3000;
var Hapi        = require('hapi');
server          = new Hapi.Server(+port, '0.0.0.0', { cors: true });

var resetAndUnexportPin = function(pin, callback) {
  setTimeout(function() {
    pin.removeAllListeners('change');
    pin.reset();
    pin.unexport(function() {
      callback();
    });
  }, DEFAULT_TIMEOUT);
};

var firePin = function(pin, callback) {
  pin.set();
  resetAndUnexportPin(pin, function() {
    callback();
  });
};

var directions = {
  forward: {
    handler: function (request) {
      var payload   = request.payload;
      console.log(payload);

      firePin(forward, function() {
        request.reply({success: true});
      });
    }
  }
};

server.route({
  method  : 'GET',
  path    : '/forward',
  config  : directions.forward
});

forward = gpio.export(FORWARD_PIN, {
  direction: 'out',
  interval: 200,
  ready: function() {
    console.log("Pin "+FORWARD_PIN+" ready");

    server.start(function() {
      console.log('Server started at: ' + server.info.uri);
    });  
  }
});


