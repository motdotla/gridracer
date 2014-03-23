var gpio = require("gpio");
var pin_number = 4;

var pin = gpio.export(pin_number, {
  direction: 'out',
  interval: 200,
  ready: function() {
    setTimeout(function() {
      pin.set();
    }, 1000);
  }
});
