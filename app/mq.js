var q = 'tasks';
var URL = 'amqp://gootiafl:s8rlkMIBgMRQ_IHLi87ZgWXNwa2TFtuP@spotted-monkey.rmq.cloudamqp.com/gootiafl';

var open = require('amqplib').connect(URL);

// Publisher 
open
    .then(function (conn) {
        return conn.createChannel();
    })
    .then(function (ch) {
        return ch.assertQueue(q)
            .then(function (ok) {
                console.log('asserting on publishing. ok', ok);
                return ch.sendToQueue(q, new Buffer('something to do from First MQ'));
            });
    })
    .catch(console.warn);

// Consumer 
open
    .then(function (conn) {
        return conn.createChannel();
    })
    .then(function (ch) {
        return ch.assertQueue(q)
            .then(function (ok) {
                console.log('asserting on publishing. ok', ok);
                return ch.consume(q, function (msg) {
                    if (msg !== null) {
                        console.log(msg.content.toString());
                        ch.ack(msg);
                    }
                });
            });
    })
    .catch(console.warn);