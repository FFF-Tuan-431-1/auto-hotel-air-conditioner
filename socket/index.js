/*var Client = require('../models/client').Client;

var randomString = function() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
};

module.exports = function(socket) {
  console.log('a new client is online');

  socket.on('info', function(data) {
    console.log('online client ip is ' + data.ip);
    console.log('online client mac is ' + data.mac);

    data.mac = data.mac.replace(/:/g, '-');
    data.mac = data.mac.toUpperCase();
    socket.data = data;

    var c = null;

    Client.findOne({where: {mac: data.mac}}).then((client) => {
      if (!client) {
        return Client.create({mac: data.mac, name: randomString(), isOnline:true});
      }
      client.isOnline = true;
      client.save();
      return Promise.resolve(client);
    }).then((client) => {
      c = client;
      return client.getStates();
    }).then((states) => {
      if (states.length && states[states.length - 1].state === 'online') {
        return;
      }
      c.createState({
        ip: data.ip,
        state: 'online'
      });
    });
  });

  socket.on('disconnect',function(){
    console.log('offline client mac is ' + socket.data.mac);

    Client.findOne({where: {mac: socket.data.mac}}).then((client) => {
      client.isOnline = false;
      client.save().then(() => {
        return client.getStates();
      }).then((states) => {
        if (states.length && states[states.length - 1].state === 'offline') {
          return;
        }
        client.createState({
          ip: socket.data.ip,
          state: 'offline'
        });
      });
    });
  });
};