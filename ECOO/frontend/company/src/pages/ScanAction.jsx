import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import BottomNav from '../components/BottomNav';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import './ScanAction.css';

const DEMO_QR = 'ECOO-UPSA-A-2026';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no disponible en este navegador'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => reject(new Error('No se pudo obtener tu ubicación. Activa el GPS.')),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  });
}

export default function ScanAction() {
  const { userId } = useApp();
  const navigate = useNavigate();
  const [qr, setQr] = useState(DEMO_QR);
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!foto) {
      setError('Sube una foto de evidencia');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const [{ lat, lng }, fotoUrl] = await Promise.all([
        getGeolocation(),
        readFileAsDataUrl(foto),
      ]);
      const res = await api.registrarAccion({
        id_usuario: userId,
        qr_codigo: qr.trim(),
        lat,
        lng,
        foto_url: fotoUrl,
      });
      setSuccess(res);
      setStep('success');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="app-shell">
        <div className="scan-success">
          <div className="scan-success__icon">✓</div>
          <h1>¡Acción registrada!</h1>
          <p>{success?.mensaje}</p>
          <p className="scan-success__meta">
            Punto: {success?.punto?.nombre} · {success?.distancia_metros}m de distancia
          </p>
          <button type="button" className="scan-success__btn" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="scan-header">
        <h1>Registrar acción ECO</h1>
        <p>Escanea el QR del punto ecológico y sube tu evidencia</p>
      </header>
      <main className="page scan-action">
        <ErrorBanner message={error} onClose={() => setError('')} />

        <label className="scan-field">
          <span>Código QR del punto</span>
          <input
            value={qr}
            onChange={(e) => setQr(e.target.value)}
            placeholder="ECOO-UPSA-A-2026"
          />
        </label>

        <label className="scan-field">
          <span>Foto de evidencia</span>
          <input type="file" accept="image/*" capture="environment" onChange={onFile} />
        </label>

        {preview && (
          <img src={preview} alt="Vista previa" className="scan-preview" />
        )}

        <p className="scan-hint">
          📍 Usaremos tu GPS para verificar que estás en el punto (máx. 50m)
        </p>

        {loading ? (
          <Spinner label="Verificando ubicación y registrando..." />
        ) : (
          <button type="button" className="scan-submit" onClick={submit}>
            Enviar acción
          </button>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
