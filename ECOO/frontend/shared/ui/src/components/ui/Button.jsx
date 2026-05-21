import { motion } from 'framer-motion';
import Icon from '../icons/Icon.jsx';
import './Button.css';

const variants = {
  primary: 'ec-btn--primary',
  secondary: 'ec-btn--secondary',
  ghost: 'ec-btn--ghost',
  danger: 'ec-btn--danger',
  coin: 'ec-btn--coin',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  className = '',
  as = 'button',
  ...props
}) {
  const cls = `ec-btn ${variants[variant] || variants.primary} ec-btn--${size} ${className}`.trim();
  const content = (
    <>
      {loading && <Icon name="loader" size={18} className="ec-btn__spin" />}
      {!loading && icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {iconRight && !loading && <Icon name={iconRight} size={18} />}
    </>
  );

  if (as === 'a') {
    return (
      <a className={cls} {...props}>
        {content}
      </a>
    );
  }

  return (
    <motion.button
      type="button"
      className={cls}
      disabled={loading || props.disabled}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {content}
    </motion.button>
  );
}