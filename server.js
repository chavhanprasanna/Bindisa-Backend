const express = require('express');

const authRoutes = require('./routes/auth.routes.js');
const dashboardRoutes = require('./routes/dashboard.routes.js');
const userRoutes = require('./routes/user.routes');
const soilTestRoutes = require('./routes/soil_test.routes.js');

const cropRoutes = require('./routes/crop.routes');
const cropSuggestionRoutes = require('./routes/crop_suggestion.routes');
const farmingPlanRoutes = require('./routes/farming_plan.routes');
const demoRoutes = require('./routes/demo.routes');
const npkRoutes = require('./routes/npk.routes');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const errorHandler = require('./middleware/error.middleware');
const { loggingMiddleware } = require('./middleware/logging.middleware');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger.js');
require('dotenv').config();

const app = express();
app.disable('x-powered-by'); // Hide Express signature
const PORT = process.env.PORT || 3002;

// Limit payload size
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

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

// Swagger documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.openweathermap.org'],
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
app.use(express.json());
// Sanitize data against NoSQL injection
app.use(mongoSanitize());
// Prevent HTTP Parameter Pollution
app.use(hpp());

// Connect to MongoDB with proper error handling
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bindisa';

mongoose.connect(mongoURI, {

  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4 // Use IPv4, skip trying IPv6
})
.then(() => {
  console.log('MongoDB connected successfully');
  // Initialize models after successful connection
  require('./models/soil_test');
  require('./models/crop_suggestion');
  require('./models/farming_plan');
  require('./models/user');
  require('./models/state.model');
  require('./models/district.model');
  require('./models/crop.model');
  require('./models/crop_requirement.model');
  require('./models/fertilizer.model');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if MongoDB connection fails
});

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



// Add compression middleware
app.use(require('compression')());

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/users', userRoutes);
app.use('/soil-tests', soilTestRoutes);
app.use('/farming-plans', farmingPlanRoutes);
app.use('/crop-suggestions', cropSuggestionRoutes);
app.use('/crops', cropRoutes);
app.use('/api/npk', npkRoutes);
app.use('/demo', demoRoutes);

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