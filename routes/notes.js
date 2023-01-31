const express = require("express");
const router = express.Router();

router.get('/getUserNotes',(req,res)=>{
    
    res.json([])
})

module.exports = router;