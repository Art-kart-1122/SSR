const {Router} = require('express');
const Course = require('../models/course');
const {courseValidator} = require("../utils/validators");
const {validationResult} = require('express-validator');
const router = Router();

function isOwner(course, req) {
   return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('UserId','email name');
        res.status(200);
        res.render('courses', {
            title: "Courses",
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses,
        });
    } catch (e) {
        console.log(e);
    }
})

router.get('/:id', async (req, res) => {
   try {
       const course = await  Course.findById(req.params.id);

       res.render('course', {
           layout: 'empty',
           title: course.title,
           course
       })
   } catch (e) {
       console.log(e);
   }
})

router.get('/:id/edit', async (req, res) => {
    if(!req.query.allow) {
        return res.redirect('/');
    }

    try {
        const course = await  Course.findById(req.params.id);

        if(! isOwner(course, req)) {
           return res.redirect('/courses')
        }
        res.render('course-edit', {
            title: `Edit ${course.title}`,
            course
        })
    } catch (e) {
        console.log(e);
    }
})

router.post('/remove', async (req, res) => {
    console.log(req.body.id);
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        });
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
})

router.post('/edit', courseValidator, async (req, res) => {
    const errors = validationResult(req);
    const {id} = req.body;

    if(!errors.isEmpty()) {
        return res.status(422).redirect(`/course/${id}/edit/?allow=true`)
    }

    try {
        const {id} = req.body;
        delete req.body.id;
        const course = await Course.findById(id);

        if(!isOwner(course, req)) return res.redirect('/courses')

        Object.assign(course, req.body);
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
})


module.exports = router;