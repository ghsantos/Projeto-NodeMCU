let clima = {'temperatura': '22', 'umidade': '57', 'luminosidade': '60'};
let socket = false;

exports.setEmiter = function (e) {
  socket = e;
}

exports.get = function () {
  console.log('get');
  return clima;
}

exports.set = function (data) {
  console.log('set');
  clima = data;

  if(socket) {
    console.log('socket');
    socket.emit('clima', data);
  }
}
