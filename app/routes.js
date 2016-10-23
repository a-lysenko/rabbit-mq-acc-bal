module.exports = (app, mq) => {
    app.get('/', (req, res) => {


        res.send('hello world');
    });

    app.get('/new-one', (req, res) => {
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