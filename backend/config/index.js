module.exports = {
  PORT:           process.env.PORT           || 5000,
  MONGO_URI:      process.env.MONGO_URI      || 'mongodb://localhost:27017/resume_screening',
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:5001',
  MAX_FILE_SIZE:  10 * 1024 * 1024, // 10 MB
};
