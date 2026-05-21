import Card from '../ui/Card.jsx';
import './ChartCard.css';

export default function ChartCard({ title, subtitle, children, className = '', action }) {
  return (
    <Card className={`ec-chart-card ${className}`.trim()} padding="md" hover={false}>
      <header className="ec-chart-card__hdr">
        <div>
          <h3 className="ec-chart-card__title">{title}</h3>
          {subtitle && <p className="ec-chart-card__sub">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="ec-chart-card__body">{children}</div>
    </Card>
  );
}