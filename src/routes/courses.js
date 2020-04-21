const {Router} = require('express');
const Course = require('../models/course');
const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.getAllCourses();
    res.status(200);
    res.render('courses', {
        title: "Courses",
        isCourses: true,
        courses,
    });
})

router.get('/:id', async (req, res) => {
    const course = await  Course.getById(req.params.id);
    console.log(course)
    res.render('course', {
        layout: 'empty',
        title: course.title,
        course
    })
})

router.get('/:id/edit', async (req, res) => {
    if(!req.query.allow) {
        return res.redirect('/');
    }
    const course = await  Course.getById(req.params.id);
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.post('/edit', async (req, res) => {
    await Course.update(req.body);
    res.redirect('/');
})


module.exports = router;