module.exports = function (amqpURL) {
    const open = require('amqplib').connect(amqpURL);
    const createdChannel = open
        .then((conn) => {
            return conn.createChannel();
        })
        .catch((err) => {
            console.error('Error on connection to "cloudamqp" server (or on creating a channel).', err);
            return Promise.reject(err);
        });

    const mqPublisher = require('./mq-publisher');
    const mqConsumer = require('./mq-consumer');

    return {
        createdChannel,
        channelPublisher,
        channelConsumer
    };

    function channelPublisher(queueName) {
        return mqPublisher(createdChannel, queueName);
    }

    function channelConsumer(queueName) {
        return mqConsumer(createdChannel, queueName);
    }
};

