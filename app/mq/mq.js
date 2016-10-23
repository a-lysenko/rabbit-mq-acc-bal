(function () {
    const configuration = require('../configuration');

    const open = require('amqplib').connect(configuration.amqpURL);
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
    const consumeReq = mqConsumer(createdChannel, configuration.amqpQueueRequest);
    const consumeRes = mqConsumer(createdChannel, configuration.amqpQueueResponse);

    exports.createdChannel = createdChannel;
    exports.requestQueue = {
        publish: mqPublisher(createdChannel, configuration.amqpQueueRequest),
        subscribe: consumeReq.subscribe,
        unsubscribe: consumeReq.unsubscribe
    };
    exports.responseQueue = {
        publish: mqPublisher(createdChannel, configuration.amqpQueueResponse),
        subscribe: consumeRes.subscribe,
        unsubscribe: consumeRes.unsubscribe
    }
})();

