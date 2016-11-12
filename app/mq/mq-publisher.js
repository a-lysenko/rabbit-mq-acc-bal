module.exports = (createdChannel, amqpQueue) => {
    let channelInstance;

    function publish(message) {
        return createdChannel
            .then((channel) => {
                channelInstance = channel;
                return channelInstance.assertQueue(amqpQueue);
            })
            .then((ok) => {
                console.info('MQ Event. Asserting on publishing in', amqpQueue, 'queue. ok', ok);
                console.info('\t with message:', message);

                const stringifiedMsg = JSON.stringify(message);

                return channelInstance.sendToQueue(amqpQueue, new Buffer(stringifiedMsg));
            });
    }

    return publish;
};