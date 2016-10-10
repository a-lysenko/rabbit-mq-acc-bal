const express = require('express');
const app = express();

// set our port
const port = process.env.PORT || 3000;

const mq = require('./mq/mq');

require('./routes')(app, mq);

app.listen(port);