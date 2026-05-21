import { motion } from 'framer-motion';
import './Card.css';

export default function Card({
  children,
  className = '',
  glass = false,
  hover = true,
  padding = 'md',
  ...props
}) {
  return (
    <motion.article
      className={`ec-card ec-card--${padding}${glass ? ' ec-card--glass' : ''} ${className}`.trim()}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={hover ? { y: -2, boxShadow: 'var(--shadow-md)' } : undefined}
      {...props}
    >
      {children}
    </motion.article>
  );
}