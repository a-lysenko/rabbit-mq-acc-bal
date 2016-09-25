// Access the callback-based API
var amqp = require('amqplib/callback_api');
var amqpConn = null;

console.log('process.env.CLOUDAMQP_URL', process.env.CLOUDAMQP_URL);
console.log('process.env', process.env);
