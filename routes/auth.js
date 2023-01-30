const express = require("express");
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// we will use post method otherwise user can get our data on their end which we dont want to show to our user
// router.get('/',async (req,res)=>{
  //create a user using : POST "/api/auth/createuser"
router.post('/createuser',[

    body('name','Enter a valid name').isLength({ min: 3 }),
     // email must be an email
    body('email','Email must be valid and contain @.').isEmail(),
    // password must be at least 5 chars long
    body('password','Password must be at least 5 character').isLength({ min: 5 }),

    ],
    async (req,res)=>{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check wether the user already exist
    try{
      let user = await User.findOne({email:req.body.email});
      if(user){
        return res.status(400).json({error: "User already exist with this email address"})
      }
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        })
      
        res.json(user)
          
    } catch (error){
      console.error(error.message);
      res.status(500).send("Error occured");
    }

})

module.exports = router;