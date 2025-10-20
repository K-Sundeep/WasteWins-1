const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Track analytics events
router.post('/track', async (req, res) => {
  try {
    const {
      userId,
      sessionId,
      eventType,
      eventData = {},
      platform = 'web'
    } = req.body;

    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Insert analytics event
    const result = await pool.query(`
      INSERT INTO analytics_events 
      (user_id, session_id, event_type, event_data, platform, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, created_at
    `, [userId, sessionId, eventType, JSON.stringify(eventData), platform, userAgent, ipAddress]);

    // Update session if exists
    if (sessionId) {
      await pool.query(`
        UPDATE user_sessions 
        SET events_count = events_count + 1,
            ended_at = NOW(),
            duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))
        WHERE session_id = $1
      `, [sessionId]);
    }

    res.json({
      success: true,
      eventId: result.rows[0].id,
      timestamp: result.rows[0].created_at
    });

  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Start user session
router.post('/session/start', async (req, res) => {
  try {
    const { userId, platform = 'web' } = req.body;
    const sessionId = uuidv4();

    await pool.query(`
      INSERT INTO user_sessions (user_id, session_id, platform)
      VALUES ($1, $2, $3)
    `, [userId, sessionId, platform]);

    res.json({ sessionId, startedAt: new Date() });

  } catch (error) {
    console.error('Session start error:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// End user session
router.post('/session/end', async (req, res) => {
  try {
    const { sessionId } = req.body;

    await pool.query(`
      UPDATE user_sessions 
      SET ended_at = NOW(),
          duration_seconds = EXTRACT(EPOCH FROM (NOW() - started_at))
      WHERE session_id = $1
    `, [sessionId]);

    res.json({ success: true });

  } catch (error) {
    console.error('Session end error:', error);
    res.status(500).json({ error: 'Failed to end session' });
  }
});

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const { timeframe = '30' } = req.query; // days

    // Get overview stats
    const overviewQuery = await pool.query(`
      SELECT 
        COUNT(DISTINCT user_id) as active_users,
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(*) FILTER (WHERE event_type = 'donation_created') as total_donations,
        COALESCE(SUM((event_data->>'carbon_saved')::decimal), 0) as carbon_saved,
        COUNT(*) FILTER (WHERE event_type = 'app_open') as app_opens,
        COUNT(*) FILTER (WHERE event_type = 'center_viewed') as center_views
      FROM analytics_events 
      WHERE created_at >= NOW() - INTERVAL '${timeframe} days'
    `);

    // Get daily user growth
    const growthQuery = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT user_id) as daily_users,
        COUNT(*) FILTER (WHERE event_type = 'user_registered') as new_users
      FROM analytics_events 
      WHERE created_at >= NOW() - INTERVAL '${timeframe} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);

    // Get top recycling centers
    const centersQuery = await pool.query(`
      SELECT 
        event_data->>'centerId' as center_id,
        event_data->>'centerName' as center_name,
        COUNT(*) as views,
        COUNT(DISTINCT user_id) as unique_users
      FROM analytics_events 
      WHERE event_type = 'center_viewed' 
        AND created_at >= NOW() - INTERVAL '${timeframe} days'
        AND event_data->>'centerId' IS NOT NULL
      GROUP BY event_data->>'centerId', event_data->>'centerName'
      ORDER BY views DESC
      LIMIT 10
    `);

    // Get platform breakdown
    const platformQuery = await pool.query(`
      SELECT 
        platform,
        COUNT(DISTINCT user_id) as users,
        COUNT(*) as events
      FROM analytics_events 
      WHERE created_at >= NOW() - INTERVAL '${timeframe} days'
      GROUP BY platform
    `);

    // Get popular waste categories
    const categoriesQuery = await pool.query(`
      SELECT 
        event_data->>'category' as category,
        COUNT(*) as donations,
        COALESCE(SUM((event_data->>'weight')::decimal), 0) as total_weight
      FROM analytics_events 
      WHERE event_type = 'donation_created' 
        AND created_at >= NOW() - INTERVAL '${timeframe} days'
        AND event_data->>'category' IS NOT NULL
      GROUP BY event_data->>'category'
      ORDER BY donations DESC
    `);

    // Get recent activity
    const recentQuery = await pool.query(`
      SELECT 
        event_type,
        event_data,
        platform,
        created_at,
        (SELECT username FROM users WHERE id = analytics_events.user_id) as username
      FROM analytics_events 
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const dashboard = {
      overview: overviewQuery.rows[0],
      userGrowth: growthQuery.rows,
      topCenters: centersQuery.rows,
      platformBreakdown: platformQuery.rows,
      wasteCategories: categoriesQuery.rows,
      recentActivity: recentQuery.rows,
      timeframe: `${timeframe} days`,
      lastUpdated: new Date()
    };

    res.json(dashboard);

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get user analytics
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userStats = await pool.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(*) FILTER (WHERE event_type = 'donation_created') as donations,
        COALESCE(SUM((event_data->>'carbon_saved')::decimal), 0) as carbon_saved,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_seen
      FROM analytics_events 
      WHERE user_id = $1
    `, [userId]);

    const recentActivity = await pool.query(`
      SELECT event_type, event_data, created_at, platform
      FROM analytics_events 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [userId]);

    res.json({
      stats: userStats.rows[0],
      recentActivity: recentActivity.rows
    });

  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch user analytics' });
  }
});

// Get real-time stats
router.get('/realtime', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(DISTINCT user_id) FILTER (WHERE created_at >= NOW() - INTERVAL '5 minutes') as users_last_5min,
        COUNT(DISTINCT user_id) FILTER (WHERE created_at >= NOW() - INTERVAL '1 hour') as users_last_hour,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 hour') as events_last_hour,
        COUNT(*) FILTER (WHERE event_type = 'donation_created' AND created_at >= NOW() - INTERVAL '1 hour') as donations_last_hour
      FROM analytics_events
    `);

    res.json({
      ...stats.rows[0],
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Real-time stats error:', error);
    res.status(500).json({ error: 'Failed to fetch real-time stats' });
  }
});

module.exports = router;
