require("dotenv").config();
const express = require("express");
const app = express();
const dbConnection = require("./dbConnect");
const cors = require('cors')
const PORT = process.env.PORT || 3000;
const path = require('path');
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname,'build')) );
app.use('/api/v1/', require('./routes/route'))


app.use('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'build','index.html'))
})


const start =  ()=>{
    try {
         dbConnection()
        app.listen(PORT, console.log(`app is listening`));
    } catch (error) {
        console.log(error)
    }
}

start()



