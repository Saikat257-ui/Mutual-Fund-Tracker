import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export function Input({
  label,
  id,
  type = 'text',
  error,
  ...props
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <motion.input
        className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        whileFocus={{ scale: 1.01 }}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

export function Button({ children, onClick, className = "", variant = "primary", isLoading = false, disabled = false }) {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500"
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
          <span className="ml-2">Loading...</span>
        </div>
      ) : children}
    </motion.button>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function Card({ children, className = "" }) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Alert({ type = "info", message }) {
  const variants = {
    success: "bg-green-50 text-green-800 border-green-500",
    error: "bg-red-50 text-red-800 border-red-500",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-500",
    info: "bg-blue-50 text-blue-800 border-blue-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-4 rounded-lg border-l-4 ${variants[type]}`}
    >
      {message}
    </motion.div>
  );
}

export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    primary: "bg-indigo-100 text-indigo-800"
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </motion.span>
  );
}

export function Tooltip({ children, content }) {
  return (
    <div className="relative group">
      {children}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute z-10 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 bottom-full mb-2"
      >
        {content}
        <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2" />
      </motion.div>
    </div>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-gray-600"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
