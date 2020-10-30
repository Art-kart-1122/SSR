const config = require('../config/server');

module.exports = function (email, token) {
    return {
        to: email,
        from: config.EMAIL,
        subject: 'Password recovery',
        html: `<h1>Click to link</h1>
                <a href="${config.BASE_URL}/auth/password/${token}">recovery AAAAAA</a>`
    }
}