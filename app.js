var dotenv      = require('dotenv');
dotenv.load();

var gpio        = require("gpio");

// Constants
var e               = module.exports;
e.ENV               = process.env.NODE_ENV || 'development';
var FORWARD_PIN     = 18;
var REVERSE_PIN     = 23;
var DEFAULT_TIMEOUT = 800;
var COMMAND_TIMEOUT = 300;

var port        = parseInt(process.env.PORT) || 3000;
var Hapi        = require('hapi');
server          = new Hapi.Server(+port, '0.0.0.0', { cors: true });

var forwardPin = gpio.export(FORWARD_PIN, {
  direction: 'out',
  interval: 200,
  ready: function() {
    console.log("Pin "+FORWARD_PIN+" ready");
  }
});

var reversePin = gpio.export(REVERSE_PIN, {
  direction: 'out',
  interval: 200,
  ready: function() {
    console.log("Pin "+REVERSE_PIN+" ready");
  }
});

var forward = function () {
  forwardPin.set();
  setTimeout(function() {
    forwardPin.reset();
  }, DEFAULT_TIMEOUT);
};

var reverse = function () {
  reversePin.set();
  setTimeout(function() {
    reversePin.reset();
  }, DEFAULT_TIMEOUT);
};

server.route({
  method: "*",
  path: "/f",
  config: {
    handler: function(request) {
      forward();
      request.reply({success: true});
    }
  }
});

server.route({
  method: "*",
  path: "/r",
  config: {
    handler: function(request) {
      reverse();
      request.reply({success: true});
    }
  }
});

server.route({
  method: "*",
  path: "/inbound",
  config: {
    handler: function(request) {
      var payload = request.payload;
      var subject = payload.subject.trim();
      console.log(subject);

      if (subject === 'f') {
        forward();
      }
      if (subject === 'r') {
        reverse();
      }

      request.reply({success: true});
    }
  }
});

server.start(function() {
  console.log('Server started at: ' + server.info.uri);
});  
