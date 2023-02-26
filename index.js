const express = require('express');
const hbs = require('hbs'); // https://www.npmjs.com/package/hbs
const wax = require('wax-on'); // https://www.npmjs.com/package/wax-on

// import in the routes
const landingRoutes = require('./routes/landing');
const productsRoutes = require('./routes/products');

// create an instance of express app
const app = express();

// set the view engine
app.set('view engine', 'hbs'); // Add support for handlebars templating engine {{ ... }}

// static folder
app.use(express.static('.')); // Seems like express@4.18.2 already appends 'public' to the path

// setup wax-on
wax.on(hbs.handlebars); // register wax-on helpers with handlerbars
wax.setLayoutPath('./views/layout');

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

// register routes
app.use('/', landingRoutes);
app.use('/products', productsRoutes);

async function main() {}
main();

app.listen(3000, () => {
  console.log('Server has started');
});