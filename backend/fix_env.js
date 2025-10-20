// Fix .env file by recreating it
const fs = require('fs');

const envContent = `# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration
DATABASE_URL=postgresql://postgres:sundeep@2007@localhost:5432/wastewins
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wastewins
DB_USER=postgres
DB_PASSWORD=sundeep@2007

# Redis Configuration (Optional - for caching)
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
`;

try {
    fs.writeFileSync('.env', envContent, 'utf8');
    console.log('✅ .env file recreated successfully');
    console.log('🔧 Password set to: sundeep@2007');
    console.log('📝 Try starting your backend now: npm run dev');
} catch (error) {
    console.log('❌ Error creating .env file:', error.message);
}
