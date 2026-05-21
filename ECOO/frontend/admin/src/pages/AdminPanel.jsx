import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ActionCard from '../components/ActionCard';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import { Icon } from '../components/icons';
import './AdminPanel.css';

export default function AdminPanel({ adminId }) {
  const [pendientes, setPendientes] = useState([]);
  const [procesadas, setProcesadas] = useState([]);
  const [removing, setRemoving] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [p, proc] = await Promise.all([
        api.getPendientes(),
        api.getProcesadas(),
      ]);
      setPendientes(p);
      setProcesadas(proc);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 12000);
    return () => clearInterval(timer);
  }, []);

  const removeCard = (id) => {
    setRemoving((s) => new Set(s).add(id));
    setTimeout(() => {
      setPendientes((list) => list.filter((a) => a.id_accion !== id));
      setRemoving((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
      load();
    }, 320);
  };

  const aprobar = async (id_accion) => {
    try {
      await api.verificarAccion({ id_accion, id_admin: adminId, veredicto: 'aprobada' });
      removeCard(id_accion);
    } catch (e) {
      setError(e.message);
    }
  };

  const rechazar = async (id_accion, motivo_rechazo) => {
    try {
      await api.verificarAccion({
        id_accion,
        id_admin: adminId,
        veredicto: 'rechazada',
        motivo_rechazo,
      });
      removeCard(id_accion);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="app-shell app-shell--wide admin-panel">
      <header className="admin-panel__hdr">
        <div>
          <h1>Panel de validación</h1>
          <p>
            {pendientes.length} pendientes · Cola Ecoo
          </p>
        </div>
        <div className="admin-panel__stats">
          <span className="pill pill--pend">{pendientes.length} pendientes</span>
        </div>
      </header>

      <main className="admin-panel__main">
        <ErrorBanner message={error} onClose={() => setError('')} />

        {loading ? (
          <Spinner />
        ) : (
          <>
            <section>
              {pendientes.length === 0 && (
                <p className="admin-panel__empty">No hay acciones pendientes. Todo al dia.</p>
              )}
              {pendientes.map((a) => (
                <ActionCard
                  key={a.id_accion}
                  accion={a}
                  removing={removing.has(a.id_accion)}
                  onAprobar={aprobar}
                  onRechazar={rechazar}
                />
              ))}
            </section>

            <section className="admin-panel__processed">
              <h2>Procesadas recientemente</h2>
              <ul>
                {procesadas.map((p) => (
                  <li key={p.id_accion}>
                    <span className="admin-panel__proc-name">
                      <Icon
                        name={p.estado_validacion === 'aprobada' ? 'check' : 'x'}
                        size={14}
                      />{' '}
                      {p.usuario_nombre}
                    </span>
                    <span className={p.estado_validacion === 'aprobada' ? 'appr' : 'rej'}>
                      {p.estado_validacion === 'aprobada'
                        ? `+${p.ecocoins_ganados} EC`
                        : 'Rechazada'}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  );
}