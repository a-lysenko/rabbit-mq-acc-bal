const express = require('express');
const app = express();

// set our port
const port = process.env.PORT || 3000;

const mq = require('./mq/mq');

mq.consume((msg) => {
    console.log('In consume handler. msg.content.toString()', msg.content.toString());
});

require('./routes')(app, mq);

app.listen(port);