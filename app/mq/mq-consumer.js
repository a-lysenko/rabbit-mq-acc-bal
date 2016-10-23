(function () {
    module.exports = (createdChannel, amqpQueue) => {
        const subscribers = {};
        let channelInstance;

        createdChannel
            .then((channel) => {
                channelInstance = channel;
                return channel.assertQueue(amqpQueue);
            })
            .then((ok) => {
                console.log('asserting on consumering. ok', ok);

                channelInstance.consume(amqpQueue, (msg) => {
                    if (msg !== null) {
                        console.log(msg.content.toString());
                        channelInstance.ack(msg);

                        Object.keys(subscribers)
                            .forEach((handlerId) => {
                                subscribers[handlerId](msg);
                            })
                    }
                });
            });

        function subscribe(handler) {
            const id = Date.now() + '_' + Math.ceil(Math.random() * 1000);
            subscribers[id] = handler;

            return id;
        }
        function unsubscribe(handlerId) {
            if (subscribers[handlerId]) {
                return delete subscribers[handlerId];
            }

            return false;
        }

        return {
            subscribe,
            unsubscribe
        };
    }
})();
