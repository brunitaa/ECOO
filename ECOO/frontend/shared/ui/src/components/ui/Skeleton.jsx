import { motion } from 'framer-motion';
import './Skeleton.css';

export function Skeleton({ className = '', width, height, circle = false }) {
  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;
  return (
    <span
      className={`ec-skeleton${circle ? ' ec-skeleton--circle' : ''} ${className}`.trim()}
      style={style}
      aria-hidden
    />
  );
}

export function SkeletonKpiGrid({ count = 4 }) {
  return (
    <motion.div className="ec-skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} className="ec-skeleton-card" layout>
          <Skeleton circle width={44} height={44} />
          <motion.div style={{ flex: 1 }}>
            <Skeleton height={24} width="60%" />
            <Skeleton height={14} width="80%" className="ec-skeleton-mt" />
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}