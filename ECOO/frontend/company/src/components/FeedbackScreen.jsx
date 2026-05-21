import './FeedbackScreen.css';

export default function FeedbackScreen({ type, title, message, onReset }) {
  const isSuccess = type === 'success';
  return (
    <div className={`feedback-screen feedback-screen--${type}`}>
      <div className="feedback-screen__icon" aria-hidden>
        {isSuccess ? '✓' : '✕'}
      </div>
      <h1>{title}</h1>
      <p>{message}</p>
      {onReset && (
        <button type="button" className="feedback-screen__btn" onClick={onReset}>
          Validar otro cupón
        </button>
      )}
    </div>
  );
}
