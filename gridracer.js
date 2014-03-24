var gpio = require("gpio");
var forward_pin     = 18;
var left_pin        = 23;
var default_timeout = 1000;
var command_timeout = 300;

var forward = gpio.export(forward_pin, {
  direction: 'out',
  ready: function() {
    setTimeout(function() {
      forward.set();
    }, command_timeout);
  }
});

//var left = gpio.export(left_pin, {
//  direction: 'out',
//  ready: function() {
//    setTimeout(function() {
//      left.set();
//    }, command_timeout);
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
}, default_timeout);
