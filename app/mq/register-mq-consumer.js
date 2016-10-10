function registerMqConsumer(options) {
    const {channel, amqpQueue} = options;

    return channel.assertQueue(amqpQueue)
        .then((ok) => {
            console.log('asserting on consumering. ok', ok);
            return channel.consume(amqpQueue, (msg) => {
                if (msg !== null) {
                    console.log(msg.content.toString());
                    channel.ack(msg);
                }
            });
        });
}

module.exports = registerMqConsumer;
