module.exports = function () {
    const configuration = require('./configuration');

    const mq = require('./mq/mq')(configuration.amqpURL);
    const consumeReq = mq.channelConsumer(configuration.amqpQueueRequest);
    const publishRes = mq.channelPublisher(configuration.amqpQueueResponse);

    const mongoose = require('mongoose');

    const model = require('./database/model')(mongoose);

    // connect to our mongoDB database
    mongoose.connect(configuration.mLabURL, (error) => {
        if (error) {
            console.log(error);
        }
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Mongoose. Connection error:'));
    db.once('open', (callback) => {
        console.info('Mongoose. Mongoose connection opened');

    });

    console.info('Server MQ. Subscribed on defined requestQueue.');
    consumeReq.subscribe((reqMsg) => {
        const res = {
            error: false,
            errorDesc: '',
            data: undefined
        };

        console.log('Process request queue.');

        if (reqMsg && Buffer.isBuffer(reqMsg.content)) {
            // Mock:
            res.data = JSON.parse(reqMsg.content);
        } else {
            res.error = true;
            res.errorDesc = getErrorDesc(reqMsg);
        }

        // TODO - implement logic with filling res.data (and include code above in it)

        console.info('Server MQ. Publishing into responseQueue message:', res);
        publishRes(res);

        function getErrorDesc(reqMsg) {
            if (reqMsg) {
                if (!Buffer.isBuffer(reqMsg.content)) {
                    return 'Request message is not a buffer';
                }
            } else {
                return 'Empty request message';
            }
        }
    });
};