const fs = require('fs');
const http = require('http');
const WebSocket = require('websocket');

var highScores;
var questions;
fs.readFile('./scores.json', 'utf8', (err, data) => {
  highScores = JSON.parse(data);
});
fs.readFile('./questions.json', 'utf8', (err, data) => {
  questions = JSON.parse(data);
})

function randomQuestion() {
  let questionarr = Object.keys(questions);
  return questions[questionarr[Math.floor(Math.random() * questionarr.length)]];
}

const httpServer = HTTP.createServer((req, res) => {
});
server.listen(69423);

var clients = [];

const server = new WebSocket.server({
  httpServer: httpServer
});

server.on('request', (req) => {
  const connection = req.accept(null, req.origin);

  clients.push(connection);

  connection.on('message', (msg) => {
    switch (msg.utf8Data.type) {
      case 'scoresget':
        connection.sendUTF(highScores);
        break;
      case 'scoresset':
        highScores = msg.utf8Data.data;
        fs.writeFile('./scores.json', JSON.stringify(highScores), 'utf8', (err) => {console.error(err)});
        break;
      case 'questionget':
        connection.sendUTF(randomQuestion());
        break;
      case 'questionset':
        questions[msg.utf8Data.data.ask] = msg.utf8Data.data.questionData;
    }
  })
})
