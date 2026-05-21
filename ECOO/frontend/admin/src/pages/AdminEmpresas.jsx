import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import './AdminMgmt.css';

export default function AdminEmpresas() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setList(await api.getEmpresas());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setSuscripcion = async (id, estado_suscripcion) => {
    try {
      await api.patchEmpresa(id, { estado_suscripcion });
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <Spinner />;
  return (
    <section className="admin-mgmt">
      <ErrorBanner message={error} onClose={() => setError('')} />
      <h2>Empresas afiliadas</h2>
      <p className="admin-mgmt__hint">Aprueba suscripciones y gestiona el acceso al ecosistema Ecoo.</p>
      <ul className="admin-mgmt__list">
        {list.map((e) => (
          <li key={e.id_empresa} className="admin-mgmt__card">
            <div>
              <strong>{e.nombre}</strong>
              <small>{e.correo_contacto} · {e.tipo_empresa}</small>
              <small>
                {e.puntos_count} QR · {e.reglas_count} reglas · Plan {e.plan}
              </small>
            </div>
            <select
              value={e.estado_suscripcion}
              onChange={(ev) => setSuscripcion(e.id_empresa, ev.target.value)}
            >
              <option value="activa">Activa</option>
              <option value="pendiente">Pendiente</option>
              <option value="suspendida">Suspendida</option>
            </select>
          </li>
        ))}
      </ul>
    </section>
  );
}