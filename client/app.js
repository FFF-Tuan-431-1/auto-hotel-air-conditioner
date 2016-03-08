var Socket = require('socket.io-client');
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Please input the address ", function(address) {
  var socket = Socket(address);
  socket.on('connect', function(){
    console.log('connected to server');
    /*getmac.getMac((err, mac) => {
      socket.emit('info', {
        ip: ip.address(),
        mac: mac
      });
    });*/
  });

  socket.on('disconnect', function(){
  });
  rl.close();
});