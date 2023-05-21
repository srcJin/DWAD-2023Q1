const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();

// boilder plate codes
// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
// Jin: content that not from routes are placed in public
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
    express.urlencoded({
        extended: false
    })
);

// import in the landing routes
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');


async function main() {
    // test messages:
    // app.get('/', (req, res) => {
    //     res.send("It's alive!")
    // })

    // use landing Routes
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);

}


main();

app.listen(3000, () => {
    console.log("Server has started! Listening on port 3000");
});
