import { useEffect, useState, useCallback } from "react";

import { useParams, useNavigate, Link, useLocation } from "react-router-dom";

import PageHeader from "../components/PageHeader";

import { api } from "../api/client";

import { useApp } from "../context/AppContext";

import { AppShell, BottomNav } from "@ecoo/ui";

import Spinner from "../components/Spinner";

import ErrorBanner from "../components/ErrorBanner";

import { BrandLogo, EcoPointIcon, AppFooter } from "@ecoo/ui";
import PointsEstimate from "../components/PointsEstimate";

import "./PuntoFlow.css";

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function PuntoFlow() {
  const { qrCodigo } = useParams();

  const { userId } = useApp();

  const navigate = useNavigate();

  const location = useLocation();

  const returnTo = location.state?.returnTo || "/";

  const [punto, setPunto] = useState(null);

  const [cantidad, setCantidad] = useState("");

  const [estimate, setEstimate] = useState(null);

  const [estLoading, setEstLoading] = useState(false);

  const [foto, setFoto] = useState(null);

  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const data = await api.getPunto(qrCodigo);

        setPunto(data);

        setCantidad(String(data.formulario?.min_cantidad ?? 1));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    if (qrCodigo) load();
  }, [qrCodigo]);

  const refreshEstimate = useCallback(async () => {
    if (!qrCodigo || !cantidad) return;

    try {
      setEstLoading(true);

      const est = await api.estimarPunto(qrCodigo, Number(cantidad));

      setEstimate(est);
    } catch {
      setEstimate(null);
    } finally {
      setEstLoading(false);
    }
  }, [qrCodigo, cantidad]);

  useEffect(() => {
    const t = setTimeout(refreshEstimate, 300);

    return () => clearTimeout(t);
  }, [refreshEstimate]);

  const onPhoto = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFoto(file);

    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!foto) {
      setError("Debes tomar una foto de evidencia con tu cámara");

      return;
    }

    try {
      setSubmitting(true);

      setError("");

      const fotoUrl = await readFileAsDataUrl(foto);

      const res = await api.registrarAccion({
        id_usuario: userId,

        qr_codigo: qrCodigo,

        cantidad_declarada: Number(cantidad),

        foto_url: fotoUrl,
      });

      setSuccess(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-shell brand-splash">
        <BrandLogo className="brand-splash__logo" height={56} />

        <EcoPointIcon size={72} className="brand-splash__point" />

        <Spinner label="Cargando punto ecológico…" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="app-shell punto-success-wrap">
        <div className="punto-success">
          <EcoPointIcon size={64} />

          <h1>¡Solicitud enviada!</h1>

          <p>{success.mensaje}</p>

          <p className="punto-success__detail">
            {success.accion?.respuesta_resumen}
          </p>

          <p className="punto-success__ec">
            Total estimado:{" "}
            <strong>
              {success.recompensa?.ecocoins_estimados ??
                success.ecocoins_estimados}{" "}
              ECOO POINTS
            </strong>
          </p>

          <p className="punto-success__pending">
            Pendiente de aprobación por Ecoo
          </p>

          <button type="button" onClick={() => navigate("/")}>
            Ir a mi inicio
          </button>
        </div>
      </div>
    );
  }

  if (!punto) {
    return (
      <div className="app-shell page">
        <ErrorBanner message={error || "Punto no encontrado"} />

        <Link to="/escanear" className="punto-back">
          Escanear otro QR
        </Link>
      </div>
    );
  }

  const form = punto.formulario;

  const step = form?.pregunta_tipo === "kilogramos" ? "0.1" : "1";

  const ptsUnit =
    punto.recompensa?.puntos_por_unidad ?? estimate?.puntos_por_unidad;

  return (
    <AppShell footer={<BottomNav />}>
      <PageHeader
        title={punto.nombre}
        subtitle={
          punto.empresa_nombre ? `Afiliado: ${punto.empresa_nombre}` : undefined
        }
        backLabel="Volver"
        backTo={returnTo}
      />

      <div className="punto-hdr punto-hdr--compact">
        <span className="punto-hdr__badge">Punto Ecológico</span>

        {punto.nombre_campana && (
          <p className="punto-hdr__campana">{punto.nombre_campana}</p>
        )}

        {ptsUnit != null && (
          <p className="punto-hdr__rate">
            <EcoPointIcon size={22} /> {ptsUnit} ECOO POINTS por{" "}
            {punto.recompensa?.unidad || form.unidad}
          </p>
        )}
      </div>

      <main className="page punto-flow">
        <ErrorBanner message={error} onClose={() => setError("")} />

        <form onSubmit={submit} className="punto-form">
          <label className="punto-form__question">
            {form.pregunta_label}

            <input
              type="number"
              min={form.min_cantidad}
              max={form.max_cantidad ?? undefined}
              step={step}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              required
            />

            {form.unidad && (
              <span className="punto-form__unit">Unidad: {form.unidad}</span>
            )}
          </label>

          <PointsEstimate
            loading={estLoading}
            cantidad={Number(cantidad)}
            puntosPorUnidad={estimate?.puntos_por_unidad ?? ptsUnit}
            total={estimate?.ecocoins_estimados}
            unidad={estimate?.unidad || form.unidad}
          />

          <label className="punto-form__photo">
            <span>Foto de evidencia (obligatoria)</span>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={onPhoto}
              required
            />

            <span className="punto-form__photo-hint">
              Usa la cámara de tu celular en el momento
            </span>
          </label>

          {preview && (
            <img
              src={preview}
              alt="Evidencia"
              className="punto-form__preview"
            />
          )}

          {submitting ? (
            <Spinner label="Enviando solicitud…" />
          ) : (
            <button type="submit" className="punto-form__submit">
              <EcoPointIcon size={22} /> Enviar para aprobación
            </button>
          )}
        </form>

        <AppFooter />
      </main>
    </AppShell>
  );
}
