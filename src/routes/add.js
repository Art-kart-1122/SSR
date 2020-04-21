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

router.post('/', async (req, res) => {
    const course = new Course(req.body.title, req.body.price, req.body.url);
    await course.save();
    res.redirect('/courses');
})


module.exports = router;