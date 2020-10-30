const User = require('../models/user');
const {Router} = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {validationResult} = require('express-validator');
const MailAgent = require('../emails/MailAgent');
const letterRegister = require('../emails/registration');
const letterReset = require('../emails/reset');
const {loginValidator} = require("../utils/validators");
const {registerValidator} = require('../utils/validators');
const router = Router();

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Authorization',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    })
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Recovery password',
        isLogin: true,
        error: req.flash('error'),
    })
})

router.get('/password/:token', async (req, res) => {
    if (!req.params.token) {
        return res.redirect('/auth/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if (!user) {
            return res.redirect('auth/login')
        } else {
            res.render('auth/password', {
                title: 'Recovery password',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }
    } catch (e) {
        console.log(e);
    }
})

router.post('/login', loginValidator, async (req, res) => {
    const {email, password} = req.body;
    try {
        const candidate = await User.findOne({email});

        if(candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if(areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true;
                req.session.save(err => {
                    if(err) throw new Error(err);
                    res.redirect('/');
                })
            } else {
                req.flash('loginError', 'Password is wrong');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'Login is wrong');
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e);
    }
})

router.post('/register', registerValidator, async (req, res) => {
    const {email, password, name} = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg);
            return res.status(422).redirect('/auth/login#register');
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email, name, password: hashPassword, cart: {items: []}
        })

        await user.save();
        res.redirect('/auth/login#login');
        await MailAgent.sendMail(letterRegister(email));
    } catch (e) {
        console.log(e);
    }
})

router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buff) => {
            if(err) {
                req.flash('error', 'Try again late');
                return res.redirect('/auth/reset');
            }

            const token = buff.toString('hex');
            const candidate = await User.findOne({email: req.body.email});

            if(candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 1000 * 60 * 30;
                await candidate.save();
                await MailAgent.sendMail(letterReset(candidate.email, token));
                res.redirect('/auth/login')
            } else {
                req.flash('error', 'Email is not exist');
                res.redirect('/auth/reset');
            }
        })
    } catch (e) {
        console.log(e);
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()}
        })

        if(user) {
            user.password = await bcrypt.hash(req.body.password, 10);
            user.resetToken = undefined;
            user.resetTokenExp = undefined;
            await user.save();
            res.redirect('/auth/login');

        } else {
            req.flash('loginError','Token timed out');
            res.redirect('/aut/login');
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;