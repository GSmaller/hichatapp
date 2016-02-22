/*
var http = require('http');

server = http.createServer(function(req, res){
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });

  res.write('hello world');
  res.end();
});

server.listen(8888);
*/
var users = [];
var express = require('express');
var fs = require('fs'),
    app = express(),
    server = require('http').createServer(app);
var io = require('socket.io').listen(server);
app.use("/", express.static(__dirname + '/www'));
server.listen(8888);

io.on('connection', function(socket) {
  socket.on('foo', function (data) {
    console.log(data);
  })

  socket.on('login', function (nickname) {
    if(users.indexOf(nickname) > -1){
      socket.emit('nickExisted');
    }else{
      socket.userIndex = users.length;
      socket.nickname = nickname;
      users.push(nickname);
      socket.emit('loginSucess');
      io.sockets.emit('system', nickname, users.length, 'login');
    }
  });

  socket.on('postMsg', function(msg) {
    socket.broadcast.emit('newMsg', socket.nickname, msg);
    //io.sockets.emit('newMsg', socket.nickname, msg);
  })

  socket.on('img', function(imgData) {
    socket.broadcast.emit('newImg', socket.nickname, imgData);
  })

  socket.on('disconnect', function () {
    users.splice(socket.userIndex, 1);
    socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
  })
})
//console.log("Server Started.");
