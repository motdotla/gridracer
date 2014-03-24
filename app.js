var dotenv      = require('dotenv');
dotenv.load();

var gpio        = require("gpio");

// Constants
var e               = module.exports;
e.ENV               = process.env.NODE_ENV || 'development';
var FORWARD_PIN     = 18;
var LEFT_PIN        = 23;
var DEFAULT_TIMEOUT = 100;
var COMMAND_TIMEOUT = 300;
var forward;
var left;

var port        = parseInt(process.env.PORT) || 3000;
var Hapi        = require('hapi');
server          = new Hapi.Server(+port, '0.0.0.0', { cors: true });

var directions = {
  forward: {
    handler: function (request) {
      var payload   = request.payload;
      console.log(payload);

      forward = gpio.export(FORWARD_PIN, {
        direction: 'out',
        interval: 200,
        ready: function() {
          setTimeout(function() {
            forward.set();
            setTimeout(function() {
              forward.removeAllListeners('change');
              forward.reset();
              forward.unexport();
              forward.unexport(function() {
                request.reply({success: true});
              });
            }, DEFAULT_TIMEOUT);
          }, COMMAND_TIMEOUT);
        }
      });
    }
  }
};

server.route({
  method  : 'GET',
  path    : '/forward',
  config  : directions.forward
});

server.start(function() {
  console.log('Server started at: ' + server.info.uri);
});
