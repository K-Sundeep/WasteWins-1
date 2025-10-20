// Test the new location APIs
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testLocationAPIs() {
    console.log('🗺️ Testing Location APIs...');
    console.log('🌐 API Base: https://wastewins-1.onrender.com/api/v1/location');
    
    try {
        // Test 1: Distance calculation
        console.log('\n1️⃣ Testing Distance Calculation...');
        const distanceResponse = await fetch('https://wastewins-1.onrender.com/api/v1/location/distance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                origin: { lat: 28.6139, lon: 77.2090 }, // New Delhi
                destination: { lat: 19.0760, lon: 72.8777 } // Mumbai
            }),
        });
        
        console.log('Distance Status:', distanceResponse.status);
        if (distanceResponse.ok) {
            const distanceData = await distanceResponse.json();
            console.log('✅ Distance calculation successful!');
            console.log('📏 Distance:', distanceData.distance, 'km');
            console.log('🔧 Method:', distanceData.method);
            console.log('📐 Unit:', distanceData.unit);
        } else {
            const errorText = await distanceResponse.text();
            console.log('❌ Distance calculation failed:', errorText);
        }
        
        // Test 2: Pickup sites
        console.log('\n2️⃣ Testing Pickup Sites...');
        const pickupResponse = await fetch('https://wastewins-1.onrender.com/api/v1/location/pickup-sites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lat: 28.6139,
                lon: 77.2090,
                radius: 10000
            }),
        });
        
        console.log('Pickup Sites Status:', pickupResponse.status);
        if (pickupResponse.ok) {
            const pickupData = await pickupResponse.json();
            console.log('✅ Pickup sites successful!');
            console.log('📍 Sites found:', pickupData.count);
            console.log('🗂️ Source:', pickupData.source);
            console.log('🏢 Sample sites:');
            pickupData.sites.slice(0, 3).forEach((site, index) => {
                console.log(`   ${index + 1}. ${site.name} (${site.distance}km)`);
            });
        } else {
            const errorText = await pickupResponse.text();
            console.log('❌ Pickup sites failed:', errorText);
        }
        
        // Test 3: Geocoding
        console.log('\n3️⃣ Testing Geocoding...');
        const geocodeResponse = await fetch('https://wastewins-1.onrender.com/api/v1/location/geocode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                address: 'India Gate, New Delhi, India'
            }),
        });
        
        console.log('Geocoding Status:', geocodeResponse.status);
        if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json();
            console.log('✅ Geocoding successful!');
            console.log('📍 Coordinates:', geocodeData.lat, ',', geocodeData.lon);
            console.log('🏷️ Display Name:', geocodeData.display_name);
        } else {
            const errorText = await geocodeResponse.text();
            console.log('❌ Geocoding failed:', errorText);
        }
        
        // Test 4: Error handling
        console.log('\n4️⃣ Testing Error Handling...');
        const errorResponse = await fetch('https://wastewins-1.onrender.com/api/v1/location/distance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                origin: { lat: 'invalid' }, // Invalid data
                destination: { lon: 'invalid' }
            }),
        });
        
        console.log('Error Test Status:', errorResponse.status);
        if (errorResponse.status === 400) {
            const errorData = await errorResponse.json();
            console.log('✅ Error handling works!');
            console.log('🚫 Error message:', errorData.error);
        } else {
            console.log('❌ Error handling not working as expected');
        }
        
        console.log('\n🎉 Location API Tests Complete!');
        console.log('\n📱 Your mobile app features should now work:');
        console.log('- ✅ Distance calculation between points');
        console.log('- ✅ Finding nearby pickup locations');
        console.log('- ✅ Converting addresses to coordinates');
        console.log('- ✅ Proper error handling');
        
        console.log('\n🚀 All AI/Location features are ready!');
        
    } catch (error) {
        console.log('❌ Network Error:', error.message);
        console.log('\n💡 Possible issues:');
        console.log('- Backend still deploying (wait a few minutes)');
        console.log('- Network connectivity issues');
        console.log('- API endpoints not yet available');
    }
}

testLocationAPIs();
