'use strict';

var express = require('express');
var socket = require('socket.io');
var assert = require('assert');
const path = require('path');
const { spawn } = require('child_process');

var server = express();

server.use('/', express.static(__dirname + '/'));

var io = socket(server.listen(process.env.PORT || 8080));

io.on('connection', function(objectSocket) {
  console.log('connection!');

  io.emit('message', {
    'text': 'Welcome to my chatroom!'
  });

  objectSocket.on('message', function(objectData) {

    // console.log('objectData',objectData.strQuery);
    console.log('objectData',objectData);

    // https://www.tutorialspoint.com/run-python-script-from-node-js-using-child-process-spawn-method
    function getPython() {
      return spawn('python3', [
        // M: unbuffered output
        // '-u',
        path.join(__dirname, 'markov.py'),
        objectData.strQuery
      ]);
    }
    const subprocess = getPython();
    subprocess.stdout.on('data', function(data) {
      io.emit('message', JSON.parse(data.toString()));
    });
    subprocess.stderr.on('data', function(data) {
      console.log(`error:${data}`);
    });
    subprocess.stderr.on('close', function() {
      console.log("Closed");
    });
  });

  objectSocket.on('disconnect', function() {
    console.log('disconnection!');
  });

});

