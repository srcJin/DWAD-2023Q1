const express = require('express');
const hbs = require('hbs'); // https://www.npmjs.com/package/hbs
const wax = require('wax-on'); // https://www.npmjs.com/package/wax-on
const session = require('express-session');
const flash = require('connect-flash');
const csurf = require('csurf');
const FileStore = require('session-file-store')(session);


// import in the routes
const landingRoutes = require('./routes/landing');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');

// create an instance of express app
const app = express();

// set the view engine
app.set('view engine', 'hbs'); // Add support for handlebars templating engine {{ ... }}

// add support for session management
app.use(session({
  store: new FileStore(),
  secret: '__secret__', // TODO: Store this in env
  resave: false,
  saveUninitialized: true,
}));

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// enable csrf
app.use(csurf());

// Note that the urlencoded middleware needs to come first before
// the csurf middleware so that the urlencoded can parse the form data
// before the csurf middleware can consume it.

// add support for flash
// flash is a special area of the session used for storing messages
app.use(flash());
app.use(function (req, res, next) {
  // The res.locals is an object that contains the local variables for the response
  // which are scoped to the request only and therefore just available for the views 
  // rendered during that request or response cycle
  res.locals.successMessages = req.flash('success_messages');
  res.locals.errorMessages = req.flash('error_messages');

  // This is so that the rendered page has access to the logged in user details
  res.locals.user = req.session.user;

  // share the csrf token to frontend
  res.locals.csrfToken = req.csrfToken();

  // call next to hand over to the next middleware/handler in the pipeline
  next();
});

// static folder
app.use(express.static('.')); // Seems like express@4.18.2 already appends 'public' to the path

// setup wax-on
wax.on(hbs.handlebars); // register wax-on helpers with handlerbars
wax.setLayoutPath('./views/layout');

// register routes
app.use('/', landingRoutes);
app.use('/products', productsRoutes);
app.use('/users', usersRoutes);

async function main() {}
main();

app.listen(3000, () => {
  console.log('Server has started');
});