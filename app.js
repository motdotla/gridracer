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
var commands_metadata = [
  {name: 'forward', pin: FORWARD_PIN},
  {name: 'left', pin: LEFT_PIN}
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

commands_metadata.forEach(function(command_metadata) {
  commands[command_metadata.name] = gpio.export(command_metadata.pin, {
    direction: 'out',
    interval: 200,
    ready: function() {
      console.log("Pin "+command_metadata.pin+" ready");
    }
 });

 server.route({
   method : '*',
   path   : '/'+command_metadata.name,
   config : {
     handler : function(request) {
      var payload   = request.payload;
      console.log(payload);

      var pin = commands[command_metadata.name];

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
