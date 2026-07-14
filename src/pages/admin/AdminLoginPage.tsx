import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Mountain } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ADMIN_CONFIG } from '../../config/admin';

export function AdminLoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSupabaseConfigured = !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== '' &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError('Admin panel is not configured yet. Please contact the site administrator.');
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await signIn(email, password);
      // signIn returns void but sets user in context — check role after
      navigate('/admin', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      if (
        message.toLowerCase().includes('invalid') ||
        message.toLowerCase().includes('credentials') ||
        message.toLowerCase().includes('password')
      ) {
        setError('Invalid email or password.');
      } else if (
        message.toLowerCase().includes('network') ||
        message.toLowerCase().includes('fetch') ||
        message.toLowerCase().includes('failed to fetch')
      ) {
        setError('Connection error. Please try again.');
      } else if (message.toLowerCase().includes('email not confirmed')) {
        setError('Please confirm your email address before signing in.');
      } else {
        setError('Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="p-8 bg-gradient-to-br from-emerald-500 to-green-600 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center"
            >
              <ShieldCheck className="w-8 h-8" />
            </motion.div>
            <h1 className="text-2xl font-bold">Admin Control Panel</h1>
            <p className="text-white/80 text-sm mt-2">Sign in to manage CleanHike Nepal</p>
          </div>

          {/* Supabase Setup Warning */}
          {!isSupabaseConfigured && (
            <div className="px-8 pt-6">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">Setup Required</p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Replit Secrets to enable login.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <Input
              id="email"
              type="email"
              label="Email Address"
              placeholder={ADMIN_CONFIG.defaultEmail}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            <Button type="submit" size="lg" className="w-full" isLoading={loading}>
              {!loading && <Lock className="w-5 h-5 mr-2" />}
              Sign In to Dashboard
              {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>
          </form>

          {ADMIN_CONFIG.hint && (
            <p className="px-8 pb-2 text-center text-xs text-gray-400 dark:text-gray-500">
              {ADMIN_CONFIG.hint}
            </p>
          )}

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Mountain className="w-4 h-4" />
              Back to CleanHike Nepal
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
