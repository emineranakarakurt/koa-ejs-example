const koa = require('koa');
const fs = require('fs');
const mount = require('koa-mount');
const static = require('koa-static');
const path = require('path')

//var file = fs.readFile('./public/images/070992.tif', {encoding: 'base64'});
const app = new koa();
var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

//console.log(file);

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');

    console.log(__dirname);

    //connection.sendBytes(request);

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });

    connection.on('message', function(message) {
        console.log("Response: ");
        console.log(message);    
    });

});

// client.connect("ws://xu@vm-sdc-09.icube.unistra.fr:8081");
client.connect("ws://127.0.0.1:8081");


app.use(mount('/favicon.ico',ctx => {
    // ignore favicon
    ctx.state = 200
  }));



app.use(
    mount('/other', async (ctx) => {

        ctx.request.req.on('data', async function(data){ 
            console.log('received req')
        })
        ctx.status = 200
    }
    )
);


module.exports = app;
