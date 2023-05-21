// first, we require in Express
const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

// #1 import in the Product model
const {Headshot} = require('../models')

//  #2 Add a new route to the Express router

// router for product page
router.get('/add', (req,res)=>{
    res.send("Add new headshot")
})

// # Fetch all headshots ( SELECT * from product_headshots )
router.get('/', async (req,res)=>{
    // #2 - fetch all the headshots (ie, SELECT * from headshots)
    let headshots = await Headshot.collection().fetch();
    res.render('headshots/index', {
        'headshots': headshots.toJSON() // #3 - convert collection to JSON
    })
})

module.exports = router; // #3 export out the router
