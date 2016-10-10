module.exports = (connection, queueName) => {
    connection
        .then(function (conn) {
            return conn.createChannel();
        })
        .then(function (ch) {
            return ch.assertQueue(queueName)
                .then(function (ok) {
                    console.log('asserting on publishing. ok', ok);
                    return ch.consume(queueName, function (msg) {
                        if (msg !== null) {
                            console.log(msg.content.toString());
                            ch.ack(msg);
                        }
                    });
                });
        })
        .catch(console.warn);
};
