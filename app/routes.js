module.exports = function (app, mq) {
    app.get('/hello', (req, res) => {
        res.send('hello world!');
    });

    app.get('/get_hotel/:id', (req, res) => {
        const content = {
            action: 'get-hotel',
            data: {
                id: req.params.id
            }
        };

        publish(mq.requestQueue, content, res, 'get hotel by id');
        subscribe(mq.responseQueue, res, 'get hotel by id');
    });

    app.get('/get_hotels', (req, res) => {
        // TODO - this endpoint uses the same queue as endpoint 'add_hotel' what can lead to an error
        // so queues should be splitted. Probably by some identifier in scope of the same name although
        const {name, description, rate} = req.query;
        const content = {
            action: 'get',
            data: {
                name,
                description,
                rate
            }
        };

        publish(mq.requestQueue, content, res, 'get hotels');
        subscribe(mq.responseQueue, res, 'get hotels');
    });

    app.post('/add_hotel', (req, res) => {
        const content = {
            action: 'save',
            data: req.body
        };

        publish(mq.requestQueue, content, res, 'add hotel');
        subscribe(mq.responseQueue, res, 'add hotel');
    });

    app.get('/get_rate', (req, res) => {
        // TODO - this endpoint uses the same queue as endpoint 'add_hotel' what can lead to an error
        // so queues should be splitted. Probably by some identifier in scope of the same name although
        const {idBatch} = req.query;
        const resData = {};

        // NOTE: test
        let timeStart;

        idBatch.forEach((id) => {
            const content = {
                action: 'get-rate',
                data: {
                    id
                }
            };

            mq.rate.publish(content)
                .then((bufferIsAllowed) => {
                    if (!bufferIsAllowed) {
                        handleBufferIsFullError(res, `get rates by id batch. id: ${id}`);
                    }

                    timeStart = Date.now();
                });
        });

        const handlerId = mq.rate.subscribe((msg) => {
            logSubscribeHandling(msg, 'get rates by id batch');

            const {data: parsedData} = JSON.parse(msg.content);
            Object.assign(resData, parsedData);

            // NOTE: test
            resData.time = resData.time || {};
            resData.time[Object.keys(parsedData)[0]] = Date.now() - timeStart;

            // if (Object.keys(resData).length === idBatch.length) {
            if (Object.keys(resData).length > idBatch.length) {
                res.status(200).json({
                    data: resData
                });
                mq.rate.unsubscribe(handlerId);
            }
        });
    });

    app.get('*', function (req, res) {
        res.sendFile(process.cwd() + '/public/index.html'); // load our public/index.html file
    });

    function publish(queue, content, response, routeName = '-unspecified route-') {
        queue.publish(content)
            .then((bufferIsAllowed) => {
                if (!bufferIsAllowed) {
                    handleBufferIsFullError(response, routeName);
                }
            });
    }

    function subscribe(queue, response, routeName = '-unspecified route-') {
        const handlerId = queue.subscribe((msg) => {
            logSubscribeHandling(msg, routeName);

            response.status(200).json(JSON.parse(msg.content));
            queue.unsubscribe(handlerId);
        });
    }

    function handleBufferIsFullError(response, routeName) {
        console.error(`Routes. Error! Queue buffer is full on "${routeName}"!`);
        response.status(503).send('Queue buffer is full!');
    }

    function logSubscribeHandling(msg, routeName) {
        console.info(`Response on route "${routeName}". Called to response with message props:`);
        console.info('\t msg.fields:', msg.fields);
        console.info('\t msg.content:', msg.content);
    }
};