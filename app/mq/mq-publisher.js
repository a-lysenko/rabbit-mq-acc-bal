(function () {
    module.exports = (options, message) => {
        const {createdChannel, amqpQueue} = options;

        return createdChannel
            .then((channel) => {
                return channel.assertQueue(amqpQueue)
                    .then((ok) => {
                        console.log('asserting on publishing. ok', ok);
                        return channel.sendToQueue(amqpQueue, Buffer.from(message));
                    });
            });
    };
})();
