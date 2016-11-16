module.exports = (createdChannel, amqpQueue) => {
    const subscribers = {};
    let channelInstance;

    createdChannel
        .then((channel) => {
            channelInstance = channel;
            return channelInstance.assertQueue(amqpQueue);
        })
        .then((ok) => {
            console.info('MQ Event. Asserting on consumering in', amqpQueue, 'queue. ok.queue:', ok.queue);

            channelInstance.consume(amqpQueue, (msg) => {
                if (msg == null) {
                    console.error('ERROR!', 'Queue', amqpQueue, 'consuming was canceled.');
                }

                const content = JSON.parse(msg.content);
                console.info('MQ Event. Consumered in', amqpQueue, 'queue. ok', ok);
                console.log('\t message content', content);
                console.log('\t subscribers id-s', Object.keys(subscribers));


                Object.keys(subscribers)
                    .forEach((handlerId) => {
                        console.info('Server MQ. Processing subscriber with handlerId ', handlerId, 'on', amqpQueue, 'queue');
                        console.info('\t call with content', content);
                        subscribers[handlerId](msg);
                    });

                channelInstance.ack(msg);
            });
        });

    function subscribe(handler) {
        const id = Date.now() + '_' + Math.ceil(Math.random() * 1000);
        subscribers[id] = handler;

        console.info('Server MQ. Subscribed handler in ', amqpQueue, 'queue with id', id);
        return id;
    }
    function unsubscribe(handlerId) {
        if (subscribers[handlerId]) {
            console.info('Server MQ. Unsubscribed handler in ', amqpQueue, 'queue with handlerId', handlerId);
            return delete subscribers[handlerId];
        }

        return false;
    }

    return {
        subscribe,
        unsubscribe
    };
}