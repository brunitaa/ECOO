import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import { api } from "../api/client";

import { useApp } from "../context/AppContext";

import { AppShell, Navbar, BottomNav } from "@ecoo/ui";

import Spinner from "../components/Spinner";

import ErrorBanner from "../components/ErrorBanner";
import { EcoPointIcon, AppFooter } from "@ecoo/ui";
import { KpiCard } from "@ecoo/ui";

import PageTransition from "@ecoo/ui/motion/PageTransition";

import "./CitizenHome.css";

const ACTION_ICONS = {
  reciclaje: "recycle",

  transporte: "bike",

  compra_sostenible: "shopping",
};

export default function CitizenHome() {
  const { userId, saldo, impacto, usuario, setUsuario, updateSaldo } = useApp();

  const [acciones, setAcciones] = useState([]);

  const [ranking, setRanking] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [saldoData, userData, accData, rankData] = await Promise.all([
          api.getSaldo(userId),

          api.getUsuario(userId),

          api.getAcciones(userId),

          api.getRanking().catch(() => []),
        ]);

        updateSaldo(saldoData);

        setUsuario(userData);

        setAcciones(accData);

        setRanking(rankData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId, setUsuario, updateSaldo]);

  return (
    <AppShell
      header={
        <Navbar
          nombre={usuario?.nombre}
          saldo={saldo}
          fotoUrl={usuario?.foto_perfil_url}
        />
      }
      footer={<BottomNav />}
    >
      <main className="page citizen-home">
        <ErrorBanner message={error} onClose={() => setError("")} />

        {loading ? (
          <Spinner label="Cargando tu billetera..." />
        ) : (
          <PageTransition>
            <div className="citizen-home__kpis">
              <KpiCard
                label="Residuos recuperados"
                value={Number(impacto.kg_reciclados)}
                suffix=" kg"
                icon="recycle"
              />

              <KpiCard
                label="CO₂ evitado"
                value={Number(impacto.co2_evitado)}
                suffix=" kg"
                icon="tree"
              />
            </div>

            <Link to="/escanear" className="citizen-home__scan-cta">
              <EcoPointIcon size={48} />

              <motion.div
                className="citizen-home__scan-text"
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <strong>Escanear QR ECOO POINT</strong>

                <p>
                  Registra reciclaje en puntos ecológicos de empresas afiliadas
                </p>
              </motion.div>

              <Icon name="chevronRight" size={22} />
            </Link>

            {ranking.length > 0 && (
              <section className="citizen-home__block">
                <h2 className="citizen-home__section">
                  <Icon name="award" size={18} /> Ranking ecológico
                </h2>

                <ol className="citizen-home__ranking">
                  {ranking.slice(0, 5).map((r) => (
                    <li key={r.id_usuario}>
                      <span className="citizen-home__rank-pos">
                        #{r.posicion}
                      </span>

                      <span>{r.nombre}</span>

                      <span className="citizen-home__rank-ec">
                        {r.ecocoins} EC
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            <section className="citizen-home__block">
              <h2 className="citizen-home__section">
                <Icon name="zap" size={18} /> Acciones recientes
              </h2>

              <ul className="citizen-home__list">
                {acciones.length === 0 && (
                  <li className="citizen-home__empty">
                    <Icon name="scan" size={32} />

                    <p>
                      Aún no tienes acciones. Escanea un punto ecológico para
                      comenzar.
                    </p>
                  </li>
                )}

                {acciones.map((a) => (
                  <li
                    key={a.id_accion}
                    className={`ac-row ac-row--${a.estado_validacion}`}
                  >
                    <span className="ac-row__icon">
                      <Icon
                        name={ACTION_ICONS[a.tipo_accion_permitida] || "leaf"}
                        size={20}
                      />
                    </span>

                    <motion.div className="ac-row__body">
                      <strong>{a.punto_nombre}</strong>

                      {a.respuesta_resumen && (
                        <span className="ac-row__resumen">
                          {a.respuesta_resumen}
                        </span>
                      )}

                      <small>
                        {new Date(a.fecha_registro).toLocaleString("es-BO")}
                      </small>

                      {a.estado_validacion === "rechazada" &&
                        a.motivo_rechazo && (
                          <span className="ac-row__rechazo">
                            Rechazada: {a.motivo_rechazo}
                          </span>
                        )}
                    </motion.div>

                    {a.estado_validacion === "aprobada" && (
                      <span className="ac-row__coins">
                        +{a.ecocoins_ganados}
                      </span>
                    )}

                    {a.estado_validacion === "pendiente" && (
                      <span className="ac-row__pending">
                        <Icon name="clock" size={14} /> Pendiente
                      </span>
                    )}

                    {a.estado_validacion === "rechazada" && (
                      <span className="ac-row__rechazada-tag">
                        <Icon name="x" size={14} /> Rechazada
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <AppFooter />
          </PageTransition>
        )}
      </main>
    </AppShell>
  );
}
