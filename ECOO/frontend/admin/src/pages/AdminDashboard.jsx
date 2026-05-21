import { useEffect, useState } from "react";
import { api } from "../api/client";
import Spinner from "../components/Spinner";
import ErrorBanner from "../components/ErrorBanner";
import {
  KpiCard,
  SkeletonKpiGrid,
  ChartCard,
  LineChartPanel,
  BarChartPanel,
  DonutChartPanel,
} from "@ecoo/ui";
import { Icon } from "../components/icons";
import "./AdminDashboard.css";

const formatNumber = (value) =>
  typeof value === "number" ? value.toLocaleString("es-BO") : value;

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const d = await api.getDashboard();
      setData(d);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  if (loading) {
    return (
      <section className="admin-dash">
        <Spinner label="Cargando tablero ejecutivo..." />
        <SkeletonKpiGrid count={10} />
      </section>
    );
  }

  if (!data) return <ErrorBanner message={error || "Sin datos para mostrar"} />;

  const { resumen } = data;

  return (
    <section className="admin-dash">
      <ErrorBanner message={error} onClose={() => setError("")} />

      <header className="admin-dash__hero">
        <div>
          <p className="admin-dash__eyebrow">Tablero global</p>
          <h1>Vista ejecutiva ECOO</h1>
          <p className="admin-dash__lead">
            Analítica global de empresas, reciclaje, QR, solicitudes y
            sostenibilidad en tiempo real.
          </p>
        </div>
        <div className="admin-dash__hero-meta">
          <span className="admin-dash__badge">
            Actualizado{" "}
            {new Date(data.actualizado_en).toLocaleTimeString("es-BO")}
          </span>
          <span className="admin-dash__badge admin-dash__badge--live">
            <Icon name="zap" size={14} /> En vivo
          </span>
        </div>
      </header>

      <div className="admin-dash__grid">
        <KpiCard
          label="Empresas afiliadas"
          value={resumen.empresas_activas}
          icon="building"
        />
        <KpiCard
          label="Reciclajes globales"
          value={resumen.reciclajes_total}
          icon="recycle"
        />
        <KpiCard
          label="Solicitudes pendientes"
          value={resumen.solicitudes_pendientes}
          icon="clock"
        />
        <KpiCard
          label="Aprobaciones"
          value={resumen.solicitudes_aprobadas}
          icon="check"
        />
        <KpiCard
          label="Rechazos"
          value={resumen.solicitudes_rechazadas}
          icon="x"
        />
        <KpiCard
          label="ECOO POINTS"
          value={resumen.ecoo_points_entregados}
          icon="coin"
        />
        <KpiCard
          label="Campañas activas"
          value={resumen.campanas_activas}
          icon="target"
        />
        <KpiCard
          label="Tasa de aprobación"
          value={`${resumen.tasa_aprobacion}%`}
          icon="shield"
        />
      </div>

      <div className="admin-dash__charts">
        <ChartCard title="Crecimiento mensual" subtitle="Reciclajes aprobados">
          <LineChartPanel data={data.serie_mensual || []} />
        </ChartCard>
        <ChartCard
          title="Estado de solicitudes"
          subtitle="Aprobado / pendiente / rechazado"
        >
          <DonutChartPanel data={data.estados_chart || []} />
        </ChartCard>
        <ChartCard title="Actividad por empresa" subtitle="Top compañías">
          <BarChartPanel data={data.actividad_empresas || []} color="#2e7d32" />
        </ChartCard>
      </div>

      <div className="admin-dash__cols">
        <section className="admin-dash__panel admin-dash__panel--wide">
          <div className="admin-dash__panel-title">
            <h2>
              <Icon name="zap" size={18} /> Actividad reciente
            </h2>
            <span>Flujo en tiempo real</span>
          </div>
          <ul className="admin-dash__activity-list">
            {data.actividad_reciente.map((action) => (
              <li key={action.id_accion}>
                <div>
                  <strong>{action.usuario || "Usuario"}</strong>
                  <span>{action.empresa || "Empresa"}</span>
                </div>
                <div>
                  <span>{action.estado}</span>
                  <small>
                    {new Date(action.fecha).toLocaleString("es-BO")}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-dash__panel">
          <div className="admin-dash__panel-title">
            <h2>
              <Icon name="award" size={18} /> Empresas más activas
            </h2>
            <span>Ranking de impacto</span>
          </div>
          <ol className="admin-dash__ranking">
            {data.top_empresas.map((item, index) => (
              <li key={item.label}>
                <span>
                  #{index + 1} {item.label}
                </span>
                <strong>{formatNumber(item.value)}</strong>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="admin-dash__alerts">
        <h2>Alertas operativas</h2>
        <div className="admin-dash__alerts-grid">
          {data.alertas.map((alert, index) => (
            <article key={index} className="admin-dash__alert-card">
              <span className="admin-dash__alert-type">{alert.tipo}</span>
              <p>{alert.mensaje}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}