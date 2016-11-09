module.exports = function (app, mq) {
    // TODO remove mock after related implementation
    const mockHotels = [
        {
            id: Math.random().toString().slice(-6),
            name: 'Hotel 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci ' +
            'cupiditate totam quidem? Cumque praesentium incidunt cum quis reprehenderit ' +
            'aspernatur velit aut recusandae alias similique aliquid, nulla accusamus officiis ' +
            'repellat explicabo porro ex! Similique, dolorum! Tempore dolorem, nihil eveniet, debitis ' +
            'dolorum, animi deserunt alias, nobis incidunt libero quae cupiditate similique optio!',
            rate: 3
        },
        {
            id: Math.random().toString().slice(-6),
            name: 'Hotel 2',
            description: 'Lorem',
            rate: 3
        },
        {
            id: Math.random().toString().slice(-6),
            name: 'Hotel 1-2-3',
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci ' +
            'cupiditate totam quidem? Cumque praesentium incidunt cum quis reprehenderit ' +
            'aspernatur velit aut recusandae alias similique aliquid, nulla accusamus officiis ' +
            'repellat explicabo porro ex! Similique, dolorum! Tempore dolorem, nihil eveniet, debitis ' +
            'dolorum, animi deserunt alias, nobis incidunt libero quae cupiditate similique optio!',
            rate: 5
        }
    ];

    app.get('/', (req, res) => {
        res.send('hello world');
    });

    app.get('/get_hotel/:id', (req, res) => {
        // TODO replace a mock with real implementation
        const mockHotel = mockHotels.find((hotel) => {
                return hotel.id === req.params.id;
            }) || {};
        res.status(200).json(mockHotel);
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

        res.status(200).json(mockHotels);
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