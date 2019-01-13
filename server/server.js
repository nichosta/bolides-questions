'use strict';

const fs = require('fs');
const http = require('http');
const WebSocket = require('websocket');

var questions = [];
fs.readFile('./questions.json', 'utf8', (err, data) => {
    try {
        questions = JSON.parse(data).questions;
    } catch (e) {
        questions = [];
    }
})

const httpServer = http.createServer((req, res) => {});
httpServer.listen(8675);

var clients = [];

const server = new WebSocket.server({
    httpServer: httpServer
});
console.log("Server status: ready");

server.on('request', (req) => {
    const connection = req.accept(null, req.origin);
    clients.push(connection);
    connection.on('message', (message) => {
        let msg;
        try {
            msg = JSON.parse(message.utf8Data);
        } catch (e) {
            return;
        }
        switch (msg.type) {
            case 'questionget':
                connection.sendUTF(JSON.stringify({ type: 'questions', data: questions }));
                break;
            case 'questionset':
                questions.push(msg.data);
                fs.writeFile('./questions.json', JSON.stringify({ "questions": questions }), 'utf8', (err) => { console.error(err) });
                break;
            case 'questiondelete':
                questions = msg.data;
                fs.writeFile('./questions.json', JSON.stringify({ "questions": questions }), 'utf8', (err) => { console.error(err) })
            default:
                connection.sendUTF("Invalid request");
                break;
        }
    })
})