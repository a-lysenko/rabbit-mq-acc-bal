const configuration = require('../configuration');

const open = require('amqplib').connect(configuration.amqpURL);

require('./mq-publisher')(open, configuration.amqpQueue);
require('./mq-consumer')(open, configuration.amqpQueue);
