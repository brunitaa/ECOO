import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import { Button } from '@ecoo/ui';
import { Icon } from '../components/icons';
import './EmpresaQrPanel.css';

function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function downloadSvg(svgString, filename) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function EmpresaQrPanel({ empresaId }) {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const data = await api.getEmpresaQrs(empresaId);
      setQrs(data);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, [empresaId]);

  if (loading) return <Spinner label="Cargando QRs..." />;

  return (
    <section className="empresa-qr">
      <ErrorBanner message={error} onClose={() => setError('')} />
      <header className="empresa-qr__hdr">
        <h2>
          <Icon name="qr" size={22} /> Codigos QR ECOO POINT
        </h2>
        <p>Descarga, imprime y coloca en tus puntos ecologicos.</p>
      </header>
      <ul className="empresa-qr__list">
        {qrs.map((q) => (
          <li key={q.id_punto} className="empresa-qr__card ec-glass">
            <img src={q.qr_data_url} alt={`QR ${q.qr_codigo}`} className="empresa-qr__img" />
            <div className="empresa-qr__meta">
              <strong>{q.nombre}</strong>
              <span className="empresa-qr__code">{q.qr_codigo}</span>
              {q.campana && <span>Campa�a: {q.campana}</span>}
              <span>{q.tipo} � {q.puntos_por_unidad} pts/unidad</span>
              <span>
                {q.escaneos} usos � {q.estado}
                {q.fecha_expiracion &&
                  ` � expira ${new Date(q.fecha_expiracion).toLocaleDateString('es-BO')}`}
              </span>
              <div className="empresa-qr__actions">
                <Button
                  size="sm"
                  variant="secondary"
                  icon="download"
                  onClick={() => downloadDataUrl(q.qr_data_url, `${q.qr_codigo}.png`)}
                >
                  PNG
                </Button>
                {q.qr_svg && (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon="download"
                    onClick={() => downloadSvg(q.qr_svg, `${q.qr_codigo}.svg`)}
                  >
                    SVG
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  icon="external"
                  as="a"
                  href={q.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.print()}
                >
                  Imprimir
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}