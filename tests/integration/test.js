const assert = require('assert');

const request = require('supertest');
const app = require(__dirname + '/../../index');

// describe('Array', function() {
//     describe('#indexOf()', function() {
//         it('should return -1 when the value is not present', function() {
//             assert.equal(-1, [1,2,3].indexOf(4));
//         });
//     });
// });

// xdescribe('GET /get_hotels', function () {
//     it('should contain text "Hello, Express!"', function (done) {
//         request(app)
//             .get('/get_hotels')
//             .expect(/Hello, Express!/, done)
//     })
// });

describe('GET /hello', function () {
    it('should contain text "Hello, Express!"', function (done) {
        request(app)
            .get('/hello')
            .expect(/Hello, Express!/, done)
    })
});