const express = require("express");
const router = express.Router();
const foodItems = require("../model/foodItems");
const foodCategory = require("../model/foodCategory");
const users = require("../model/users");
const userOrders = require("../model/orders");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/getorders",async(req,res) => {
  if(req.body.token == null){

    return
  }
  var { userid } = JSON.parse(atob(req.body.token.split(".")[1]));
  
  try {
    const ordersData = await userOrders.find({userId:userid}) 
    res.status(200).json(ordersData)

  } catch (error) {
    console.log(error)
    res.status(400).json({success:false})
  }
})


router.post("/genrateorders", async (req, res) => {
  try {

  
    var { userid } = JSON.parse(atob(req.body.token.split(".")[1]));
    let isUser = await userOrders.find({ userId: userid })

    if (isUser.length === 0) {
      await userOrders.create({
        userId: userid,
        orders: [
          {
            orderDate: new Date(),
            orderData: req.body.cartItems,
          },
        ],
      });
      res.status(200).json({success:true});
      return
    } else {
      await userOrders.updateOne(
        { userId: userid },
        {
          $push: {
            orders: 
              {
                orderDate: new Date().toLocaleString(),
                orderData: req.body.cartItems,
              },
            
          },
        }
      );
      res.status(200).json({success:true});
      return
    }

    
  } catch (error) {
    res.status(400).json({success:false});
    console.log(error);
  }
});

router.get(
  "/getitems",

  async (req, res) => {
    try {
      const foodData = await foodItems.find({});
      const categoryData = await foodCategory.find({});

      res.json({ foodItems: foodData, foodCategory: categoryData });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userData = await users.find({ email: req.body.email });

      if (userData.length === 0) {
        return res.status(400).json({
          errors: [
            {
              value: "",
              msg: "email is invalid",
              param: "email",
              location: "body",
            },
          ],
        });
      }

      if (!bcrypt.compareSync(req.body.password, userData[0].password)) {
        return res.status(400).json({
          errors: [
            {
              value: "",
              msg: "password is invalid",
              param: "email",
              location: "body",
            },
          ],
        });
      }

     
      var token = jwt.sign(
        { userid: userData[0]._id.toString() },
        "adityakaushik"
      );

      res.status(200).json({ success: true, authToken: token });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  }
);

router.post(
  "/createuser",
  body("email").isEmail(),
  body("name").isLength({ min: 4 }),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const check = await users.find({ email: req.body.email });
      if (check.length != 0) {
        return res.status(400).json({
          errors: [
            {
              value: "",
              msg: "email is already registered",
              param: "email",
              location: "body",
            },
          ],
        });
      }
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(req.body.password, salt);

      const createuser = await users.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
      });
      res.send(createuser);
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
