var gpio = require("gpio");

var gpio4 = gpio.export(4, {
   direction: 'out',
   interval: 200,
   ready: function() {
     gpio4.set();
   }
});
