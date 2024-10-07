const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require('mongoose')
const router = require("./routes/user.route");


let PORT = process.env.PORT || 4000;
let URI = process.env.URI

app.use(express.json());
app.use("/", router);

app.listen(PORT,()=>{
  mongoose.connect(URI).then(()=>{
      console.log(`App is running on port ${PORT}, and Database is connected`);
  })
  .catch((err)=>{
      console.log(`App is not running on port ${PORT}, and Database is not connected`);
  })
})