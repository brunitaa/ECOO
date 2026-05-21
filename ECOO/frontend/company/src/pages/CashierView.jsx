import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { api } from '../api/client';
import FeedbackScreen from '../components/FeedbackScreen';
import Spinner from '../components/Spinner';
import { Button } from '@ecoo/ui';
import { Icon } from '../components/icons';
import './CashierView.css';

export default function CashierView() {
  const [mode, setMode] = useState('manual');
  const [uuid, setUuid] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scanError, setScanError] = useState('');
  const scannerRef = useRef(null);

  const validar = async (codigo) => {
    const code = codigo?.trim();
    if (!code) return;
    try {
      setLoading(true);
      setResult(null);
      const res = await api.validarCupon(code);
      setResult({
        type: 'success',
        title: 'Vale canjeado',
        message: `${res.titulo} — ${res.usuario}`,
      });
    } catch (e) {
      let msg = e.message;
      if (e.details?.fecha_canje) {
        msg += ` (canjeado el ${new Date(e.details.fecha_canje).toLocaleString('es-BO')})`;
      }
      setResult({ type: 'error', title: 'Vale invalido', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        /* ignore */
      }
      scannerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (mode !== 'scan') {
      stopScanner();
      return undefined;
    }

    let mounted = true;
    const elId = 'ecoo-caja-qr-reader';

    (async () => {
      try {
        setScanError('');
        const scanner = new Html5Qrcode(elId);
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            if (!mounted) return;
            stopScanner();
            validar(decoded);
          },
          () => {}
        );
        if (mounted) scannerRef.current = scanner;
      } catch (e) {
        if (mounted) setScanError(e.message || 'No se pudo acceder a la camara');
      }
    })();

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [mode, stopScanner]);

  if (result) {
    return (
      <FeedbackScreen
        type={result.type}
        title={result.title}
        message={result.message}
        onReset={() => {
          setResult(null);
          setUuid('');
          setMode('manual');
        }}
      />
    );
  }

  return (
    <div className="cashier">
      <header className="cashier__hdr">
        <h1>
          <Icon name="gift" size={24} /> Canjear vale
        </h1>
        <p>Valida cupones ECOO POINT del cliente</p>
      </header>

      <nav className="cashier__tabs">
        <button
          type="button"
          className={mode === 'manual' ? 'cashier__tab cashier__tab--on' : 'cashier__tab'}
          onClick={() => setMode('manual')}
        >
          <Icon name="lock" size={16} /> Codigo manual
        </button>
        <button
          type="button"
          className={mode === 'scan' ? 'cashier__tab cashier__tab--on' : 'cashier__tab'}
          onClick={() => setMode('scan')}
        >
          <Icon name="scan" size={16} /> Escanear QR
        </button>
      </nav>

      <main className="cashier__main">
        {mode === 'manual' ? (
          <>
            <p className="cashier__instr">Ingresa el codigo UUID del cupon del cliente</p>
            <input
              className="cashier__input"
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              placeholder="00000000-0000-0000-0000-000000000000"
              autoComplete="off"
            />
            {loading ? (
              <Spinner label="Validando..." />
            ) : (
              <Button size="lg" className="cashier__btn" onClick={() => validar(uuid)}>
                Validar y canjear
              </Button>
            )}
          </>
        ) : (
          <>
            <div id="ecoo-caja-qr-reader" className="cashier__scanner" />
            {scanError && <p className="cashier__error">{scanError}</p>}
            {loading && <Spinner label="Procesando canje..." />}
          </>
        )}
      </main>
    </div>
  );
}