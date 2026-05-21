import { motion } from 'framer-motion';
import './EcoWaves.css';

/** Ondas SVG estilo IDEA.jpeg — capas de colinas ecológicas */
export default function EcoWaves({ variant = 'hero', className = '' }) {
  const cls = `ec-waves ec-waves--${variant} ${className}`.trim();

  return (
    <div className={cls} aria-hidden>
      <svg
        className="ec-waves__svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ec-wave-g1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2e7d32" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#66bb6a" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="ec-wave-g2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#66bb6a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a5d6a7" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="ec-wave-g3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a5d6a7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f5f7f2" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#ec-wave-g1)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,165.3C960,149,1056,139,1152,149.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
        <motion.path
          fill="url(#ec-wave-g2)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          d="M0,256L60,245.3C120,235,240,213,360,218.7C480,224,600,256,720,261.3C840,267,960,245,1080,234.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
        <path
          fill="url(#ec-wave-g3)"
          d="M0,288L80,277.3C160,267,320,245,480,250.7C640,256,800,288,960,293.3C1120,299,1280,277,1360,266.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        />
      </svg>
      <div className="ec-waves__glow" />
      <motion.div
        className="ec-waves__orb ec-waves__orb--sun"
        animate={{ y: [0, -8, 0], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="ec-waves__orb ec-waves__orb--water"
        animate={{ x: [0, 12, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}