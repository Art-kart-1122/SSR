const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const config = require('../config/server');

module.exports = nodemailer.createTransport(sendgrid({
    auth: {api_key: config.Sendgrid_API_KEY}
}))