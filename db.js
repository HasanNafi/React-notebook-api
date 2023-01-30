const mongoose = require('mongoose');
const mongoURI="mongodb+srv://root:root@cluster0.j8nkyz1.mongodb.net/inotebook"
// const mongoURI="mongodb://localhost:27017/inotebook?readPreference=primary&directConnection=true&ssl=false"

const connectToMongo=()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("connection to mongo successfully")
    })
}

module.exports = connectToMongo; 