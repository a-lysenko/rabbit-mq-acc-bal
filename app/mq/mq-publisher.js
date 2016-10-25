(function () {
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

                    return channelInstance.sendToQueue(amqpQueue, Buffer.from(message));
                });
        }

        return publish;
    };
})();
