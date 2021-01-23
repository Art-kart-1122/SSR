const  {body} = require('express-validator');
const User = require('../models/user');

module.exports.registerValidator = [
    body('email').isEmail().withMessage('Enter correct email')
        .custom(async (value, {req}) => {
        try {
            const user = await User.findOne({email: value});
            if(user) return Promise.reject('User with this email ia ,exist')

        } catch (e) {
            console.log(e);
        }
    }).normalizeEmail(),
    body('password', 'Password must be consist minimum 6 symbols')
        .isLength({min: 6 , max: 50}).trim(),
    body('confirm').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Passwords must be equal')
        }
        return true
    }).trim(),
    body('name').isLength({min: 3, max: 50})
        .withMessage('Name must be consist minimum 3 symbol').trim()
]

module.exports.loginValidator = [
    body('email').isEmail().withMessage('Enter correct email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value});
                if(!user) return Promise.reject('User with this email ia exist')

            } catch (e) {
                console.log(e);
            }
        }).normalizeEmail(),
    body('password', 'Password must be consist minimum 6 symbols')
        .isLength({min: 6 , max: 50}).trim()
]

module.exports.courseValidator = [
body('title').isLength({min: 3, max: 2000})
    .withMessage('Min length is 3 symbol').trim(),
body('price').isNumeric().withMessage('Enter correct price'),
body('img', 'Enter correct URl image').isURL()
]