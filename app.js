const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const {MONGOURI} = require('./keys')


mongoose.connect(MONGOURI);
mongoose.connection.on('connected',()=>{
    console.log("Connected to mongoose");
})

mongoose.connection.on('error',(err)=>{
    console.log("Error while Connecting to mongoose",err);
})

require('./models/user')
require('./models/blog')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/blog'))


app.listen(PORT,()=>{
    console.log("server is running on ",PORT)
})