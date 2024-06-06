const mongoose = require('mongoose');
require('dotenv').config();

exports.connect=()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("DB connect successfully")
    })
    .catch((err)=>{
        console.log("db not connect");
        console.error(err);
        process.exit(1);
    })
}