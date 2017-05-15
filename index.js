const express = require('express');

const app = express();

app.get('/', (req, res) => res.sendFile(__dirname + '/board.html'));
app.get('/board.css', (req, res) => res.sendFile(__dirname + '/board.css'));
app.get('/board.js', (req, res) => res.sendFile(__dirname + '/board.js'));

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

