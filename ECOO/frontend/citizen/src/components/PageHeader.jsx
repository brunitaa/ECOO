import { useNavigate } from 'react-router-dom';
import BrandLogo from './brand/BrandLogo';
import './PageHeader.css';

/**
 * Cabecera con volver atrás seguro (dashboard o historial válido).
 */
export default function PageHeader({
  title,
  subtitle,
  backTo = '/',
  backLabel = 'Volver',
  onBack,
  showLogo = false,
}) {
  const navigate = useNavigate();

  const handleBack = async () => {
    if (onBack) {
      await onBack();
      return;
    }
    if (backTo === 'history' && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(backTo, { replace: false });
    }
  };

  return (
    <header className="page-header">
      <button type="button" className="page-header__back" onClick={handleBack} aria-label={backLabel}>
        ← {backLabel}
      </button>
      {showLogo && <BrandLogo height={28} className="page-header__logo" />}
      {title && <h1 className="page-header__title">{title}</h1>}
      {subtitle && <p className="page-header__sub">{subtitle}</p>}
    </header>
  );
}
