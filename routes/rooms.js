// first, we require in Express
const express = require("express");
const router = express.Router(); // #1 - Create a new express Router

// Lab 8 : import in the Forms
const { bootstrapField, createRoomForm } = require("../forms");

// #1 import in the Room model
const { Room } = require("../models");

//  #2 Add a new route to the Express router

// router for room page
router.get("/add", (req, res) => {
  res.send("Add new room");
});

// # Read: Fetch all rooms ( SELECT * from room_rooms )
router.get("/", async (req, res) => {
  // #2 - fetch all the rooms (ie, SELECT * from rooms)
  let rooms = await Room.collection().fetch();
  res.render("rooms/index", {
    rooms: rooms.toJSON(), // #3 - convert collection to JSON
  });
});

// lab8 : add create function to render the form
router.get("/create", async (req, res) => {
  const roomForm = createRoomForm();
  res.render("rooms/create", {
    form: roomForm.toHTML(bootstrapField),
  });
});

// lab8 : Create a new room. Process the submitted form
router.post("/create", async (req, res) => {
  const roomForm = createRoomForm(); //first create a roomForm object
  roomForm.handle(req, {
    //use its handle function to process the request.
    //an object which contains a success function, which is run when the form is successfully processed.
    success: async (form) => {
      // The first argument to the success function is the form itself

      const room = new Room();
      // retrieve the form data using form.data
      // then use the form data to create a new instance of the Room model, and then save it.

      room.set("name", form.data.name);
      room.set("cost", form.data.cost);
      room.set("description", form.data.description);
      await room.save();
      res.redirect("/rooms");
      // An instance of the model represents one row in the table.
    },
    // handle error and display the error
    error: async (form) => {
      res.render("rooms/create", {
        // The bootstrapField function in forms/index.js will format the error messages properly.
        form: form.toHTML(bootstrapField),
      });
    },
  });
});

// 9 : Update an existing room
// The first part we read in the room_id URL parameter.
// This stores the id of the room that we want to update.
// We retrieve the room instance with that specific room id and store it in the room variable.

router.get("/:room_id/update", async (req, res) => {
  // retrieve the room
  const roomId = req.params.room_id;
  const room = await Room.where({
    id: roomId,
  }).fetch({
    require: true,
  });

  const roomForm = createRoomForm();

  // fill in the existing values
  // In the second part of the code (the second block of highlighted code), we once again create a roomForm.
  // However this time round we assign the value of each field from its corresponding key in the room .

  roomForm.fields.name.value = room.get("name");
  roomForm.fields.cost.value = room.get("cost");
  roomForm.fields.description.value = room.get("description");

  // Finally, we send the form and the room variable to the hbs file for rendering.
  res.render("rooms/update", {
    form: roomForm.toHTML(bootstrapField),
    room: room.toJSON(),
  });
});

router.post("/:room_id/update", async (req, res) => {
  // fetch the room that we want to update
  const room = await Room.where({
    id: req.params.room_id,
  }).fetch({
    require: true,
  });

  // process the form
  const roomForm = createRoomForm();
  roomForm.handle(req, {
    success: async (form) => {
      room.set(form.data);
      room.save();
      res.redirect("/rooms");
    },
    error: async (form) => {
      res.render("rooms/update", {
        form: form.toHTML(bootstrapField),
        room: room.toJSON(),
      });
    },
  });
});

// Delete a room
// fetch the room that the user wishes to delete, and send it to the hbs file rooms/delete.
router.get('/:room_id/delete', async(req,res)=>{
    // fetch the room that we want to delete
    const room = await Room.where({
        'id': req.params.room_id
    }).fetch({
        require: true
    });

    res.render('rooms/delete', {
        'room': room.toJSON()
    })

});

// process the delete
router.post('/:room_id/delete', async(req,res)=>{
    // fetch the room that we want to delete
    const room = await Room.where({
        'id': req.params.room_id
    }).fetch({
        require: true
    });
    await room.destroy();
    res.redirect('/rooms')
})


module.exports = router; // #3 export out the router
