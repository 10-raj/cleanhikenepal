import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Hikes', path: '/hikes' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Donate', path: '/donate' },
  { name: 'Sponsors', path: '/sponsors' },
  { name: 'Contact', path: '/contact' },
];

const socialLinks = [
  { icon: Facebook, url: 'https://facebook.com' },
  { icon: Instagram, url: 'https://www.instagram.com/cleanhike.np/' },
  { icon: Twitter, url: 'https://twitter.com' },
  { icon: Youtube, url: 'https://youtube.com' },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="
          fixed top-0 left-0 right-0 z-40
          bg-white/70 dark:bg-gray-900/70
          backdrop-blur-xl shadow-md
          transition-all duration-500
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3">
              <motion.img
                src="https://cleanhikenepal.com/images/196/20503543/cleanHikenepallogo-PPWY3hOAc9-6vQ81N66zMw-zZ-kom6O7oLkwfBB8h7zHA.png"
                alt="CleanHike Logo"
                className="w-12 h-12 rounded-full object-contain"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />

              <span className="hidden sm:block font-bold text-xl text-gray-900 dark:text-white">
                Clean<span className="text-emerald-500">Hike</span> Nepal
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg transition
                    ${
                      location.pathname === link.path
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-emerald-500'
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

              {/* THEME */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                {theme === 'dark'
                  ? <Sun className="w-5 h-5" />
                  : <Moon className="w-5 h-5" />
                }
              </button>

              {/* SUPPORT US */}
              <Link to="/donate" className="hidden md:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    px-5 py-2.5 rounded-xl font-semibold text-sm
                    bg-gradient-to-r from-emerald-500 to-green-600
                    text-white shadow-lg shadow-emerald-500/25
                  "
                >
                  Support Us
                </motion.button>
              </Link>

              {/* SOCIAL ICONS (NOW AFTER SUPPORT US) */}
              <div className="hidden md:flex items-center gap-2">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-emerald-500"
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>

              {/* MOBILE MENU */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-800"
              >
                {isMobileMenuOpen
                  ? <X className="w-6 h-6" />
                  : <Menu className="w-6 h-6" />
                }
              </button>

            </div>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 p-6 pt-24 space-y-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    block px-4 py-3 rounded-xl
                    ${
                      location.pathname === link.path
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  {link.name}
                </Link>
              ))}

              <Link to="/donate">
                <button className="w-full mt-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-green-600 text-white">
                  Support Us
                </button>
              </Link>
            </motion.div>
            </motion.div>
            )}
          </AnimatePresence>
    </>
  );
}