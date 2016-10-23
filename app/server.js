const express = require('express');
const app = express();

// set our port
const port = process.env.PORT || 3000;

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/../public'));

const mq = require('./mq/mq');

mq.requestQueue.subscribe((reqMsg) => {
    console.log('In responseQueue consume handler. msg.content.toString()', reqMsg.content.toString());
    mq.responseQueue.publish('resent ' + reqMsg.content.toString());
});

require('./routes')(app, mq);

app.listen(port);