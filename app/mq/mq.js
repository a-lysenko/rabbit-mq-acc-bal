(function () {
    const configuration = require('../configuration');

    const mqPublisher = require('./mq-publisher');
    const registerMqConsumer = require('./register-mq-consumer');

    const open = require('amqplib').connect(configuration.amqpURL);

    const createdChannel = open
        .then((conn) => {
            return conn.createChannel();
        });

    createdChannel
        .then((channel) => {
            registerMqConsumer({
                channel: channel,
                amqpQueue: configuration.amqpQueue
            })
        })
        .catch(console.warn);

    exports.createdChannel = createdChannel;
    exports.publish = mqPublisher.bind(this, {
        createdChannel: createdChannel,
        amqpQueue: configuration.amqpQueue
    });
})();

