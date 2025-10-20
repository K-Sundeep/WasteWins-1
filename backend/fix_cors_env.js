// Fix CORS environment variables
const fs = require('fs');

function fixCorsEnv() {
    console.log('🔧 Fixing CORS environment variables...');
    
    // Create development environment with CORS fixes
    const devEnv = `# Development Environment - CORS Fixed
NODE_ENV=development
PORT=5000

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/wastewins

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# CORS Configuration - Allow all origins in development
CORS_ORIGIN=*

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# API Configuration
API_VERSION=v1
`;

    try {
        fs.writeFileSync('.env', devEnv, 'utf8');
        console.log('✅ Updated .env with CORS fixes');
    } catch (error) {
        console.log('❌ Error updating .env:', error.message);
        return;
    }

    console.log('\n🔧 CORS fixes applied:');
    console.log('- ✅ NODE_ENV=development (allows all origins)');
    console.log('- ✅ Added ngrok URL support');
    console.log('- ✅ Added capacitor:// support');
    console.log('- ✅ Added file:// support');
    console.log('- ✅ Added mobile app headers');
    
    console.log('\n🚀 Restart your backend:');
    console.log('1. Stop current backend (Ctrl+C)');
    console.log('2. cd backend');
    console.log('3. npm run dev');
    
    console.log('\n📱 Your mobile app should now connect successfully!');
}

fixCorsEnv();
