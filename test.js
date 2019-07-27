// var keypress = require('keypress');

// // make `process.stdin` begin emitting "keypress" events
// keypress(process.stdin);

// // listen for the "keypress" event
// process.stdin.on('keypress', function (ch, key) {
//   console.log('got "keypress"', key);
//   if (key && key.ctrl && key.name == 'c') {
//     process.stdin.pause();
//   }
// });

// process.stdin.setRawMode(true);
// process.stdin.resume();

// var btoa = require('btoa');
// var bin = "bash";
// var b64 = btoa(bin);

// console.log(b64);
// let url = 'wss://worker.sakku.cloud:7221/exec/bb8fa29e323177f32e6c1ed96e7e2de9b1a25de17774d403c942fbf613918b76,YmFzaA==?app-id=556'

// const WebSocket = require('ws');
 
// const ws = new WebSocket(url);
 
// ws.on('open', function open() {
//   ws.send('something');
// });
 
// ws.on('message', function incoming(data) {
//   console.log(data);
// });

// ws.on('error', function incoming(error) {
//   console.log('error-------->', error);
// });



const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
  })
  ws.send('ho!')
})



// const url = 'wss://localhost:8080/'
// const ws = new WebSocket(url);

// ws.on('open', function open() {
//   ws.send('something');
// });
 
// ws.on('message', function incoming(data) {
//   console.log(data);
// });

// ws.on('error', function incoming(error) {
//   console.log('error-------->', error);
// });