const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    // await mongoose.connect("mongodb+srv://root:123@tientruong.ymkk3am.mongodb.net/OGANI?retryWrites=true&w=majority&appName=TienTruong");
    await mongoose.connect("mongodb://127.0.0.1:27017/OGANI");
    console.log("Connected Successful!")
  } catch (error) {
    console.log("Connected Failure")
  }
}

