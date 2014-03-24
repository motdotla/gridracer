var gpio = require("gpio");
var FORWARD_PIN     = 18;
var LEFT_PIN        = 23;
var DEFAULT_TIMEOUT = 700;
var COMMAND_TIMEOUT = 300;

var forward;
var left;

forward = gpio.export(FORWARD_PIN, {
  direction: 'out',
  interval: 200,
  ready: function() {
    setTimeout(function() {
      forward.set();
    }, COMMAND_TIMEOUT);
  }
});

//var left = gpio.export(LEFT_PIN, {
//  direction: 'out',
//  ready: function() {
//    setTimeout(function() {
//      left.set();
//    }, COMMAND_TIMEOUT);
//  }
//});

var commands = [forward];

setTimeout(function() {
  commands.forEach(function(command) {
    command.removeAllListeners('change');
    command.reset();
    command.unexport();
    command.unexport(function() {
      process.exit();
    });
  });
}, DEFAULT_TIMEOUT);
