const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB URL is not defined in .env file');
    }
    await mongoose.connect(uri); // Loại bỏ các tùy chọn không cần thiết
    console.log('✅ Connected to MongoDB successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
};