const mq = require('./mq/mq');

mq.requestQueue.subscribe((reqMsg) => {
    const res = {
        error: false,
        errorDesc: '',
        data: undefined,
        reqContent: undefined
    };

    if (reqMsg && Buffer.isBuffer(reqMsg.content)) {
        res.reqContent = reqMsg.content;
        // Mock:
        res.data = JSON.parse(reqMsg.content);
    } else {
        res.error = true;
        res.errorDesc = getErrorDesc(reqMsg);
    }

    // TODO - implement logic with filling res.data (and include code above in it)

    mq.responseQueue.publish(res);

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