module.exports = function (app, mq) {
    app.get('/', (req, res) => {
        res.send('hello world');
    });

    app.get('/get_hotel/:id', (req, res) => {
        const currentDate = Date.now();
        mq.requestQueue.publish('Data from new one on ' + currentDate)
            .then((bufferIsAllowed) => {
                if (!bufferIsAllowed) {
                    console.log('Error! Queue buffer is full!');

                    res.status(503).send('Queue buffer is full!');
                }
            });

        const handlerId = mq.responseQueue.subscribe((msg) => {
            //console.log('Gotten msg', msg, 'type', typeof msg);
            //console.log('countResSent', countResSent);
            res.status(200).json({
                msg: msg.content.toString()
            });

            console.log('handlerId', handlerId);
            mq.responseQueue.unsubscribe(handlerId);
        })
    });

    app.get('/get_hotels', (req, res) => {
        // TODO - uncomment this and remove a mock below
        // const currentDate = Date.now();
        // mq.requestQueue.publish('Data from new one on ' + currentDate)
        //     .then((bufferIsAllowed) => {
        //         if (!bufferIsAllowed) {
        //             console.log('Error! Queue buffer is full!');
        //
        //             res.status(503).send('Queue buffer is full!');
        //         }
        //     });
        //
        // const handlerId = mq.responseQueue.subscribe((msg) => {
        //     //console.log('Gotten msg', msg, 'type', typeof msg);
        //     //console.log('countResSent', countResSent);
        //     res.status(200).json({
        //         msg: msg.content.toString()
        //     });
        //
        //     console.log('handlerId', handlerId);
        //     mq.responseQueue.unsubscribe(handlerId);
        // })

        res.status(200).json([
            {
                id: 'id_01',
                name: 'Hotel 1',
                description: 'Lorem',
                rate: 3
            },
            {
                id: 'id_02',
                name: 'Hotel 2',
                description: 'Lorem',
                rate: 3
            },
            {
                id: 'id_03',
                name: 'Hotel 1-2-3',
                description: 'Lorem ipsum',
                rate: 5
            }
        ]);
    });

    app.post('/add_hotel', (req, res) => {
        const currentDate = Date.now();
        mq.requestQueue.publish('Data from new one on ' + currentDate)
            .then((bufferIsAllowed) => {
                if (!bufferIsAllowed) {
                    console.log('Error! Queue buffer is full!');

                    res.status(503).send('Queue buffer is full!');
                }
            });

        const handlerId = mq.responseQueue.subscribe((msg) => {
            //console.log('Gotten msg', msg, 'type', typeof msg);
            //console.log('countResSent', countResSent);
            res.status(200).json({
                msg: msg.content.toString()
            });

            console.log('handlerId', handlerId);
            mq.responseQueue.unsubscribe(handlerId);
        })
    });

    app.get('*', function (req, res) {
        res.sendFile(process.cwd() + '/public/index.html'); // load our public/index.html file
    });
};