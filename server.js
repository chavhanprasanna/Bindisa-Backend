const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes.js');
const dashboardRoutes = require('./routes/dashboard.routes.js');
const userRoutes = require('./routes/user.routes');
const soilTestRoutes = require('./routes/soil_test.routes.js');
const cropRoutes = require('./routes/crop.routes');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const errorHandler = require('./middleware/error.middleware');
const { loggingMiddleware } = require('./middleware/logging.middleware');
const { validationMiddleware } = require('./middleware/validation.middleware');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
require('dotenv-safe').config();

const app = express();
app.disable('x-powered-by'); // Hide Express signature
const PORT = process.env.PORT || 3000;

// Health check endpoint for Render and uptime monitoring
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Limit payload size
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'],
  credentials: true
}));

// Trust first proxy in production (needed for secure cookies / rate-limiter correct IP)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  // TODO: Enforce HTTPS in production
}

// Logging middleware
app.use(loggingMiddleware);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser middleware
app.use(bodyParser.json());
// Sanitize data against NoSQL injection
app.use(mongoSanitize());
// Prevent HTTP Parameter Pollution
app.use(hpp());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bindisa')
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// API Documentation
app.get('/', (req, res) => {
  res.send(`
    <h1>Bindisa Backend API Documentation</h1>
    
    <h2>Authentication Endpoints</h2>
    <h3>POST /auth/login</h3>
    <pre>
    Request body: {
      "mobile": "1234567890"  // 10-digit mobile number
    }
    Response: {
      "success": true,
      "message": "OTP has been sent to 1234567890"
    }
    </pre>

    <h3>POST /auth/otp-verify</h3>
    <pre>
    Request body: {
      "mobile": "1234567890",  // 10-digit mobile number
      "otp": "123456"         // 6-digit OTP
    }
    Response: {
      "verified": true,
      "message": "OTP verified successfully",
      "data": {
        "token": "jwt_token_here"
      }
    }
    </pre>

    <h3>GET /dashboard/data</h3>
    <pre>
    Headers: {
      "Authorization": "Bearer jwt_token_here"
    }
    Response: {
      "recentSoilTests": [...],
      "aiSuggestions": [...],
      "profitSummary": {...},
      "weather": {...},
      "upcomingTasks": [...]
    }
    </pre>
  `);
});

// Add validation middleware before routes
app.use(validationMiddleware);

// Add compression middleware
app.use(compression());

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/users', userRoutes);
app.use('/soil-tests', soilTestRoutes);

// 404 handler - must be before error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Performing graceful shutdown...');
  server.close(() => {
    console.log('Server closed. Disconnecting from MongoDB...');
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

// Store server instance
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});