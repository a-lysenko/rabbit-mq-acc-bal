(function () {
    module.exports = (createdChannel, amqpQueue) => {
        function consume(handler) {
            createdChannel.then((channel) => {
                return channel.assertQueue(amqpQueue)
                    .then((ok) => {
                        console.log('asserting on consumering. ok', ok);
                        return channel.consume(amqpQueue, (msg) => {
                            if (msg !== null) {
                                console.log(msg.content.toString());
                                channel.ack(msg);

                                handler(msg);
                            }
                        });
                    });
            });
        }

        return consume;
    }
})();
