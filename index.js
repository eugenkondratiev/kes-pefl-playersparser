require('./scheduler')();

const dbPool = require('./model/connection-pool-eco')();
// const dbPool = require('./model/connection-pool')();
process.on('beforeExit', (e) => {
    dbPool.end();
})
process.on('exit', (e) => {
    dbPool.end();
})