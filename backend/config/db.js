const mongoose = require('mongoose');

let lastError = null;

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    lastError = 'MONGODB_URI is not defined';
    console.error(`❌ ${lastError}`);
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    lastError = null;
  } catch (error) {
    lastError = error.message;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('whitelist')) {
      console.error('👉 ATTENTION: IP Whitelist issue detected.');
    }
    // DO NOT process.exit(1) in background mode for Render
  }
};

const getLastError = () => lastError;

module.exports = { connectDB, getLastError };
