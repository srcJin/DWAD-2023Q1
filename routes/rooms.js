// first, we require in Express
const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

// Lab 8 : import in the Forms
const { bootstrapField, createRoomForm } = require('../forms');

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

// lab8 : add create function to render the form 
router.get('/create', async (req, res) => {
    const productForm = createProductForm();
    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField)
    })
})

// lab8 : Process the submitted form
router.post('/create', async(req,res)=>{
    const productForm = createProductForm();  //first create a productForm object
    productForm.handle(req, {  //use its handle function to process the request. 
        //an object which contains a success function, which is run when the form is successfully processed. 
        'success': async (form) => {   // The first argument to the success function is the form itself
            
            const product = new Product();
            // retrieve the form data using form.data
            // then use the form data to create a new instance of the Product model, and then save it.

            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            await product.save();
            res.redirect('/products');
            // An instance of the model represents one row in the table. 
        }
    })
})

module.exports = router; // #3 export out the router
