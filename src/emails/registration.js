const config = require('../config/server');

module.exports = function (email) {
    return {
        to: email,
        from: config.EMAIL,
        subject: 'Welcome',
        html: `<h1>You create account</h1>
                <a href=${config.BASE_URL}>Shop</a>`
    }
}