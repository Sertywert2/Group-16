require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { cleanEnv, str, port } = require('envalid');
const swaggerUi = require('swagger-ui-express');
const specs = require('./utils/swagger');
const feedbackRoutes = require('./routes/feedback');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/Admin');
const contactRoutes = require('./routes/contact');

// Validate environment variables
const env = cleanEnv(process.env, {
  MONGODB_URI: str(),
  JWT_SECRET: str({ minLength: 32 }),
  PORT: port({ default: 5000 }),
  EMAIL_SERVICE: str(),
  EMAIL_USER: str(),
  EMAIL_PASS: str(),
  ADMIN_EMAIL: str(),
  REDIS_URL: str({ default: 'redis://127.0.0.1:6379' }),
});

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console(),
  ],
});

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const feedbackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
});
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Stricter for contact
});
app.use('/api/feedback', feedbackLimiter);
app.use('/api/contact', contactLimiter);

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
const { httpRequestDuration } = require('./utils/metrics');
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(env.MONGODB_URI, {
  maxPoolSize: 10, // Connection pooling
})
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));
  // Create indexes
mongoose.connection.once('open', async () => {
  await mongoose.model('Feedback').collection.createIndex({ service: 1, region: 1, createdAt: -1 });
  await mongoose.model('Contact').collection.createIndex({ createdAt: -1 });
  logger.info('Indexes created');
});


// Start server
const PORT = env.PORT;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
