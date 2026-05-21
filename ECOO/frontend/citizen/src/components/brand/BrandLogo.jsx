import './Brand.css';

const LOGO_SRC = '/branding/logo-ecoo.png';

export default function BrandLogo({ className = '', height = 36, alt = 'Ecoo' }) {
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      className={`brand-logo ${className}`.trim()}
      style={{ height, width: 'auto' }}
      loading="eager"
    />
  );
}
