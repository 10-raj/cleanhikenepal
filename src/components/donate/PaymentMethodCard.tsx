import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { PaymentMethod } from '../../config/paymentMethods';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onClick: () => void;
}

export function PaymentMethodCard({ method, onClick }: PaymentMethodCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div
        onClick={onClick}
        className="cursor-pointer p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-xl"
      >
        {/* Gradient accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${method.color}`} />

        <div className="flex items-start gap-4 mb-4">
          {/* Logo placeholder */}
          <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">{method.name.charAt(0)}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {method.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{method.walletId}</p>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          {method.description}
        </p>

        <button
          className={`w-full py-3 rounded-xl bg-gradient-to-r ${method.color} text-white font-medium flex items-center justify-center gap-2 group-hover:shadow-lg transition-all`}
        >
          <span>Donate via {method.name}</span>
          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </motion.div>
  );
}

// Bank Transfer Card
export function BankTransferCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div
        onClick={onClick}
        className="cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 hover:border-slate-500 transition-all shadow-lg hover:shadow-xl text-white"
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Bank Transfer</h3>
            <p className="text-gray-300 text-sm">Direct deposit to our bank account</p>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4">
          Transfer directly to our bank account. Perfect for large donations and international transfers.
        </p>

        <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium flex items-center justify-center gap-2 transition-all">
          <span>View Bank Details</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
