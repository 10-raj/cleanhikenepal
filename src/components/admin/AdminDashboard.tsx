import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, DollarSign, Calendar, Users, TrendingUp, ArrowUpRight, Mountain,
  ImageIcon, Handshake, Megaphone, Settings, AlertCircle, Home, Layout, MessageSquare,
} from 'lucide-react';
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
    { title: 'Total Messages', value: stats.totalMessages, icon: MessageSquare, color: 'from-orange-500 to-orange-600', link: '/admin/messages' },
  ];

  const cmsCards = [
    { title: 'Homepage Manager', value: 'Banners, Featured', icon: Home, color: 'from-purple-500 to-indigo-600', link: '/admin/homepage', desc: 'Hero carousel & featured content' },
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
            <Link
              to={stat.link}
              className="block p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* CMS Cards */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Content Management</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cmsCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.08 }}
          >
            <Link
              to={card.link}
              className="block p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900 dark:text-white">{card.title}</p>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
                  {typeof card.value === 'number' && (
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">{card.value} items</p>
                  )}
                  {typeof card.value === 'string' && (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{card.value}</p>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 border border-emerald-100 dark:border-emerald-800/50">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Quick Actions
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Add Hero Banner', link: '/admin/homepage', icon: Layout },
            { label: 'Update Next Hike Info', link: '/admin/settings', icon: Mountain },
            { label: 'View Messages', link: '/admin/messages', icon: Mail },
            { label: 'Manage Gallery', link: '/admin/gallery', icon: ImageIcon },
            { label: 'View Donations', link: '/admin/donations', icon: DollarSign },
            { label: 'Manage Sponsors', link: '/admin/sponsors', icon: Handshake },
          ].map(action => (
            <Link
              key={action.label}
              to={action.link}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
