(function () {
    const configuration = require('../configuration');

    const open = require('amqplib').connect(configuration.amqpURL);
    const mqPublisher = require('./mq-publisher');

    const mqConsumer = require('./mq-consumer');


    const createdChannel = open
        .then((conn) => {
            return conn.createChannel();
        })
        .catch((err) => {
            console.error('Error on connection to "cloudamqp" server (or on creating a channel).', err);
            return Promise.reject(err);
        });

    exports.createdChannel = createdChannel;
    exports.publish = mqPublisher(createdChannel, configuration.amqpQueue);
    exports.consume = mqConsumer(createdChannel, configuration.amqpQueue);

})();

