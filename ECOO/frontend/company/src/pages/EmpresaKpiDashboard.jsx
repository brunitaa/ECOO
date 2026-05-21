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
import "./EmpresaKpiDashboard.css";

const formatNumber = (value) =>
  typeof value === "number" ? value.toLocaleString("es-BO") : value;

export default function EmpresaKpiDashboard({ empresaId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const analytics = await api.getEmpresaAnalytics(empresaId);
        setData(analytics);
        setError("");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (empresaId) load();
    const timer = setInterval(() => {
      if (empresaId) load();
    }, 15000);

    return () => clearInterval(timer);
  }, [empresaId]);

  if (loading) {
    return (
      <div className="kpi-dash">
        <Spinner label="Cargando dashboard empresarial..." />
        <SkeletonKpiGrid count={8} />
      </div>
    );
  }

  if (!data) return <ErrorBanner message={error || "Sin datos disponibles"} />;

  const {
    empresa,
    resumen,
    serie_mensual,
    estados_chart,
    top_qrs,
    por_material,
    por_campana,
    top_ciudadanos,
    actividad_reciente,
    qr_summary,
    indice_esg,
    nivel_rse,
    conversion_qr,
    promedio_diario,
    promedio_mensual,
    nuevos_ciudadanos,
    usuarios_recurrentes,
  } = data;

  return (
    <div className="kpi-dash">
      <ErrorBanner message={error} onClose={() => setError("")} />

      <header className="kpi-dash__hero">
        <div>
          <p className="kpi-dash__eyebrow">Panel ejecutivo | Empresa</p>
          <h1>{empresa.nombre}</h1>
          <p className="kpi-dash__lead">
            Métricas RSE, participación ciudadana y resultados de campañas para
            tu empresa.
          </p>
        </div>
        <div className="kpi-dash__hero-card">
          <div className="kpi-dash__hero-score">
            <span>Índice ESG</span>
            <strong>{formatNumber(indice_esg)}</strong>
          </div>
          <p className="kpi-dash__hero-level">{nivel_rse}</p>
          <div className="kpi-dash__hero-detail">
            <span>
              <Icon name="zap" size={16} /> En vivo
            </span>
            <span>
              <Icon name="building" size={16} /> {resumen.campanas_activas}{" "}
              campañas
            </span>
          </div>
        </div>
      </header>

      <div className="kpi-dash__grid">
        <KpiCard
          label="Reciclajes aprobados"
          value={resumen.aprobadas}
          icon="check"
        />
        <KpiCard
          label="ECOO POINTS entregados"
          value={resumen.ecocoins_otorgados}
          icon="coin"
        />
        <KpiCard
          label="Ciudadanos participantes"
          value={resumen.ciudadanos_participantes}
          icon="users"
        />
        <KpiCard
          label="CO2 evitado"
          value={formatNumber(Number(resumen.co2_evitado))}
          suffix="kg"
          icon="tree"
        />
        <KpiCard
          label="Kg reciclados"
          value={formatNumber(Number(resumen.kg_reciclados))}
          suffix="kg"
          icon="recycle"
        />
        <KpiCard label="QR activos" value={qr_summary.activos} icon="qr" />
        <KpiCard
          label="Tasa de conversión"
          value={`${conversion_qr}%`}
          icon="arrowUpRight"
        />
        <KpiCard
          label="Promedio diario"
          value={`${promedio_diario} acciones`}
          icon="clock"
        />
      </div>

      <div className="kpi-dash__summary-row">
        <div className="kpi-stat-card">
          <span>Participación ecológica</span>
          <strong>{formatNumber(data.participacion_ecologica)}%</strong>
        </div>
        <div className="kpi-stat-card">
          <span>Usuarios recurrentes</span>
          <strong>{formatNumber(usuarios_recurrentes)}</strong>
        </div>
        <div className="kpi-stat-card">
          <span>Promedio mensual</span>
          <strong>{promedio_mensual} acciones</strong>
        </div>
        <div className="kpi-stat-card">
          <span>Acciones recientes</span>
          <strong>{formatNumber(actividad_reciente?.length || 0)}</strong>
        </div>
      </div>

      <div className="kpi-dash__charts">
        <ChartCard title="Evolución mensual" subtitle="Acciones aprobadas">
          <LineChartPanel data={serie_mensual || []} />
        </ChartCard>
        <ChartCard title="Estado de solicitudes" subtitle="RSE en tiempo real">
          <DonutChartPanel data={estados_chart || []} />
        </ChartCard>
        <ChartCard title="Top QR" subtitle="Más escaneados">
          <BarChartPanel data={top_qrs || []} color="#2e7d32" />
        </ChartCard>
        <ChartCard title="Materiales reciclados" subtitle="Por categoría">
          <BarChartPanel data={por_material || []} color="#66bb6a" />
        </ChartCard>
      </div>

      <section className="kpi-panel-grid">
        <article className="kpi-panel kpi-panel--wide">
          <div className="kpi-panel__title">
            <h2>Campañas y conversión</h2>
          </div>
          <p className="kpi-panel__subtitle">
            Rendimiento por campaña activa y porcentaje de impacto efectivo.
          </p>
          <ul>
            {por_campana.map((campana) => (
              <li key={campana.label}>
                <span>{campana.label}</span>
                <strong>{campana.value}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="kpi-panel">
          <div className="kpi-panel__title">
            <h2>QR & actividad</h2>
          </div>
          <p className="kpi-panel__subtitle">
            Visión consolidada de escaneos y rendimiento de puntos ecológicos.
          </p>
          <div className="kpi-panel__grid">
            <div>
              <span>Total escaneos</span>
              <strong>{formatNumber(qr_summary.total_escaneos)}</strong>
            </div>
            <div>
              <span>QR activos</span>
              <strong>{formatNumber(qr_summary.activos)}</strong>
            </div>
            <div>
              <span>QR expirados</span>
              <strong>{formatNumber(qr_summary.expirados)}</strong>
            </div>
            <div>
              <span>Campañas activas</span>
              <strong>{formatNumber(resumen.campanas_activas)}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="kpi-activity-layout">
        <article className="kpi-panel kpi-panel--large">
          <div className="kpi-panel__title">
            <h2>Top ciudadanos recicladores</h2>
          </div>
          <ol className="kpi-leaderboard">
            {top_ciudadanos.map((user) => (
              <li key={user.posicion}>
                <span>
                  #{user.posicion} {user.nombre}
                </span>
                <div>
                  <strong>{user.acciones}</strong>
                  <small>Acciones</small>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="kpi-panel kpi-panel--large">
          <div className="kpi-panel__title">
            <h2>Actividad reciente</h2>
          </div>
          <ul className="kpi-activity-list">
            {actividad_reciente.map((a) => (
              <li key={a.id_accion}>
                <div>
                  <strong>{a.usuario || "Anónimo"}</strong>
                  <span>{a.punto}</span>
                </div>
                <div>
                  <span>+{a.ecocoins} EC</span>
                  <small>{a.respuesta || ""}</small>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}