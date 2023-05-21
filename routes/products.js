// first, we require in Express
const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

//  #2 Add a new route to the Express router

// router for product page
router.get('/add', (req,res)=>{
    res.send("Add new product")
})

module.exports = router; // #3 export out the router
