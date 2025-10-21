import { query } from './database';
import { logger } from '../utils/logger';

export const initializeDatabase = async (): Promise<void> => {
  try {
    logger.info('Initializing database tables...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 0,
        total_donations INTEGER DEFAULT 0,
        total_weight DECIMAL(10,2) DEFAULT 0,
        joined_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create donations table
    await query(`
      CREATE TABLE IF NOT EXISTS donations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        weight DECIMAL(10,2) NOT NULL,
        carbon_saved DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        pickup_address TEXT,
        pickup_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create rewards table
    await query(`
      CREATE TABLE IF NOT EXISTS rewards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        points_required INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'available',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create user_rewards table
    await query(`
      CREATE TABLE IF NOT EXISTS user_rewards (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
        redeemed_at TIMESTAMP DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'redeemed'
      )
    `);

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id)`);
    await query(`CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status)`);

    // Insert test user with properly hashed password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    await query(`
      INSERT INTO users (email, password, name, points) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['test@test.com', hashedPassword, 'Test User', 500]);

    // Insert sample rewards
    await query(`
      INSERT INTO rewards (title, description, points_required) VALUES
      ('Coffee Voucher', 'Free coffee at partner cafes', 100),
      ('Plant a Tree', 'We will plant a tree in your name', 250),
      ('Eco Bag', 'Reusable shopping bag made from recycled materials', 150)
      ON CONFLICT DO NOTHING
    `);

    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};
