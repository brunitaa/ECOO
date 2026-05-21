import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import FeedbackScreen from '../components/FeedbackScreen';
import Spinner from '../components/Spinner';
import './CashierView.css';

export default function CashierView() {
  const [uuid, setUuid] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const validar = async () => {
    if (!uuid.trim()) return;
    try {
      setLoading(true);
      setResult(null);
      const res = await api.validarCupon(uuid.trim());
      setResult({
        type: 'success',
        title: '¡Cupón válido!',
        message: `${res.titulo} — ${res.usuario}`,
      });
    } catch (e) {
      let msg = e.message;
      if (e.details?.fecha_canje) {
        msg += ` (canjeado el ${new Date(e.details.fecha_canje).toLocaleString('es-BO')})`;
      }
      setResult({ type: 'error', title: 'Cupón inválido', message: msg });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <FeedbackScreen
        type={result.type}
        title={result.title}
        message={result.message}
        onReset={() => {
          setResult(null);
          setUuid('');
        }}
      />
    );
  }

  return (
    <div className="cashier">
      <header className="cashier__hdr">
        <Link to="/roles" className="cashier__back">
          ←
        </Link>
        <h1>Validación en caja</h1>
        <span className="cashier__brand">ECOO</span>
      </header>

      <main className="cashier__main">
        <p className="cashier__instr">
          Escanea o pega el UUID del cupón del cliente
        </p>

        <input
          className="cashier__input"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          placeholder="00000000-0000-0000-0000-000000000000"
          autoComplete="off"
        />

        {loading ? (
          <Spinner label="Validando cupón..." />
        ) : (
          <button type="button" className="cashier__btn" onClick={validar}>
            Validar cupón
          </button>
        )}

        <p className="cashier__demo">
          Modo demo: canjea un premio en la app ciudadano y pega aquí el UUID del QR
        </p>
      </main>
    </div>
  );
}
