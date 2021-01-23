const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');

const config = require('./config/server');

const homeRoute = require('./routes/home');
const addRoute = require('./routes/add');
const coursesRoute = require('./routes/courses');
const cardRoute = require('./routes/card');
const ordersRoute = require('./routes/orders');
const authRoute = require('./routes/auth');
const profileRoute = require('./routes/profile');

const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorMiddleware = require('./middleware/error');
const fileMiddleware = require('./middleware/file');

const app = express();


const hbs = exphbs.create({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
});


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use('/images', express.static(path.join(__dirname, '/../images')));
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: config.Session_Secret_Key,
    resave: false,
    saveUninitialized: false
}))
/*
app.use(async (req, res, next) => {
    try {
        const user = await User.findById('5eef801002f7011c7cd77d96');
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
    }
})

 */
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
//app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoute);
app.use('/add', addRoute);
app.use('/courses', coursesRoute);
app.use('/card', cardRoute);
app.use('/orders', ordersRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);

app.use(errorMiddleware);
const PORT = process.env.PORT || 3500;

async function start() {
    try {
        const connectURL = config.MongoDB_ConnectURI;
        await mongoose.connect(connectURL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        /*
        const candidate = await User.findOne();
        if(!candidate) {
            const user = new User({
                email: 'artur@zver.com',
                name: 'Artur',
                password: '123',
                card: {items: []}
            });
            await user.save();
        }
        */

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();
