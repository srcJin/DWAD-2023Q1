// first, we require in Express
const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

// #1 import in the Product model
const {Room} = require('../models')

//  #2 Add a new route to the Express router

// router for product page
router.get('/add', (req,res)=>{
    res.send("Add new room")
})

// # Fetch all rooms ( SELECT * from product_rooms )
router.get('/', async (req,res)=>{
    // #2 - fetch all the rooms (ie, SELECT * from rooms)
    let rooms = await Room.collection().fetch();
    res.render('rooms/index', {
        'rooms': rooms.toJSON() // #3 - convert collection to JSON
    })
})

module.exports = router; // #3 export out the router
