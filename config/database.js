const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/projectbhx');
    console.log("Connected Successful!")
  } catch (error) {
    console.log("Connected Failure")
  }
}

