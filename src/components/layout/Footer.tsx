import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {  MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

const quickLinks = [
  { name: 'All Hikes', path: '/hikes' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'About', path: '/about' },
  //{ name: 'Challenging Treks', path: '/hikes?difficulty=challenging' },
];

const supportLinks = [
  { name: 'Donate Now', path: '/donate' },
  { name: 'Volunteer', path: '/contact?volunteer=true' },
  { name: 'Corporate Partnerships', path: '/sponsors' },
  { name: 'Environmental Programs', path: '/about#environment' },
];

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: 'https://www.facebook.com/' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/' },
  { name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/cleanhike.np/' },
  { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/' },
];

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L30 60M0 30L60 30' stroke='%2322c55e' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              
                <motion.img
  src="https://cleanhikenepal.com/images/196/20503543/cleanHikenepallogo-PPWY3hOAc9-6vQ81N66zMw-zZ-kom6O7oLkwfBB8h7zHA.png"
  alt="CleanHike Logo"
  className="w-12 h-12 rounded-full object-contain"
  whileHover={{ rotate: 360 }}
  transition={{ duration: 0.5 }}
/>
              
              <div>
                <span className="font-bold text-xl">
                  Clean<span className="text-emerald-400">Hike </span> Nepal
                </span>
                <span className="block text-xs text-gray-400"></span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed">
              Preserving Nepal's natural beauty through sustainable eco-tourism. Every step counts towards a cleaner, greener future.
            </p>

            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 relative">
              Explore
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-emerald-500 -mb-2" />
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full group-hover:bg-emerald-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6 relative">
              Support
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-emerald-500 -mb-2" />
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full group-hover:bg-emerald-500 transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6 relative">
              Contact Us
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-emerald-500 -mb-2" />
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>Dakshinkali, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href="mailto:hello@cleanhike.com" className="hover:text-emerald-400 transition-colors">
                  hello@cleanhike.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <a href="tel:+97714234567" className="hover:text-emerald-400 transition-colors">
                  +977 1-423-4567
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 CleanHike Nepal. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> for Nepal's environment
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">
                Terms
              </Link>
              <Link to="/admin/login" className="text-gray-500 hover:text-gray-300 transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}