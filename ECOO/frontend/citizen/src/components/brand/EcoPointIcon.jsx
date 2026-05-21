import './Brand.css';

const POINT_SRC = '/branding/ecoo-point.png';

export default function EcoPointIcon({ size = 28, className = '', alt = 'ECOO POINT' }) {
  return (
    <img
      src={POINT_SRC}
      alt={alt}
      className={`eco-point-icon ${className}`.trim()}
      width={size}
      height={size}
      loading="lazy"
    />
  );
}
