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

var commands          = {
  forward: undefined, 
  left: undefined
};
var routes_info = [
  {
    name: 'forward', 
    simultaneous_commands: 'forward',
    pin: FORWARD_PIN
  },
  {
    name: 'left',
    simultaneous_commands: 'forward,left',
    pin: LEFT_PIN
  }
];

var port        = parseInt(process.env.PORT) || 3000;
var Hapi        = require('hapi');
server          = new Hapi.Server(+port, '0.0.0.0', { cors: true });

var firePins = function(pins, callback) {
  pins.forEach(function(pin) {
    pin.set();
    setTimeout(function() {
      pin.reset();
      callback();
    }, DEFAULT_TIMEOUT);
  });
};

routes_info.forEach(function(route_info) {
  commands[route_info.name] = gpio.export(route_info.pin, {
    direction: 'out',
    interval: 200,
    ready: function() {
      console.log("Pin "+route_info.pin+" ready");
    }
 });

 server.route({
   method : '*',
   path   : '/'+route_info.name,
   config : {
     handler : function(request) {
      var payload   = request.payload;
      console.log(payload);

      var pin = commands[route_info.name];

      firePins([pin], function() {
        request.reply({success: true});
      });
     }
   }
 });
});

server.start(function() {
  console.log('Server started at: ' + server.info.uri);
});  
