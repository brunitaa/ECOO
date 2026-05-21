import BrandLogo from './BrandLogo';
import './Brand.css';

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <BrandLogo height={28} />
      <p>Sostenibilidad con recompensas reales · Santa Cruz, Bolivia</p>
    </footer>
  );
}
