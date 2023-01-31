const express = require("express");
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); //importing for generating hash of each password
var jwt = require('jsonwebtoken'); // for creating secure connection between client and server
var fetchuser = require('../middleware/fetchuser'); // fetching user credentials from middleware


const JWT_SECRET = "jwtsecret@1";

//=========================================  create USER credentials   ====================================================
// we will use post method otherwise user can get our data on their end which we dont want to show to our user
// router.get('/',async (req,res)=>{
//ROUTE:1 =>----------create a user using : POST "/api/auth/createuser" .No login required
router.post('/createuser',[

    body('name','Enter a valid name').isLength({ min: 3 }),
     // email must be an valid email
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

      //salt and secondaryPass return promises thats why we need to add "await" 
      const salt = await bcrypt.genSalt(10); // generating salt of 10 chacracter for password hash
      const secondaryPass =await bcrypt.hash(req.body.password, salt); // creates hash for password+salt
      // create a new user
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secondaryPass
        })
        const data = {
          user:{
            id:user.id
          }
        }
        const authToken = jwt.sign(data,JWT_SECRET); //creating token which we will send to our user to login next time with token
        res.json({authToken})//sending token to user end
          
    }
    //catch errors
    catch (error){
      console.error(error.message);
      res.status(500).send("Internal server error");
    }

})



//=========================================     User login credentials      ======================================
//ROUTE:2 =>----------authenticate user login using : POST "/api/auth/login" .No login required
router.post('/login',[

   // email must be an valid email
  body('email','Email must be valid and contain @.').isEmail(),
  body('password','Password can not be blank').exists(),

  ],
  async (req,res)=>{
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body;
  try{
    let user = await User.findOne({email}); //finding email id in the datatabse that email is exist in datatbase or not
    if(!user){
      return res.status(400).json({error:"Please login with correct credentials"});
    }

    const passwordCompare = await bcrypt.compare(password,user.password); //bcrypt is comparing hashes of user password to the passwords in database
    if(!passwordCompare){
      return res.status(400).json({error:"Please login with correct credentials"});
    }
    const data = {
      user:{
        id:user.id
      }
    }
    const authToken = jwt.sign(data,JWT_SECRET); //creating token which we will send to our user to login next time with token
    res.json({authToken})//sending token to user end

  }//catch errors
  catch (error){
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
}
)



//=========================================     User NOTES credentials      ======================================
//ROUTE:3 =>----------get loged in user details using : POST "/api/auth/getUserData" .login required
router.post('/getUserData',fetchuser,async (req,res)=>{  //fetchuser is coming from middleware folder which is a intercom connection for user whenever we need to check user login details we will call this middleware for checking user credentials
    
    try {
      userId = req.user.id;
      const user = await User.findById(userId)
      res.send(user);
    } catch (error) {
      console.error(error.message);
        res.status(500).send("Internal server error");
    }
 })
module.exports = router;