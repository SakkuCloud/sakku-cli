let url = 'wss://worker.sakku.cloud:7221/exec/bb8fa29e323177f32e6c1ed96e7e2de9b1a25de17774d403c942fbf613918b76,YmFzaA==?app-id=556';
let url2 = 'ws://localhost:8080/';


// const WebSocket = require('websocket').client;

// var client = new WebSocket();

// client.on('connectFailed', function (error) {
//   console.log('Connect Error: ' + error.toString());
// });

// client.on('connect', function (connection) {
//   console.log('WebSocket Client Connected');
//   connection.on('error', function (error) {
//     console.log("Connection Error: " + error.toString());
//   });
//   connection.on('close', function () {
//     console.log('echo-protocol Connection Closed');
//   });
//   connection.on('message', function (message) {
//     console.log(message);
//     if (message.type === 'utf8') {
//       console.log("Received: '" + message.utf8Data + "'");
//     }
//   });

//   function sendNumber() {
//     if (connection.connected) {
//       var number = Math.round(Math.random() * 0xFFFFFF);
//       connection.sendUTF(number.toString());
//       setTimeout(sendNumber, 1000);
//     }
//   }
//   sendNumber();
// });

// client.connect(url, 'echo-protocol', null,{
//   "Accept-Encoding": "gzip, deflate, br",
//   "Accept-Encoding": "utf-8",
//   "Accept-Language": "ar,en-US;q=0.9,en;q=0.8",
//   "Cache-Control": "no-cache",
//   "Connection": "Upgrade",
//   "Origin": "https://worker.sakku.cloud:7221/",
//   "Pragma": "no-cache",
//   "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
//   'Sec-WebSocket-Key': 'her ur key from header in url',
//   'Sec-WebSocket-Version': "13",
//   "Upgrade": "websocket",
//   "User-Agent": "here your agent"
// }, null);



const WebSocket = require('ws');
const ws = new WebSocket(url, {
  perMessageDeflate: false,
  origin: 'https://worker.sakku.cloud:7221'
});

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(data) {
  console.log(data);
});

ws.on('error', function incoming(error) {
  console.log('error-------->', error);
});



// execService.exec(this, id, appUrl, { Detach: false, Tty: flags.tty }).then(response => {
              //   let stream = response.data;
              //   let socket = stream.socket;
              //   let whatIsTyped = '';
              //   let lastPressedKey = null;

              //   socket.on('data', (data: string) => { // Socket on Data Receive or Send
              //     process.stdin.pause();
              //     if (!firstLine) {
              //       // if (whatITyped !== data.toString() && whatITyped.charCodeAt(0) !== 27) {
              //       //   // console.log('==============================>1');
              //       //   // console.log(data.toString().charCodeAt(data.length - 1));
              //       //   // if (data.toString().charCodeAt(data.length - 1) === 13) {
              //       //   //   data = data.substr(0, data.length -1);
              //       //   // }
              //       //   process.stdout.write(data);
              //       // }
              //       // else {
              //       //   //console.log('=========>2');
              //       // }
              //     }
              //     firstLine = false;
              //     process.stdin.resume();
              //   });

              //   process.stdin.on('keypress', function (ch, key) {
              //     lastPressedKey = key;
              //     if (key && key.name === 'up') { // up key pressed
              //       console.log('up key is pressed');
              //       whatIsTyped = '';
              //       socket.write(key.sequence);
              //     }
              //     else if (key && key.name === 'down') { // down key pressed
              //       console.log('down key is pressed');
              //       whatIsTyped = '';
              //       socket.write(key.sequence);
              //     }
              //     else if (key && key.name === 'tab') { // tab pressed
              //       console.log('tab is pressed');
              //       if (lastPressedKey.name != 'tab' && whatIsTyped.length === 0) {
              //         socket.write(key.sequence + key.sequence);
              //       }
              //     }
              //     else if (key && key.name === 'return') { // enter pressed
              //       console.log('enter key is pressed');
              //       whatIsTyped += key.sequence;
              //       socket.write(whatIsTyped);
              //       whatIsTyped = '';
              //     }
              //     else if (key && key.ctrl && key.name == 'd') { // ctrl + d pressed
              //       console.log('ctrl + d is pressed');
              //       rl.emit('SIGINT', 'ctrl-d');
              //     }
              //     else {
              //       whatIsTyped += key.sequence;
              //     }
              //   });

              //   process.stdin.setRawMode(true);
              //   process.stdin.resume();

              //   rl.on('SIGINT', function (data: any) { // SIGINT Signal
              //     // stop input
              //     if (data === 'ctrl-d') {
              //       socket.emit('end');
              //       process.stdin.pause();
              //       process.stdout.write(exec_exit_msg);
              //       process.exit(0);
              //     }
              //     else {
              //       console.log('sdsdsdsdsdsdsdsd');
              //     }
              //   });
              // });