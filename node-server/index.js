const express = require("express");
fs = require('fs');
const { Server } = require('ws');
var https = require('https');
var http = require('http')

let key = fs.readFileSync(__dirname+'/secrets/tutorial.key','utf-8')
let cert = fs.readFileSync(__dirname+'/secrets/tutorial.crt','utf-8')

const parameters = {
  key: key,
  cert: cert
}

const inputs_port = 3000;
const game_port = 3001;

// Helper Functions
function processInput ( text ) 
{     
  fs.open('log.txt', 'a', 666, function( e, id ) {
   fs.write( id, String.fromCharCode(text), null, 'utf8', function(){
    fs.close(id, function(){
     console.log('file is updated');
    });
   });
  });
}


// Input Server
let inputs_app = express();
  // .use((req, res) => res.sendFile('/inputs.html', { root: __dirname }))
  // .listen(inputs_port, () => console.log(`Listening on ${inputs_port}`));

inputs_app.get('/',(req,res)=>{
    res.sendFile('/inputs.html', { root: __dirname })
})

let inputs_server = http.createServer(parameters,inputs_app);
inputs_server.listen(inputs_port,()=>{
  console.log(`Server is listening at port ${inputs_port}`)
})
const ws_inputs_server = new Server({ server:inputs_server });

ws_inputs_server.on('connection', (ws) => {
    console.log('New client connected!');
    
    ws.on('message', function (data) {
        // processInput(data)
        console.log(JSON.parse(data))
        ws_game_server.clients.forEach((client) => {
            client.send(JSON.stringify(data));
          });
    })
    
    ws.on('close', () => console.log('Client has disconnected!'));
  });

// Game Server
const game_server = express()
  .use((req, res) => res.sendFile('/inputs.html', { root: __dirname }))
  .listen(game_port, () => console.log(`Listening on ${game_port}`));

const ws_game_server = new Server({ server:game_server });

ws_game_server.on('connection', (ws) => {
    console.log('New client connected!');
        
    ws.on('close', () => console.log('Client has disconnected!'));
  });



