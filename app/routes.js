module.exports = function (app, mq) {
    app.get('/', (req, res) => {
        res.send('hello world');
    });

    app.get('/get_hotel/:id', (req, res) => {
        mq.requestQueue.publish({
            action: 'get-hotel',
            data: {
                id: req.params.id
            }
        })
            .then((bufferIsAllowed) => {
                if (!bufferIsAllowed) {
                    console.log('Routes. Error! Queue buffer is full on getting rate!');

                    res.status(503).send('Queue buffer is full!');
                }
            });

        const handlerId = mq.responseQueue.subscribe((msg) => {
            console.info('Response on route "get_hotel - by id". Called to response with message props:');
            console.info('\t msg.fields:', msg.fields);
            console.info('\t msg.content:', msg.content);
            res.status(200).json(JSON.parse(msg.content));

            console.log('handlerId', handlerId);
            mq.responseQueue.unsubscribe(handlerId);
        });
    });

    app.get('/get_hotels', (req, res) => {
        // TODO - this endpoint uses the same queue as endpoint 'add_hotel' what can lead to an error
        // so queues should be splitted. Probably by some identifier in scope of the same name although
        let {name, description, rate} = req.query;

        mq.requestQueue.publish({
            action: 'get',
            data: {
                name,
                description,
                rate
            }
        })
            .then((bufferIsAllowed) => {
                if (!bufferIsAllowed) {
                    console.log('Routes. Error! Queue buffer is full on getting hotels!');

                    res.status(503).send('Queue buffer is full!');
                }
            });

        const handlerId = mq.responseQueue.subscribe((msg) => {
            console.info('Response on route "get_hotels". Called to response with message props:');
            console.info('\t msg.fields:', msg.fields);
            console.info('\t msg.content:', msg.content);
            res.status(200).json(JSON.parse(msg.content));

            console.log('handlerId', handlerId);
            mq.responseQueue.unsubscribe(handlerId);
        });
    });

    app.post('/add_hotel', (req, res) => {
        const currentDate = Date.now();
        mq.requestQueue.publish({
            action: 'save',
            data: req.body
        })
            .then((bufferIsAllowed) => {
                if (!bufferIsAllowed) {
                    console.log('Error! Queue buffer is full!');

                    res.status(503).send('Queue buffer is full!');
                }
            });

        const handlerId = mq.responseQueue.subscribe((msg) => {
            console.info('Response on route "add_hotel". Called to response with message props:');
            console.info('\t msg.fields:', msg.fields);
            console.info('\t msg.content:', msg.content);
            res.status(200).json(JSON.parse(msg.content));

            console.log('handlerId', handlerId);
            mq.responseQueue.unsubscribe(handlerId);
        })
    });

    app.get('/get_rate/:id', (req, res) => {
        // TODO - this endpoint uses the same queue as endpoint 'add_hotel' what can lead to an error
        // so queues should be splitted. Probably by some identifier in scope of the same name although

        mq.requestQueue.publish({
            action: 'get-rate',
            data: {
                id: req.params.id
            }
        })
            .then((bufferIsAllowed) => {
                if (!bufferIsAllowed) {
                    console.log('Routes. Error! Queue buffer is full on getting rate!');

                    res.status(503).send('Queue buffer is full!');
                }
            });

        const handlerId = mq.rate.subscribe((msg) => {
            console.info('Response on route "get_rate". Called to response with message props:');
            console.info('\t msg.fields:', msg.fields);
            console.info('\t msg.content:', msg.content);
            res.status(200).json(JSON.parse(msg.content));

            console.log('handlerId', handlerId);
            mq.rate.unsubscribe(handlerId);
        });
    });

    app.get('*', function (req, res) {
        res.sendFile(process.cwd() + '/public/index.html'); // load our public/index.html file
    });
};