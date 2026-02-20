const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('whitelist')) {
      console.error('👉 ATTENTION: Your current IP address might not be whitelisted in MongoDB Atlas.');
      console.error('Please go to MongoDB Atlas -> Network Access and add "0.0.0.0/0" or your current IP.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
