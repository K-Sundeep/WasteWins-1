import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory storage for demo (use Redis or database in production)
const sessions = new Map<string, any>();
const events: any[] = [];

// Start analytics session
router.post('/session/start', asyncHandler(async (req: Request, res: Response) => {
  const { userId, platform } = req.body;
  
  const sessionId = uuidv4();
  const session = {
    sessionId,
    userId,
    platform: platform || 'web',
    startTime: new Date(),
    events: []
  };
  
  sessions.set(sessionId, session);
  
  return res.json({ sessionId });
}));

// End analytics session
router.post('/session/end', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  
  if (sessions.has(sessionId)) {
    const session = sessions.get(sessionId);
    session.endTime = new Date();
    session.duration = session.endTime.getTime() - session.startTime.getTime();
    
    // In production, save to database here
    console.log('📊 Session ended:', {
      sessionId,
      duration: session.duration,
      eventCount: session.events.length
    });
  }
  
  return res.json({ success: true });
}));

// Track analytics event
router.post('/track', asyncHandler(async (req: Request, res: Response) => {
  const { userId, sessionId, eventType, eventData, platform } = req.body;
  
  const event = {
    id: uuidv4(),
    userId,
    sessionId,
    eventType,
    eventData: eventData || {},
    platform: platform || 'web',
    timestamp: new Date(),
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };
  
  // Store event
  events.push(event);
  
  // Add to session if exists
  if (sessionId && sessions.has(sessionId)) {
    sessions.get(sessionId).events.push(event);
  }
  
  // Log important events
  if (['donation_created', 'user_signup', 'app_open'].includes(eventType)) {
    console.log('📊 Important event:', {
      eventType,
      userId,
      sessionId,
      data: eventData
    });
  }
  
  return res.json({ success: true, eventId: event.id });
}));

// Get analytics dashboard data (admin only)
router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const { timeframe = '7d' } = req.query;
  
  // Calculate date range
  const now = new Date();
  const daysBack = timeframe === '30d' ? 30 : timeframe === '1d' ? 1 : 7;
  const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
  
  // Filter events by timeframe
  const recentEvents = events.filter(event => 
    new Date(event.timestamp) >= startDate
  );
  
  // Calculate metrics
  const totalEvents = recentEvents.length;
  const uniqueUsers = new Set(recentEvents.map(e => e.userId)).size;
  const activeSessions = Array.from(sessions.values()).filter(s => !s.endTime).length;
  
  // Event breakdown
  const eventBreakdown = recentEvents.reduce((acc: any, event) => {
    acc[event.eventType] = (acc[event.eventType] || 0) + 1;
    return acc;
  }, {});
  
  // Daily activity
  const dailyActivity = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const dayEvents = recentEvents.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= dayStart && eventDate < dayEnd;
    });
    
    dailyActivity.push({
      date: dayStart.toISOString().split('T')[0],
      events: dayEvents.length,
      users: new Set(dayEvents.map(e => e.userId)).size
    });
  }
  
  return res.json({
    summary: {
      totalEvents,
      uniqueUsers,
      activeSessions,
      timeframe
    },
    eventBreakdown,
    dailyActivity,
    topEvents: Object.entries(eventBreakdown)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
  });
}));

// Get real-time stats
router.get('/realtime', asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  const recentEvents = events.filter(event => 
    new Date(event.timestamp) >= oneHourAgo
  );
  
  const activeSessions = Array.from(sessions.values()).filter(s => !s.endTime).length;
  
  return res.json({
    activeSessions,
    eventsLastHour: recentEvents.length,
    uniqueUsersLastHour: new Set(recentEvents.map(e => e.userId)).size,
    lastEventTime: events.length > 0 ? events[events.length - 1].timestamp : null
  });
}));

export default router;
