<<<<<<< HEAD
require('./scheduler')();

const dbPool = require('./model/connection-pool')();
process.on('beforeExit', (e) => {
    dbPool.end();
})
process.on('exit', (e) => {
    dbPool.end();
=======
require('./scheduler')();

const dbPool = require('./model/connection-pool-eco')();
// const dbPool = require('./model/connection-pool')();
process.on('beforeExit', (e) => {
    dbPool.end();
})
process.on('exit', (e) => {
    dbPool.end();
>>>>>>> 6acba38c2c13ee3b989cc08e396e0310d26a915a
})