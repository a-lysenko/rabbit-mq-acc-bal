(function () {
    module.exports = (createdChannel, amqpQueue) => {
        const subscribers = {};
        let channelInstance;

        createdChannel
            .then((channel) => {
                channelInstance = channel;
                return channelInstance.assertQueue(amqpQueue);
            })
            .then((ok) => {
                console.info('MQ Event. Asserting on consumering in', amqpQueue, 'queue. ok', ok);

                channelInstance.consume(amqpQueue, (msg) => {
                    if (msg == null) {
                        console.error('ERROR!', 'Queue', amqpQueue, 'consuming was canceled.');
                    }

                    channelInstance.ack(msg);
                    Object.keys(subscribers)
                        .forEach((handlerId) => {
                            subscribers[handlerId](msg);
                        });
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
