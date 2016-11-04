module.exports = function (configuration) {
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
    const mqPublisherToChannel = mqPublisher.bind(mqPublisher, createdChannel);

    const publishReq = mqPublisher(createdChannel, configuration.amqpQueueRequest);
    const publishRes = mqPublisher(createdChannel, configuration.amqpQueueResponse);

    const mqConsumer = require('./mq-consumer');
    const mqConsumerToChannel = mqPublisher.bind(mqPublisher, createdChannel);

    const consumeReq = mqConsumer(createdChannel, configuration.amqpQueueRequest);
    const consumeRes = mqConsumer(createdChannel, configuration.amqpQueueResponse);

    return {
        createdChannel,
        requestQueue: {
            publish: publishReq,
            subscribe: consumeReq.subscribe,
            unsubscribe: consumeReq.unsubscribe
        },
        responseQueue: {
            publish: publishRes,
            subscribe: consumeRes.subscribe,
            unsubscribe: consumeRes.unsubscribe
        }
    }
};

