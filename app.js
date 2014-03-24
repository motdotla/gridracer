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

var forward, left;
var commands = [
  {variable: forward, pin: 18}
  //{variable: left, pin: 23}
];

var port        = parseInt(process.env.PORT) || 3000;
var Hapi        = require('hapi');
server          = new Hapi.Server(+port, '0.0.0.0', { cors: true });

//var resetAndUnexportPin = function(pin, callback) {
//  setTimeout(function() {
//    pin.removeAllListeners('change');
//    pin.reset();
//    pin.unexport(function() {
//      callback();
//    });
//  }, DEFAULT_TIMEOUT);
//};

var firePin = function(pin, callback) {
  pin.set();
  setTimeout(function() {
    pin.reset();
    callback();
  }, DEFAULT_TIMEOUT);
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

commands.forEach(function(command) {
  command.variable = gpio.export(command.pin, {
    direction: 'out',
    interval: 200,
    ready: function() {
      console.log("Pin "+command.pin+" ready");
    }
 });
});

server.start(function() {
  console.log('Server started at: ' + server.info.uri);
});  


