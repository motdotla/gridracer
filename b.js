var Gpio = require('onoff').Gpio;
var led  = new Gpio(18, 'out');
var led2  = new Gpio(23, 'out');

led.writeSync(0);
led2.writeSync(0);

function exit() {
  led.unexport();
  led2.unexport();
  process.exit();
}

process.on('SIGINT', exit);
