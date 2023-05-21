// first, we require in Express
const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

// #1 import in the model
const {Treatment} = require('../models')

//  #2 Add a new route to the Express router

// router for product page
router.get('/add', (req,res)=>{
    res.send("Add new treatment")
})

// # Fetch all treatments ( SELECT * from product_treatments )
router.get('/', async (req,res)=>{
    // #2 - fetch all the treatments (ie, SELECT * from treatments)
    let treatments = await Treatment.collection().fetch();
    res.render('treatments/index', {
        'treatments': treatments.toJSON() // #3 - convert collection to JSON
    })
})

module.exports = router; // #3 export out the router
