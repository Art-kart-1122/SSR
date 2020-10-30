if(process.env.NODE_ENV === 'production') {
    module.exports = require('./server.prod')
} else {
    module.exports = require('./server.dev')
}