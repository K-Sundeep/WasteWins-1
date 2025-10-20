// Custom recycling centers to supplement OpenStreetMap data
// Add your own recycling centers here

export interface CustomRecyclingCenter {
  id: string;
  name: string;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  services: string[]; // e.g., ['Clothes', 'Plastic', 'Paper', 'Books', 'Electronics']
  tags?: Record<string, string>;
}

export const customRecyclingCenters: CustomRecyclingCenter[] = [
  // Example centers - Replace with your actual data
  {
    id: 'custom-1',
    name: 'Green Recycling Hub',
    lat: 40.7128,
    lon: -74.0060,
    address: '123 Main St, New York, NY 10001',
    phone: '+1-555-0100',
    website: 'https://greenrecyclinghub.com',
    hours: 'Mon-Sat: 9AM-6PM',
    services: ['Clothes', 'Plastic', 'Paper', 'Books', 'Electronics'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:books': 'yes',
      'recycling:electronics': 'yes',
    }
  },
  {
    id: 'custom-2',
    name: 'EcoWaste Collection Center',
    lat: 40.7589,
    lon: -73.9851,
    address: '456 Park Ave, New York, NY 10022',
    phone: '+1-555-0200',
    website: 'https://ecowaste.com',
    hours: 'Mon-Fri: 8AM-7PM, Sat: 9AM-5PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
    }
  },
  {
    id: 'custom-3',
    name: 'Community Recycling Point',
    lat: 40.7484,
    lon: -73.9857,
    address: '789 Broadway, New York, NY 10003',
    phone: '+1-555-0300',
    hours: '24/7',
    services: ['Clothes', 'Shoes', 'Textiles'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:shoes': 'yes',
    }
  },
  
  // INDIAN RECYCLING CENTERS
  
  // Mumbai Centers
  {
    id: 'custom-mumbai-1',
    name: 'Deonar Waste Management Plant',
    lat: 19.0460,
    lon: 72.9126,
    address: 'Deonar, Mumbai, Maharashtra 400088',
    phone: '+91-22-2556-7890',
    hours: 'Mon-Sat: 8AM-6PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Electronics'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:electronics': 'yes',
      'operator': 'BMC',
    }
  },
  {
    id: 'custom-mumbai-2',
    name: 'Bandra Recycling Center',
    lat: 19.0596,
    lon: 72.8295,
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    phone: '+91-22-2640-1234',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 9AM-5PM',
    services: ['Clothes', 'Plastic', 'Paper', 'Books'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:books': 'yes',
    }
  },
  
  // Delhi Centers
  {
    id: 'custom-delhi-1',
    name: 'Ghazipur Waste Processing Plant',
    lat: 28.6304,
    lon: 77.3183,
    address: 'Ghazipur, East Delhi, Delhi 110096',
    phone: '+91-11-2215-6789',
    hours: 'Mon-Sat: 7AM-6PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Biowaste'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:organic': 'yes',
      'operator': 'EDMC',
    }
  },
  {
    id: 'custom-delhi-2',
    name: 'Connaught Place E-Waste Collection',
    lat: 28.6315,
    lon: 77.2167,
    address: 'Connaught Place, New Delhi, Delhi 110001',
    phone: '+91-11-2334-5678',
    hours: 'Mon-Sat: 10AM-8PM',
    services: ['Electronics', 'Batteries', 'Plastic'],
    tags: {
      'amenity': 'recycling',
      'recycling:electronics': 'yes',
      'recycling:batteries': 'yes',
      'recycling:plastic': 'yes',
    }
  },
  {
    id: 'custom-delhi-3',
    name: 'Dwarka Recycling Hub',
    lat: 28.5921,
    lon: 77.0460,
    address: 'Sector 10, Dwarka, New Delhi 110075',
    phone: '+91-11-2808-9012',
    hours: 'Mon-Sun: 8AM-7PM',
    services: ['Clothes', 'Plastic', 'Paper', 'Glass', 'Metal'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
    }
  },
  
  // Bangalore Centers
  {
    id: 'custom-bangalore-1',
    name: 'Bangalore Dry Waste Collection Center',
    lat: 12.9716,
    lon: 77.5946,
    address: 'Indiranagar, Bangalore, Karnataka 560038',
    phone: '+91-80-2521-3456',
    hours: 'Mon-Sat: 8AM-6PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Electronics'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:electronics': 'yes',
      'operator': 'BBMP',
    }
  },
  {
    id: 'custom-bangalore-2',
    name: 'Koramangala Green Point',
    lat: 12.9352,
    lon: 77.6245,
    address: 'Koramangala 5th Block, Bangalore 560095',
    phone: '+91-80-4112-7890',
    hours: 'Mon-Fri: 9AM-7PM',
    services: ['Clothes', 'Books', 'Plastic', 'Paper'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:books': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
    }
  },
  {
    id: 'custom-bangalore-3',
    name: 'Whitefield E-Waste Center',
    lat: 12.9698,
    lon: 77.7499,
    address: 'Whitefield, Bangalore, Karnataka 560066',
    phone: '+91-80-2845-6789',
    hours: 'Mon-Sat: 10AM-6PM',
    services: ['Electronics', 'Batteries', 'Plastic'],
    tags: {
      'amenity': 'recycling',
      'recycling:electronics': 'yes',
      'recycling:batteries': 'yes',
      'recycling:plastic': 'yes',
    }
  },
  
  // Hyderabad Centers
  {
    id: 'custom-hyderabad-1',
    name: 'Banjara Hills Recycling Center',
    lat: 17.4177,
    lon: 78.4399,
    address: 'Road No 12, Banjara Hills, Hyderabad, Telangana 500034',
    phone: '+91-40-2339-1234',
    hours: 'Mon-Sat: 8AM-7PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Biowaste'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:organic': 'yes',
      'operator': 'GHMC',
    }
  },
  {
    id: 'custom-hyderabad-2',
    name: 'Jubilee Hills Green Point',
    lat: 17.4239,
    lon: 78.4138,
    address: 'Jubilee Hills, Hyderabad, Telangana 500033',
    phone: '+91-40-2354-5678',
    hours: 'Mon-Sat: 9AM-6PM',
    services: ['Clothes', 'Plastic', 'Paper', 'Books'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:books': 'yes',
    }
  },
  {
    id: 'custom-hyderabad-3',
    name: 'Hitech City Recycling Point',
    lat: 17.4435,
    lon: 78.3772,
    address: 'Hitech City, Hyderabad, Telangana 500081',
    phone: '+91-40-6677-8899',
    hours: 'Mon-Fri: 9AM-8PM, Sat: 9AM-5PM',
    services: ['Electronics', 'Plastic', 'Paper', 'Batteries'],
    tags: {
      'amenity': 'recycling',
      'recycling:electronics': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:batteries': 'yes',
    }
  },
  {
    id: 'custom-hyderabad-4',
    name: 'Madhapur Eco Center',
    lat: 17.4485,
    lon: 78.3908,
    address: 'Madhapur, Hyderabad, Telangana 500081',
    phone: '+91-40-2311-2345',
    hours: 'Mon-Sun: 8AM-8PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Electronics'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:electronics': 'yes',
    }
  },
  {
    id: 'custom-hyderabad-5',
    name: 'Gachibowli Waste Collection',
    lat: 17.4400,
    lon: 78.3489,
    address: 'Gachibowli, Hyderabad, Telangana 500032',
    phone: '+91-40-2300-6789',
    hours: 'Mon-Sat: 8AM-7PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
    }
  },
  {
    id: 'custom-hyderabad-6',
    name: 'Secunderabad Recycling Hub',
    lat: 17.4399,
    lon: 78.4983,
    address: 'Secunderabad, Hyderabad, Telangana 500003',
    phone: '+91-40-2784-5678',
    hours: 'Mon-Fri: 9AM-6PM',
    services: ['Clothes', 'Plastic', 'Paper', 'Books', 'Electronics'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:books': 'yes',
      'recycling:electronics': 'yes',
    }
  },
  
  // Chennai Centers
  {
    id: 'custom-chennai-1',
    name: 'Chennai Corporation Recycling Center',
    lat: 13.0827,
    lon: 80.2707,
    address: 'T Nagar, Chennai, Tamil Nadu 600017',
    phone: '+91-44-2434-5678',
    hours: 'Mon-Sat: 8AM-6PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'operator': 'Greater Chennai Corporation',
    }
  },
  {
    id: 'custom-chennai-2',
    name: 'Adyar Eco Center',
    lat: 13.0067,
    lon: 80.2572,
    address: 'Adyar, Chennai, Tamil Nadu 600020',
    phone: '+91-44-2441-2345',
    hours: 'Mon-Fri: 9AM-7PM',
    services: ['Clothes', 'Books', 'Plastic', 'Paper'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:books': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
    }
  },
  
  // Pune Centers
  {
    id: 'custom-pune-1',
    name: 'Pune Municipal Recycling Facility',
    lat: 18.5204,
    lon: 73.8567,
    address: 'Shivajinagar, Pune, Maharashtra 411005',
    phone: '+91-20-2553-4567',
    hours: 'Mon-Sat: 8AM-6PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Electronics'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:electronics': 'yes',
      'operator': 'PMC',
    }
  },
  {
    id: 'custom-pune-2',
    name: 'Koregaon Park Green Center',
    lat: 18.5362,
    lon: 73.8958,
    address: 'Koregaon Park, Pune, Maharashtra 411001',
    phone: '+91-20-2613-7890',
    hours: 'Mon-Sun: 9AM-7PM',
    services: ['Clothes', 'Plastic', 'Paper', 'Books'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:books': 'yes',
    }
  },
  
  // Kolkata Centers
  {
    id: 'custom-kolkata-1',
    name: 'Kolkata Waste Management Center',
    lat: 22.5726,
    lon: 88.3639,
    address: 'Park Street, Kolkata, West Bengal 700016',
    phone: '+91-33-2229-3456',
    hours: 'Mon-Sat: 8AM-6PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'operator': 'KMC',
    }
  },
  {
    id: 'custom-kolkata-2',
    name: 'Salt Lake Recycling Hub',
    lat: 22.5697,
    lon: 88.4337,
    address: 'Salt Lake City, Kolkata, West Bengal 700091',
    phone: '+91-33-2321-4567',
    hours: 'Mon-Fri: 9AM-7PM',
    services: ['Electronics', 'Plastic', 'Paper', 'Batteries'],
    tags: {
      'amenity': 'recycling',
      'recycling:electronics': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:batteries': 'yes',
    }
  },
  
  // Ahmedabad Centers
  {
    id: 'custom-ahmedabad-1',
    name: 'Ahmedabad Recycling Center',
    lat: 23.0225,
    lon: 72.5714,
    address: 'Satellite, Ahmedabad, Gujarat 380015',
    phone: '+91-79-2630-1234',
    hours: 'Mon-Sat: 8AM-7PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Clothes'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:clothes': 'yes',
      'operator': 'AMC',
    }
  },
  
  // Jaipur Centers
  {
    id: 'custom-jaipur-1',
    name: 'Jaipur Green Waste Center',
    lat: 26.9124,
    lon: 75.7873,
    address: 'C-Scheme, Jaipur, Rajasthan 302001',
    phone: '+91-141-2367-8901',
    hours: 'Mon-Sat: 9AM-6PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'operator': 'JMC',
    }
  },
  
  // Chandigarh Centers
  {
    id: 'custom-chandigarh-1',
    name: 'Chandigarh Recycling Facility',
    lat: 30.7333,
    lon: 76.7794,
    address: 'Sector 17, Chandigarh 160017',
    phone: '+91-172-2740-1234',
    hours: 'Mon-Sat: 8AM-6PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Electronics'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:electronics': 'yes',
    }
  },
  
  // Central India Centers (near default coordinates 20.5937, 78.9629)
  {
    id: 'custom-central-1',
    name: 'Nagpur Central Recycling Hub',
    lat: 21.1458,
    lon: 79.0882,
    address: 'Sitabuldi, Nagpur, Maharashtra 440012',
    phone: '+91-712-2561-234',
    hours: 'Mon-Sat: 8AM-7PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Electronics'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:electronics': 'yes',
      'operator': 'NMC',
    }
  },
  {
    id: 'custom-central-2',
    name: 'Jabalpur Eco Collection Center',
    lat: 23.1815,
    lon: 79.9864,
    address: 'Civil Lines, Jabalpur, Madhya Pradesh 482001',
    phone: '+91-761-2420-567',
    hours: 'Mon-Fri: 9AM-6PM',
    services: ['Clothes', 'Plastic', 'Paper', 'Books'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:books': 'yes',
    }
  },
  {
    id: 'custom-central-3',
    name: 'Raipur Green Waste Management',
    lat: 21.2514,
    lon: 81.6296,
    address: 'Shankar Nagar, Raipur, Chhattisgarh 492007',
    phone: '+91-771-2234-890',
    hours: 'Mon-Sat: 8AM-6PM',
    services: ['Plastic', 'Paper', 'Glass', 'Metal', 'Biowaste'],
    tags: {
      'amenity': 'recycling',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
      'recycling:organic': 'yes',
    }
  },
  {
    id: 'custom-central-4',
    name: 'Indore Recycling Point',
    lat: 22.7196,
    lon: 75.8577,
    address: 'Vijay Nagar, Indore, Madhya Pradesh 452010',
    phone: '+91-731-2567-123',
    hours: 'Mon-Sun: 9AM-7PM',
    services: ['Electronics', 'Plastic', 'Paper', 'Batteries'],
    tags: {
      'amenity': 'recycling',
      'recycling:electronics': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:batteries': 'yes',
    }
  },
  {
    id: 'custom-central-5',
    name: 'Bhopal Waste Collection Hub',
    lat: 23.2599,
    lon: 77.4126,
    address: 'New Market, Bhopal, Madhya Pradesh 462003',
    phone: '+91-755-2345-678',
    hours: 'Mon-Sat: 8AM-7PM',
    services: ['Clothes', 'Plastic', 'Paper', 'Glass', 'Metal'],
    tags: {
      'amenity': 'recycling',
      'recycling:clothes': 'yes',
      'recycling:plastic': 'yes',
      'recycling:paper': 'yes',
      'recycling:glass': 'yes',
      'recycling:metal': 'yes',
    }
  },

  // Add more centers below...
];

// Helper function to get centers by city/region
export function getCentersByRegion(lat: number, lon: number, radiusKm: number = 50): CustomRecyclingCenter[] {
  return customRecyclingCenters.filter(center => {
    const distance = calculateDistance(lat, lon, center.lat, center.lon);
    return distance <= radiusKm;
  });
}

// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper to convert custom center to RecyclingSite format
export function convertToRecyclingSite(center: CustomRecyclingCenter) {
  return {
    id: center.id,
    name: center.name,
    lat: center.lat,
    lon: center.lon,
    tags: center.tags || {},
  };
}
