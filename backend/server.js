require('dotenv').config();
const express      = require('express');
const mongoose     = require('mongoose');
const cors         = require('cors');
const path         = require('path');
const { PORT, MONGO_URI } = require('./config');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/resume', require('./routes/resume'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'Resume Screening Backend' }));

// Error handler (must be last)
app.use(errorHandler);

// MongoDB Connection with better error handling
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB Connected Successfully');
    console.log(`📦 Database: ${conn.connection.db.databaseName}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`);
      console.log(`📊 API Endpoints:`);
      console.log(`   - POST http://localhost:${PORT}/api/resume/upload`);
      console.log(`   - GET  http://localhost:${PORT}/api/resume/all`);
      console.log(`   - DELETE http://localhost:${PORT}/api/resume/:id`);
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 Please check:');
    console.error('   1. MongoDB URI in .env file');
    console.error('   2. Network connection');
    console.error('   3. MongoDB Atlas whitelist (0.0.0.0/0)');
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('\n👋 MongoDB connection closed. Exiting...');
  process.exit(0);
});

// Connect to database
connectDB();
