import "./EcoCoinBadge.css";

export default function EcoCoinBadge({ amount, size = "md" }) {
  return (
    <span className={`ecoin-badge ecoin-badge--${size}`.trim()}>
      <span className="ecoin-badge__icon">EC</span>
      {amount != null && <span className="ecoin-badge__amount">{amount}</span>}
    </span>
  );
}