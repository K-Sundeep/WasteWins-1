import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  Activity,
  TrendingUp,
  MapPin,
  Recycle,
  Leaf,
  Smartphone,
  Monitor,
  RefreshCw,
} from 'lucide-react';

interface DashboardData {
  overview: {
    active_users: number;
    total_sessions: number;
    total_donations: number;
    carbon_saved: number;
    app_opens: number;
    center_views: number;
  };
  userGrowth: Array<{
    date: string;
    daily_users: number;
    new_users: number;
  }>;
  topCenters: Array<{
    center_id: string;
    center_name: string;
    views: number;
    unique_users: number;
  }>;
  platformBreakdown: Array<{
    platform: string;
    users: number;
    events: number;
  }>;
  wasteCategories: Array<{
    category: string;
    donations: number;
    total_weight: number;
  }>;
  recentActivity: Array<{
    event_type: string;
    event_data: any;
    platform: string;
    created_at: string;
    username: string;
  }>;
  timeframe: string;
  lastUpdated: string;
}

interface RealtimeStats {
  users_last_5min: number;
  users_last_hour: number;
  events_last_hour: number;
  donations_last_hour: number;
  timestamp: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30');
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/analytics/dashboard?timeframe=${timeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-time stats
  const fetchRealtimeStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/realtime`);
      if (response.ok) {
        const data = await response.json();
        setRealtimeStats(data);
      }
    } catch (err) {
      console.warn('Real-time stats fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  useEffect(() => {
    fetchRealtimeStats();
    const interval = setInterval(fetchRealtimeStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'donation_created': return <Recycle className="w-4 h-4 text-green-600" />;
      case 'center_viewed': return <MapPin className="w-4 h-4 text-blue-600" />;
      case 'app_open': return <Smartphone className="w-4 h-4 text-purple-600" />;
      case 'user_login': return <Users className="w-4 h-4 text-indigo-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <Button onClick={fetchDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WasteWins Analytics</h1>
          <p className="text-gray-600">
            Last updated: {dashboardData?.lastUpdated ? new Date(dashboardData.lastUpdated).toLocaleString() : 'Never'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <Button onClick={fetchDashboardData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      {realtimeStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Now</p>
                  <p className="text-2xl font-bold text-green-600">{realtimeStats.users_last_5min}</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Last Hour</p>
                  <p className="text-xl font-bold">{realtimeStats.users_last_hour}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Events/Hour</p>
                  <p className="text-xl font-bold">{realtimeStats.events_last_hour}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Recycle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">Donations/Hour</p>
                  <p className="text-xl font-bold">{realtimeStats.donations_last_hour}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overview Stats */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unique Users</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatNumber((dashboardData as any).summary?.uniqueUsers || 0)}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatNumber((dashboardData as any).summary?.totalEvents || 0)}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatNumber((dashboardData as any).summary?.activeSessions || 0)}
                  </p>
                </div>
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Timeframe</p>
                  <p className="text-3xl font-bold text-indigo-600">
                    {(dashboardData as any).summary?.timeframe || '7d'}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Event Breakdown */}
      {dashboardData && (dashboardData as any).eventBreakdown && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Event Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries((dashboardData as any).eventBreakdown).map(([eventType, count]) => (
                <div key={eventType} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(eventType)}
                    <span className="capitalize">{eventType.replace('_', ' ')}</span>
                  </div>
                  <span className="font-bold text-lg">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Activity */}
      {dashboardData && (dashboardData as any).dailyActivity && (
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList>
            <TabsTrigger value="daily">Daily Activity</TabsTrigger>
            <TabsTrigger value="events">Top Events</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {((dashboardData as any).dailyActivity || []).map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{day.date}</p>
                        <p className="text-sm text-gray-600">{day.users} users</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{day.events}</p>
                        <p className="text-sm text-gray-600">events</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Top Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {((dashboardData as any).topEvents || []).map(([eventType, count]: [string, number], index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary">#{index + 1}</Badge>
                        <div className="flex items-center space-x-2">
                          {getEventIcon(eventType)}
                          <span className="capitalize">{eventType.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{count}</p>
                        <p className="text-sm text-gray-600">events</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminDashboard;
