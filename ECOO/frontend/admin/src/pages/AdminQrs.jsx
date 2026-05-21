import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import './AdminMgmt.css';

export default function AdminQrs() {
  const [qrs, setQrs] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [reglas, setReglas] = useState([]);
  const [form, setForm] = useState({
    id_empresa: '',
    id_regla: '',
    nombre: '',
    nombre_campana: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [q, e, r] = await Promise.all([api.getQrs(), api.getEmpresas(), api.getReglas()]);
      setQrs(q);
      setEmpresas(e);
      setReglas(r);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reglasFiltradas = reglas.filter(
    (r) => !form.id_empresa || r.empresa_id === Number(form.id_empresa)
  );

  const crear = async (e) => {
    e.preventDefault();
    try {
      const res = await api.crearQr({
        id_empresa: Number(form.id_empresa),
        id_regla: Number(form.id_regla),
        nombre: form.nombre,
        nombre_campana: form.nombre_campana,
      });
      alert(`QR creado: ${res.qr_codigo}\n${res.url_app}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleEstado = async (id, estado) => {
    try {
      await api.patchQr(id, { estado: estado === 'activo' ? 'inactivo' : 'activo' });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner />;
  return (
    <section className="admin-mgmt">
      <ErrorBanner message={error} onClose={() => setError('')} />
      <h2>Códigos QR (solo administrador Ecoo)</h2>
      <p className="admin-mgmt__hint">Las empresas no generan QR; Ecoo los asigna a campañas y reglas.</p>

      <form className="admin-mgmt__form" onSubmit={crear}>
        <select
          value={form.id_empresa}
          onChange={(e) => setForm({ ...form, id_empresa: e.target.value, id_regla: '' })}
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
          value={form.id_regla}
          onChange={(e) => setForm({ ...form, id_regla: e.target.value })}
          required
        >
          <option value="">Regla de puntos</option>
          {reglasFiltradas.map((r) => (
            <option key={r.id_regla} value={r.id_regla}>
              {r.tipo?.nombre} — {r.puntos_por_unidad} pts
            </option>
          ))}
        </select>
        <input
          placeholder="Nombre del punto"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          placeholder="Campaña (opcional)"
          value={form.nombre_campana}
          onChange={(e) => setForm({ ...form, nombre_campana: e.target.value })}
        />
        <button type="submit" className="btn-primary">
          Generar QR
        </button>
      </form>

      <ul className="admin-mgmt__list">
        {qrs.map((q) => (
          <li key={q.id_punto} className="admin-mgmt__card admin-mgmt__card--qr">
            {q.qr_data_url && (
              <img
                src={q.qr_data_url}
                alt={`QR ${q.qr_codigo}`}
                className="admin-mgmt__qr-img"
              />
            )}
            <div>
              <strong>{q.nombre}</strong>
              <small>{q.qr_codigo}</small>
              <small>
                {q.empresa_nombre} · {q.puntos_por_unidad} pts · {q.escaneos} escaneos
              </small>
              <a href={q.url} target="_blank" rel="noreferrer">
                Abrir en app ciudadano
              </a>
              {q.qr_data_url && (
                <a href={q.qr_data_url} download={`${q.qr_codigo}.png`}>
                  Descargar QR para impresión
                </a>
              )}
            </div>
            <button type="button" className="btn-ghost" onClick={() => toggleEstado(q.id_punto, q.estado)}>
              {q.estado === 'activo' ? 'Desactivar' : 'Activar'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}