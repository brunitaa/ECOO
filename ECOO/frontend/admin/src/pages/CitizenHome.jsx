import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { api } from "../api/client";

import { useApp } from "../context/AppContext";

import { AppShell, BottomNav, Navbar, Icon } from "@ecoo/ui";

import Spinner from "../components/Spinner";

import ErrorBanner from "../components/ErrorBanner";

import "./CitizenHome.css";



const ICONS = {

  reciclaje: "recycle",

  transporte: "bike",

  compra_sostenible: "shopping",

};



export default function CitizenHome() {

  const { userId, saldo, impacto, usuario, setUsuario, updateSaldo } = useApp();

  const [acciones, setAcciones] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");



  useEffect(() => {

    async function load() {

      try {

        setLoading(true);

        const [saldoData, userData, accData] = await Promise.all([

          api.getSaldo(userId),

          api.getUsuario(userId),

          api.getAcciones(userId),

        ]);

        updateSaldo(saldoData);

        setUsuario(userData);

        setAcciones(accData);

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

          <>

            <div className="citizen-home__stats">

              <div className="stat-chip">

                <strong>{Number(impacto.kg_reciclados).toFixed(1)} kg</strong>

                <span>Residuos</span>

              </div>

              <div className="stat-chip">

                <strong>{Number(impacto.co2_evitado).toFixed(1)} kg</strong>

                <span>CO₂ evitado</span>

              </div>

            </div>



            <Link to="/escanear" className="citizen-home__cta">

              <Icon name="camera" size={18} /> Registrar acción ECO

            </Link>



            <div className="citizen-home__streak">

              <Icon name="sparkles" size={18} /> ¡Sigue sumando impacto con

              Ecoo!

            </div>



            <h2 className="citizen-home__section">Acciones recientes</h2>

            <ul className="citizen-home__list">

              {acciones.length === 0 && (

                <li className="citizen-home__empty">

                  Aún no tienes acciones. ¡Escanea un punto ecológico!

                </li>

              )}

              {acciones.map((a) => (

                <li

                  key={a.id_accion}

                  className={`ac-row ac-row--${a.estado_validacion}`}

                >

                  <span className="ac-row__icon">

                    <Icon

                      name={ICONS[a.tipo_accion_permitida] || "leaf"}

                      size={18}

                    />

                  </span>

                  <div>

                    <strong>{a.punto_nombre}</strong>

                    <small>

                      {new Date(a.fecha_registro).toLocaleString("es-BO")}

                    </small>

                  </div>

                  {a.estado_validacion === "aprobada" && (

                    <span className="ac-row__coins">+{a.ecocoins_ganados}</span>

                  )}

                  {a.estado_validacion === "pendiente" && (

                    <span className="ac-row__pending">Pendiente</span>

                  )}

                </li>

              ))}

            </ul>

          </>

        )}

      </main>

    </AppShell>

  );

}
