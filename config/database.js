const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error("MongoDB URL is not defined in .env file");
        }

        // Kết nối MongoDB mà không cần các tùy chọn deprecated
        await mongoose.connect(uri);

        console.log("✅ Connected to MongoDB successfully!");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
    }
};


