const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',         require('./routes/authRoutes'));
app.use('/api/courses',      require('./routes/courseRoutes'));
app.use('/api/enrollments',  require('./routes/enrollmentRoutes'));
app.use('/api/progress',     require('./routes/progressRoutes'));
app.use('/api/quizzes',      require('./routes/quizRoutes'));
app.use('/api/ai',           require('./routes/aiRoutes'));
app.use('/api/certificates', require('./routes/certificateRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'LearnFlow API running ✅' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
