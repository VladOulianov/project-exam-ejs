const express = require('express')
,     app = express() // express server
,     mysql = require('mysql') // mysql database
,     util = require('util')
,     path = require('path')
,     session = require('express-session') // sesion express
,     cookieParser = require('cookie-parser')
,     methodOverride = require('method-override') // ejs encoded
,     flash = require('connect-flash') // message flash
,     helmet = require("helmet") // secure http request
,     csrf = require('csurf') // secure auth user
,     port = 3000;

// SECURE REQUEST HTTP "HELMET"
app.use(helmet({contentSecurityPolicy: false}));

// .env
require('dotenv').config()

app.use(cookieParser());

// setup route middlewares CSURF
const csrfProtection = csrf({ cookie: true });
const parseForm = express.urlencoded({ extended: false });




// Middleware - Parser
app.use(express.json())
app.use(parseForm)





// METHODOVERRIDE
app.use(methodOverride('_method'))

// EJS
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


// Express-session
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  name: 'biscuit',
  cookie: {
    maxAge: 24 * 60 * 60 * 7 * 1000
  }
}))
// FLASH
//app.use(flash());



// MySQL
const db =  mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
);
db.connect((err) => {
    if (err) { throw err;}
    console.log('Connecté au serveur MySQL');
});
const query = util.promisify(db.query).bind(db);
global.query = query;



// MIDDLWARE
const verifyAdminAuth = require('./middlewares/admin.auth.middleware');
const verifyUsersAuth = require('./middlewares/user.auth.middleware');


// Router
const indexRoute = require('./routes/index.route');
const adminRoute = require('./routes/admin.route');
const userRoute = require('./routes/user.route');


// USER SESSION 
app.use(function (req, res, next) {
  const userId = req.session.userId
  const firstname = req.session.firstname

  res.locals.userSession = {
    userId,
    firstname
  }
  next()
})

// MESSAGE SESSION
app.use('*', (req, res, next)=>{
  res.locals.messagePass = req.session.messagePass
  delete req.session.messagePass
  res.locals.message = req.session.message
  delete req.session.message
  res.locals.input = req.session.input
  delete req.session.input
  next()
})
// app.use(function(req, res, next){
//   res.locals._token = req.csrfToken()
//     next() 
//   // res.locals.csrfToken = req.csrfToken()
//   // next()
// })
app.use(csrfProtection);
app.use(function (req, res, next) {
 
  // res.locals.csrftoken = req.csrfToken();
  // next();

  var token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  next();

});


// URL

app.use('/admin', csrfProtection, verifyAdminAuth, adminRoute);
app.use('/user', csrfProtection, userRoute);
app.use('/', csrfProtection, verifyUsersAuth, indexRoute);

// 404
app.get('*', function(req, res, next){
  res.status(404);
  res.render('404.ejs');
});
//500
app.get('*', function(req, res, next){
  res.status(500);
  res.render('500.ejs');
});
 
// Listen
app.listen(port, () => {
  console.log(`Tourne sur le port : ${port}`);
});