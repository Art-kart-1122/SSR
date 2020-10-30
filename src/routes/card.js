const {Router} = require('express');
const User = require('../models/user');
const Courses = require('../models/course');
const router = Router();


function mapCardItem(card) {
    return card.items.map(c => ({
        ...c.courseId._doc, count: c.count
    }))
}

function computePrice(courses) {
    return courses.reduce((total, c) => {
        return total+= c.price * c.count;
    }, 0)
}

router.post('/add', async (req, res) => {
    const course = await Courses.findById(req.body.id);
    await req.user.addToCart(course);
    res.redirect('/card');
})

router.get('/', async (req, res) => {
    const user = await req.user
        .populate('card.items.courseId')
        .execPopulate();
    const courses = mapCardItem(user.card);

    res.render('card', {
        title: "Card",
        isCard: true,
        price: computePrice(courses),
        courses
    })
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCard(req.params.id);
    const user = await req.user.populate('card.items.courseId').execPopulate();
    const courses = mapCardItem(user.card);
    const card = { courses,
        price: computePrice(courses),
        title: "Card",
        isCard: true
    };
    res.status(200).json(card);
})


module.exports = router;
