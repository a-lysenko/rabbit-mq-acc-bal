module.exports = function () {
    const configuration = require('./configuration');

    const mq = require('./mq/mq')(configuration.amqpURL);
    const consumeReq = mq.channelConsumer(configuration.amqpQueueRequest);
    const publishRes = mq.channelPublisher(configuration.amqpQueueResponse);

    const handledActions = {
        save: 'save',
        get: 'get'
    };

    const mongoose = require('mongoose');
    // Use native promises
    mongoose.Promise = global.Promise;

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
            reqError: false,
            reqErrorDesc: '',
            dbError: false,
            dbErrorDesc: '',
            data: {}
        };

        console.log('Process request queue.');

        if (reqMsg && Buffer.isBuffer(reqMsg.content)) {
            let {action, data}  = JSON.parse(reqMsg.content);

            switch (action) {
                case handledActions.save:
                    let hotel = new model.Hotel(data);

                    hotel.save()
                        .then((savedHotel) => {
                            console.log('Server MQ. Hotel successfully saved. Hotel:', savedHotel);
                            res.data.id = savedHotel._id;
                            publishRes(res);
                        })
                        .catch((err) => {
                            console.error('Server MQ. Error occured on hotel save:', err);
                            res.dbError = true;
                            res.dbErrorDesc = err;
                            publishRes(res);
                        });
                    break;
                case handledActions.get:
                    console.log('Search filter', data);
                    let {name, description, rate} = data;
                    const filter = {};
                    // TODO - query contain some unused mete data related to fields. Use it

                    if (name) {
                        filter.name = new RegExp(name.value);
                    }
                    if (description) {
                        filter.description = new RegExp(description.value);
                    }
                    if (rate) {
                        filter.rate = +rate.value;
                    }

                    // NOTE - idea not to get rate together with hotels but implement separate request
                    // and demonstrate rabbitMQ functionality on cuncurrent flow
                    model.Hotel.find(filter)
                        .select('-rate')
                        .then((foundHotels) => {
                            console.log('Server MQ. Hotel successfully got. foundHotels:', foundHotels);
                            res.data = foundHotels;
                            publishRes(res);
                        })
                        .catch((err) => {
                            console.error('Server MQ. Error occurred on get hotels:', err);
                            res.dbError = true;
                            res.dbErrorDesc = err;
                            publishRes(res);
                        });
                    break;
            }

        } else {
            res.reqError = true;
            res.reqErrorDesc = getErrorDesc(reqMsg);
            console.error('Server MQ. Publishing error message into responseQueue message:', res);
            publishRes(res);
        }

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