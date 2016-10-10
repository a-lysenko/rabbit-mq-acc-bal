const express = require('express');
const app = express();

// set our port
const port = process.env.PORT || 3000;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/new-one', (req, res) => {
  res.send('I am new one!');
});

app.listen(port);