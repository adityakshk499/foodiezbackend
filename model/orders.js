const mongoose = require("mongoose");
const { Schema } = mongoose;

const userOrdersSchema = new Schema(
  {
    userId: {
      type : String,
      required: true,
    },
    orders: {
      type : [],
      required: true,
    },
  },
  { collection: "userOrders" } 
);


module.exports = mongoose.model('userOrders',userOrdersSchema)