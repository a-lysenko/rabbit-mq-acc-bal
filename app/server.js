const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// set our port
const port = process.env.PORT || 3000;
const configuration = require('./configuration');

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/../public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const mq = require('./mq/mq')(configuration);

// mq.requestQueue.subscribe((reqMsg) => {
//     console.log('In responseQueue consume handler. msg.content.toString()', reqMsg.content.toString());
//     mq.responseQueue.publish('resent ' + reqMsg.content.toString());
// });

require('./routes')(app, mq);

app.listen(port);