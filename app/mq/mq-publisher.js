module.exports = (connection, queueName) => {
    connection
        .then(function (conn) {
            return conn.createChannel();
        })
        .then(function (ch) {
            return ch.assertQueue(queueName)
                .then(function (ok) {
                    console.log('asserting on publishing. ok', ok);
                    return ch.sendToQueue(queueName, new Buffer('something to do from First MQ'));
                });
        })
        .catch(console.warn);
};
