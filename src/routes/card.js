const {Router} = require('express');
const Card = require('../models/card');
const Courses = require('../models/course');
const router = Router();

router.post('/add', async (req, res) => {
    const course = await Courses.getById(req.body.id);
    await Card.add(course);
    res.redirect('/card');
})

router.get('/', async (req,res) => {
    const courses = await Card.fetch();
    console.log(courses);
    res.render('card', {
        title: "Card",
        isCard: true,
        courses
    })
})

router.delete('/remove/:id', async (req, res) => {
    const card = await Card.remove(req.params.id);
    res.status(200).json(card);
})


module.exports = router;
