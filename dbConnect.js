require("dotenv").config();
const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

 const dbConnection = () => {
    mongoose
    .connect(MONGO_URI)
    .then((res) => console.log("db conneceted"))
    .catch((err) => console.log(err));
};


module.exports = dbConnection
