import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, DollarSign, Calendar, Users, TrendingUp, ArrowUpRight, Mountain, ImageIcon, Handshake, Megaphone, Settings, AlertCircle } from 'lucide-react';
import { getAdminStats } from '../../services/admin';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    totalDonations: 0,
    totalBookings: 0,
    totalHikes: 0,
    totalGallery: 0,
    totalSponsors: 0,
    totalCampaigns: 0,
    totalTeam: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setError(null);
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
        setError('Failed to fetch data. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    { title: 'Unread Messages', value: stats.unreadMessages, icon: Mail, color: 'from-blue-500 to-blue-600', link: '/admin/messages' },
    { title: 'Total Donations', value: `Rs. ${stats.totalDonations.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-green-600', link: '/admin/donations' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'from-purple-500 to-purple-600', link: '/admin/bookings' },
    { title: 'Total Messages', value: stats.totalMessages, icon: Users, color: 'from-orange-500 to-orange-600', link: '/admin/messages' },
  ];

  const cmsCards = [
    { title: 'Hikes', value: stats.totalHikes, icon: Mountain, color: 'from-emerald-500 to-green-600', link: '/admin/hikes', desc: 'Manage trek routes' },
    { title: 'Gallery', value: stats.totalGallery, icon: ImageIcon, color: 'from-sky-500 to-blue-600', link: '/admin/gallery', desc: 'Manage images' },
    { title: 'Sponsors', value: stats.totalSponsors, icon: Handshake, color: 'from-amber-500 to-orange-600', link: '/admin/sponsors', desc: 'Manage partners' },
    { title: 'Campaigns', value: stats.totalCampaigns, icon: Megaphone, color: 'from-rose-500 to-pink-600', link: '/admin/campaigns', desc: 'Manage events' },
    { title: 'Team', value: stats.totalTeam, icon: Users, color: 'from-teal-500 to-cyan-600', link: '/admin/team', desc: 'Manage members' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">{error}</p>
          <button
            onClick={() => { setLoading(true); setError(null); window.location.reload(); }}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage all website content from one place</p>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={stat.link}>
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500/50 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CMS Content Management */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Content Management</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cmsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={card.link}>
              <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500/50 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/hikes" className="block p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
              <p className="font-medium text-emerald-700 dark:text-emerald-400">Add / Edit Hikes</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-500">{stats.totalHikes} hikes published</p>
            </Link>
            <Link to="/admin/gallery" className="block p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors">
              <p className="font-medium text-sky-700 dark:text-sky-400">Manage Gallery</p>
              <p className="text-sm text-sky-600 dark:text-sky-500">{stats.totalGallery} images</p>
            </Link>
            <Link to="/admin/settings" className="block p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <p className="font-medium text-gray-700 dark:text-gray-300">Website Settings</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Edit stats & contact info</p>
            </Link>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Total Donations Value</p>
                <p className="text-xs text-gray-500">Rs. {stats.totalDonations.toLocaleString()} raised</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Mail className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Inbox</p>
                <p className="text-xs text-gray-500">{stats.unreadMessages} unread / {stats.totalMessages} total</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Settings className="w-5 h-5 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Content Items</p>
                <p className="text-xs text-gray-500">{stats.totalHikes + stats.totalGallery + stats.totalSponsors + stats.totalCampaigns} total managed items</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
