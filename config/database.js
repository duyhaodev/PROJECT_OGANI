const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_CLOUD_ADMIN);
    console.log("Connected Successful!")
  } catch (error) {
    console.log("Connected Failure")
  }
}

