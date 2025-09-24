import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authorization
async function verifyUser(c: any) {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return { user: null, error: 'No authorization header provided' };
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return { user: null, error: 'No access token provided' };
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user?.id) {
      console.log('Auth verification error:', error);
      return { user: null, error: 'Unauthorized' };
    }

    return { user, error: null };
  } catch (error) {
    console.log('Auth verification exception:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

// Health check endpoint
app.get("/make-server-84fed428/health", (c) => {
  return c.json({ status: "ok" });
});

// Authentication endpoints
app.post("/make-server-84fed428/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user data
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      points: 0,
      totalDonations: 0,
      totalWeight: 0,
      joinedAt: new Date().toISOString(),
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// User profile endpoints
app.get("/make-server-84fed428/user/profile", async (c) => {
  try {
    const { user, error } = await verifyUser(c);
    if (error) {
      return c.json({ error }, 401);
    }

    let profile = await kv.get(`user:${user.id}`);
    if (!profile) {
      // Create a default profile if it doesn't exist
      profile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email,
        points: 0,
        totalDonations: 0,
        totalWeight: 0,
        joinedAt: new Date().toISOString(),
      };
      await kv.set(`user:${user.id}`, profile);
    }
    return c.json(profile);
  } catch (error) {
    console.log('Get profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.put("/make-server-84fed428/user/profile", async (c) => {
  const { user, error } = await verifyUser(c);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}`) || {};
    
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: user.id, // Ensure ID can't be changed
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`user:${user.id}`, updatedProfile);
    return c.json(updatedProfile);
  } catch (error) {
    console.log('Update profile error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Donation endpoints
app.post("/make-server-84fed428/donations", async (c) => {
  const { user, error } = await verifyUser(c);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const { category, weight, items, pickupType, address, timeSlot } = await c.req.json();
    
    if (!category || !weight || !items) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const donationId = `DON-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const pointsPerKg = category === 'books' ? 25 : category === 'clothes' ? 20 : 15;
    const pointsEarned = Math.round(weight * pointsPerKg);

    const donation = {
      id: donationId,
      userId: user.id,
      category,
      weight: parseFloat(weight),
      items,
      pickupType,
      address,
      timeSlot,
      status: 'collected',
      currentStep: 0,
      pointsEarned,
      createdAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
      trackingSteps: [
        { title: 'Collected', completed: true, date: new Date().toISOString() },
        { title: 'In Transit', completed: false, date: null },
        { title: 'Processing', completed: false, date: null },
        { title: 'Manufactured', completed: false, date: null },
        { title: 'Available for Redemption', completed: false, date: null },
      ]
    };

    // Save donation
    await kv.set(`donation:${donationId}`, donation);
    
    // Update user profile
    const userProfile = await kv.get(`user:${user.id}`) || {};
    const updatedProfile = {
      ...userProfile,
      points: (userProfile.points || 0) + pointsEarned,
      totalDonations: (userProfile.totalDonations || 0) + 1,
      totalWeight: (userProfile.totalWeight || 0) + parseFloat(weight),
    };
    await kv.set(`user:${user.id}`, updatedProfile);

    // Add to user's donations list
    const userDonations = await kv.get(`user_donations:${user.id}`) || [];
    userDonations.unshift(donationId);
    await kv.set(`user_donations:${user.id}`, userDonations);

    return c.json(donation);
  } catch (error) {
    console.log('Create donation error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-84fed428/donations", async (c) => {
  try {
    const { user, error } = await verifyUser(c);
    if (error) {
      return c.json({ error }, 401);
    }

    const userDonations = await kv.get(`user_donations:${user.id}`) || [];
    const donations = [];

    for (const donationId of userDonations) {
      const donation = await kv.get(`donation:${donationId}`);
      if (donation) {
        donations.push(donation);
      }
    }

    return c.json(donations);
  } catch (error) {
    console.log('Get donations error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get("/make-server-84fed428/donations/:id", async (c) => {
  const { user, error } = await verifyUser(c);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const donationId = c.req.param('id');
    const donation = await kv.get(`donation:${donationId}`);
    
    if (!donation || donation.userId !== user.id) {
      return c.json({ error: 'Donation not found' }, 404);
    }

    return c.json(donation);
  } catch (error) {
    console.log('Get donation error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Rewards endpoints
app.get("/make-server-84fed428/rewards", async (c) => {
  try {
    // Mock rewards data - in a real app, this would come from a database
    const rewards = [
      {
        id: 1,
        name: 'Recycled Tote Bag',
        points: 150,
        originalPrice: '$25',
        category: 'products',
        sustainability: 'Made from 5 donated t-shirts',
        rating: 4.8,
        available: true,
      },
      {
        id: 2,
        name: 'Upcycled Notebook Set',
        points: 80,
        originalPrice: '$12',
        category: 'products',
        sustainability: 'Made from recycled paper',
        rating: 4.9,
        available: true,
      },
      {
        id: 3,
        name: 'Eco-Friendly Purse',
        points: 300,
        originalPrice: '$45',
        category: 'products',
        sustainability: 'Handcrafted from textile waste',
        rating: 4.7,
        available: true,
      },
      {
        id: 4,
        name: '20% Off Organic Groceries',
        points: 200,
        originalPrice: '$10 value',
        category: 'vouchers',
        partner: 'GreenMart',
        validUntil: '30 days',
        available: true,
      },
      {
        id: 5,
        name: 'Free Coffee for a Week',
        points: 120,
        originalPrice: '$35 value',
        category: 'vouchers',
        partner: 'EcoCafe',
        validUntil: '7 days',
        available: true,
      },
    ];

    return c.json(rewards);
  } catch (error) {
    console.log('Get rewards error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post("/make-server-84fed428/rewards/:id/redeem", async (c) => {
  const { user, error } = await verifyUser(c);
  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const rewardId = parseInt(c.req.param('id'));
    const userProfile = await kv.get(`user:${user.id}`);
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    // Get reward details (mock data - would be from database)
    const rewards = await kv.get('rewards') || [];
    const reward = rewards.find((r: any) => r.id === rewardId);
    
    if (!reward) {
      return c.json({ error: 'Reward not found' }, 404);
    }

    if (userProfile.points < reward.points) {
      return c.json({ error: 'Insufficient points' }, 400);
    }

    // Create redemption record
    const redemptionId = `RED-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const redemption = {
      id: redemptionId,
      userId: user.id,
      rewardId: reward.id,
      rewardName: reward.name,
      pointsUsed: reward.points,
      redeemedAt: new Date().toISOString(),
      status: 'confirmed',
    };

    // Update user points
    const updatedProfile = {
      ...userProfile,
      points: userProfile.points - reward.points,
    };

    await kv.set(`user:${user.id}`, updatedProfile);
    await kv.set(`redemption:${redemptionId}`, redemption);

    // Add to user's redemptions list
    const userRedemptions = await kv.get(`user_redemptions:${user.id}`) || [];
    userRedemptions.unshift(redemptionId);
    await kv.set(`user_redemptions:${user.id}`, userRedemptions);

    return c.json(redemption);
  } catch (error) {
    console.log('Redeem reward error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Impact data endpoints
app.get("/make-server-84fed428/impact/community", async (c) => {
  try {
    // Mock community impact data
    const communityImpact = {
      totalWasteProcessed: 15240,
      activeUsers: 52340,
      partnerFactories: 247,
      jobsCreated: 1340,
      energySaved: 2.8,
      co2Saved: 8450,
      monthlyData: [
        { name: 'Jan', waste: 1200, products: 450 },
        { name: 'Feb', waste: 1800, products: 680 },
        { name: 'Mar', waste: 2100, products: 790 },
        { name: 'Apr', waste: 1900, products: 720 },
        { name: 'May', waste: 2400, products: 920 },
        { name: 'Jun', waste: 2800, products: 1050 },
      ]
    };

    return c.json(communityImpact);
  } catch (error) {
    console.log('Get community impact error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

Deno.serve(app.fetch);