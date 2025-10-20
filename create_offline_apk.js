// Create offline APK with mock data (no backend needed)
const fs = require('fs');

function createOfflineAPK() {
    console.log('📱 Creating offline APK with mock data...');
    
    // Update .env for offline mode
    const offlineEnv = `# Offline Mode - No backend required
VITE_API_URL=mock://localhost/api/v1
VITE_OFFLINE_MODE=true

# Analytics disabled
VITE_ENABLE_ANALYTICS=false

# Performance settings
VITE_DEFAULT_PICKUP_DISTANCE_KM=5
`;

    try {
        fs.writeFileSync('.env.offline', offlineEnv, 'utf8');
        console.log('✅ Created .env.offline configuration');
    } catch (error) {
        console.log('❌ Error creating offline config:', error.message);
    }
    
    // Create mock API service
    const mockApiService = `// Mock API service for offline mode
export class MockApiService {
  private static mockUsers = [
    {
      id: '1',
      email: 'test@test.com',
      name: 'Test User',
      points: 500
    },
    {
      id: '2', 
      email: 'demo@demo.com',
      name: 'Demo User',
      points: 1000
    }
  ];

  private static mockDonations = [
    {
      id: '1',
      category: 'Electronics',
      weight: 5.2,
      carbon_saved: 12.5,
      status: 'completed',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      category: 'Plastic',
      weight: 2.1,
      carbon_saved: 4.8,
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ];

  static async signIn(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = this.mockUsers.find(u => u.email === email);
    if (user && password === 'test123') {
      return {
        error: null,
        data: {
          token: 'mock-jwt-token',
          user: user
        }
      };
    }
    
    return {
      error: 'Invalid credentials',
      data: null
    };
  }

  static async signUp(email: string, password: string, name: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      points: 0
    };
    
    this.mockUsers.push(newUser);
    
    return {
      error: null,
      data: {
        token: 'mock-jwt-token',
        user: newUser
      }
    };
  }

  static async getDonations() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      error: null,
      data: this.mockDonations
    };
  }

  static async createDonation(donation: any) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newDonation = {
      id: Date.now().toString(),
      ...donation,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    this.mockDonations.push(newDonation);
    
    return {
      error: null,
      data: newDonation
    };
  }
}`;

    try {
        fs.writeFileSync('src/services/mockApi.ts', mockApiService, 'utf8');
        console.log('✅ Created mock API service');
    } catch (error) {
        console.log('❌ Error creating mock API:', error.message);
    }
    
    console.log('\n📱 Offline APK Features:');
    console.log('- ✅ Works without internet');
    console.log('- ✅ Mock user authentication');
    console.log('- ✅ Simulated donations');
    console.log('- ✅ Local data storage');
    console.log('- ✅ Perfect for demos');
    
    console.log('\n🚀 To create offline APK:');
    console.log('1. Copy .env.offline to .env');
    console.log('2. Update AuthProvider to use MockApiService');
    console.log('3. npm run build');
    console.log('4. npx cap sync');
    console.log('5. cd android && .\\gradlew assembleDebug');
    
    console.log('\n🎯 Best for:');
    console.log('- App demos');
    console.log('- Testing UI/UX');
    console.log('- Offline presentations');
    console.log('- Development without backend');
}

createOfflineAPK();
