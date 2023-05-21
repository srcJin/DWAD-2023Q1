// first, we require in Express
const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

//  #2 Add a new route to the Express router
// we use router to organise routes
// Example:
// one router for user sign up, log in, recover password
// one router for managing products
// one router for managing orders

// router for home page, address /
router.get('/', (req,res)=>{
    res.render("landing/home")
})

// router for about page
router.get('/about', function(req,res){
    res.render("landing/about")
})

router.get('/contact', function(req,res){
    res.render("landing/contact");
})

module.exports = router; // #3 export out the router
