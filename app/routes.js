module.exports = (app, mq) => {
    // respond with "hello world" when a GET request is made to the homepage
    app.get('/', (req, res) => {


        res.send('hello world');
    });

    app.get('/new-one', (req, res) => {
        const currentDate = Date.now();
        mq.publish('Data from new one on ' + currentDate)
            .then(() => {
                res.send('I am new one! (' + currentDate + ')');
            });
    });
};