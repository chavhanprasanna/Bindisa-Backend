# Create .env file with necessary configurations
$envContent = @"
PORT=3000
NODE_ENV=development
DEMO_MODE=true

# Weather API
WEATHER_API_KEY=17c47e41f1124d6caa4191345253006

# JWT Configuration
JWT_SECRET=secret-at-least-256-bits-long
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACb3279288a72798326c3101493a24a1b5
TWILIO_AUTH_TOKEN=ab434f39c041e9426e9c5df135108d1a
TWILIO_PHONE_NUMBER=+13083373702

# Supabase Configuration
SUPABASE_URL=https://cqncfqpniagxssuiksik.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxbmNmcXBuaWFneHNzdWlrc2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMTAzMTYsImV4cCI6MjA2Njg4NjMxNn0.-KgL1mQFE7KPddIZb1lZc7Gy1MCTFL4Wrvoyqo4NkXU
"@

# Write to .env file
$envContent | Set-Content -Path ".env"

# Install dependencies
npm install

# Start the server
npm run dev
