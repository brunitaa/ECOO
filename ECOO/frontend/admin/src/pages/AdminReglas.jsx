import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import './AdminMgmt.css';

export default function AdminReglas() {
  const [reglas, setReglas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [form, setForm] = useState({
    id_empresa: '',
    id_tipo: '',
    puntos_por_unidad: 6,
    observaciones: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [r, e, t] = await Promise.all([api.getReglas(), api.getEmpresas(), api.getTipos()]);
      setReglas(r);
      setEmpresas(e);
      setTipos(t);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const crear = async (e) => {
    e.preventDefault();
    try {
      await api.crearRegla({
        id_empresa: Number(form.id_empresa),
        id_tipo: Number(form.id_tipo),
        puntos_por_unidad: Number(form.puntos_por_unidad),
        observaciones: form.observaciones,
      });
      setForm({ id_empresa: '', id_tipo: '', puntos_por_unidad: 6, observaciones: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;
  return (
    <section className="admin-mgmt">
      <ErrorBanner message={error} onClose={() => setError('')} />
      <h2>Reglas de ECOO POINTS</h2>
      <p className="admin-mgmt__hint">Valores negociados por empresa y tipo de reciclaje (no hardcodeados).</p>

      <form className="admin-mgmt__form" onSubmit={crear}>
        <select
          value={form.id_empresa}
          onChange={(e) => setForm({ ...form, id_empresa: e.target.value })}
          required
        >
          <option value="">Empresa</option>
          {empresas.map((emp) => (
            <option key={emp.id_empresa} value={emp.id_empresa}>
              {emp.nombre}
            </option>
          ))}
        </select>
        <select
          value={form.id_tipo}
          onChange={(e) => setForm({ ...form, id_tipo: e.target.value })}
          required
        >
          <option value="">Tipo reciclaje</option>
          {tipos.map((t) => (
            <option key={t.id_tipo} value={t.id_tipo}>
              {t.nombre} ({t.unidad_medida})
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          placeholder="Puntos por unidad"
          value={form.puntos_por_unidad}
          onChange={(e) => setForm({ ...form, puntos_por_unidad: e.target.value })}
          required
        />
        <input
          placeholder="Observaciones comerciales"
          value={form.observaciones}
          onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
        />
        <button type="submit" className="btn-primary">
          Crear regla
        </button>
      </form>

      <ul className="admin-mgmt__list">
        {reglas.map((r) => (
          <li key={r.id_regla} className="admin-mgmt__card">
            <div>
              <strong>{r.empresa_nombre}</strong>
              <small>
                {r.tipo?.nombre} · {r.puntos_por_unidad} pts/{r.tipo?.unidad_medida} · {r.qrs_asociados}{' '}
                QR
              </small>
            </div>
            <span className={`pill pill--${r.estado === 'activo' ? 'ok' : 'off'}`}>{r.estado}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}