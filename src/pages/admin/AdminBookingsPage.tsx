import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, CheckCircle, Clock, XCircle, Mountain, Users } from 'lucide-react';
import { getAllBookings, updateBookingStatus } from '../../services/admin';

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data || []);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateBookingStatus(bookingId, status);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status } : b));
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const filteredBookings = bookings.filter(b => {
    return !search ||
      b.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.contact_email?.toLowerCase().includes(search.toLowerCase());
  });

  const statusIcons = {
    confirmed: CheckCircle,
    pending: Clock,
    cancelled: XCircle,
    completed: CheckCircle,
  };

  const statusColors = {
    confirmed: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
    pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    cancelled: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    completed: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trek Bookings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {bookings.filter(b => b.status === 'pending').length} pending confirmation
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by contact name or email..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Bookings */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const StatusIcon = statusIcons[booking.status as keyof typeof statusIcons];
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mountain className="w-5 h-5 text-emerald-500" />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {booking.hikes?.name || 'Unknown Trek'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {booking.hikes?.location}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Contact</p>
                        <p className="font-medium text-gray-900 dark:text-white">{booking.contact_name}</p>
                        <p className="text-gray-500 dark:text-gray-400">{booking.contact_email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Participants</p>
                        <p className="font-medium text-gray-900 dark:text-white">{booking.number_of_participants}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total</p>
                        <p className="font-bold text-emerald-600">${Number(booking.total_price).toLocaleString()}</p>
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Special Requests:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{booking.special_requests}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusColors[booking.status as keyof typeof statusColors]}`}>
                      <StatusIcon className="w-4 h-4" />
                      {booking.status}
                    </span>

                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusUpdate(booking.id, e.target.value as typeof booking.status)}
                      className="px-3 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-700 border-0 text-gray-700 dark:text-gray-300"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
