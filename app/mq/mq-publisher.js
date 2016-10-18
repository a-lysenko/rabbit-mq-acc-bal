(function () {
    module.exports = (createdChannel, amqpQueue) => {
        function publish(message) {
            return createdChannel
                .then((channel) => {
                    return channel.assertQueue(amqpQueue)
                        .then((ok) => {
                            console.log('asserting on publishing. ok', ok);
                            return channel.sendToQueue(amqpQueue, Buffer.from(message));
                        });
                });
        }

        return publish;
    };
})();
