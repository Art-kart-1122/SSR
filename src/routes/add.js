const {validationResult} = require("express-validator");
const {courseValidator} = require("../utils/validators");

const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', (req, res) => {
    res.status(200);
    res.render('add', {
        title: "Adding new courses",
        isAdding: true
    });
});

router.post('/', courseValidator, async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('add', {
            title: 'Add course',
            isAdd: true,
            error: errors.array()[0].msg,
            data: {
                title: req.body.title,
                price: req.body.price,
                img: req.body.img
            }
        })
    }

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    });

    try {
        await course.save();
        res.redirect('/courses');
    } catch(e) {
        console.log(e);
    }
})


module.exports = router;