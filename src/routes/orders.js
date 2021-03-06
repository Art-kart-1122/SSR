const {Router} = require('express');
const router = Router();

const Order = require('./../models/orders');

router.get('/', async (req, res) => {
    const orders  = await Order.find({'user.userId': req.user._id})
        .populate('user.userId')

    res.render('orders', {
        isOrders: true,
        title: 'Orders',
        orders: orders.map(o => {
            return {
                ...o._doc,
                price: o.courses.reduce((total, c) => {
                    return total += c.count * c.course.price;
                }, 0)
            }
        })
    })
})

router.post('/', async (req, res) => {
   try {
       const user = await req.user
           .populate('card.items.courseId')
           .execPopulate()

       const courses = user.card.items.map(i => ({
           count: i.count,
           course: i.courseId._doc
       }))

       const order = new Order({
           user: {
               name: req.user.name,
               userId: req.user
           },
           courses
       })

       await order.save();
       await req.user.clearCard();
       res.redirect('/orders');

   } catch (e) {
       console.log(e);
   }
})

module.exports = router;