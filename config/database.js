const mongoose = require('mongoose');
const { Pool } = require('pg');
const { promisify } = require('util');

// Database configuration
const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    retryAttempts: 3,
    retryDelay: 2000
  },
  mongodb: {
    uri: process.env.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    },
    retryAttempts: 3,
    retryDelay: 2000
  }
};

// Database connection manager
class DatabaseManager {
  constructor() {
    this.supabasePool = null;
    this.mongodb = null;
    this.isDemoMode = process.env.NODE_ENV === 'demo';
  }

  async connect() {
    try {
      // Try to connect to Supabase first
      if (config.supabase.url && config.supabase.key) {
        console.log('Attempting to connect to Supabase...');
        this.supabasePool = new Pool({
          connectionString: config.supabase.url,
          ssl: { rejectUnauthorized: false }
        });
        
        // Test connection
        await promisify(this.supabasePool.query).bind(this.supabasePool)('SELECT NOW()');
        console.log('Successfully connected to Supabase');
        return 'supabase';
      }

      // If Supabase fails or not configured, try MongoDB
      if (config.mongodb.uri) {
        console.log('Attempting to connect to MongoDB...');
        this.mongodb = await mongoose.connect(config.mongodb.uri, config.mongodb.options);
        console.log('Successfully connected to MongoDB');
        return 'mongodb';
      }

      // If both databases fail and we're in demo mode, use in-memory
      if (this.isDemoMode) {
        console.log('Running in demo mode - using in-memory storage');
        return 'demo';
      }

      throw new Error('Failed to connect to any database');
    } catch (error) {
      console.error('Database connection error:', error);
      if (this.isDemoMode) {
        console.log('Running in demo mode - using in-memory storage');
        return 'demo';
      }
      throw error;
    }
  }

  async close() {
    if (this.supabasePool) {
      await this.supabasePool.end();
    }
    if (this.mongodb) {
      await mongoose.connection.close();
    }
  }

  getDB() {
    return {
      supabase: this.supabasePool,
      mongodb: this.mongodb,
      isDemoMode: this.isDemoMode
    };
  }
}

module.exports = new DatabaseManager();
