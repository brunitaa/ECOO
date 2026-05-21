import { useEffect, useRef, useState, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import PageHeader from "../components/PageHeader";

import { EcoPointIcon } from "@ecoo/ui";

import { AppShell, BottomNav } from "@ecoo/ui";

import ErrorBanner from "../components/ErrorBanner";

import {
  startQrScanner,
  destroyQrScanner,
  parseQrCodigo,
  hapticSuccess,
} from "../lib/qrScanner";

import "./ScanQR.css";

export default function ScanQR() {
  const navigate = useNavigate();

  const scannerRef = useRef(null);

  const navigatingRef = useRef(false);

  const mountedRef = useRef(true);

  const [phase, setPhase] = useState("starting");

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const stopScanner = useCallback(async () => {
    await destroyQrScanner(scannerRef);
  }, []);

  const goHome = useCallback(async () => {
    if (navigatingRef.current) return;

    navigatingRef.current = true;

    await stopScanner();

    navigate("/", { replace: true });
  }, [navigate, stopScanner]);

  const handleDecode = useCallback(
    async (decoded) => {
      if (navigatingRef.current || !mountedRef.current) return;

      const codigo = parseQrCodigo(decoded);

      if (!codigo) return;

      navigatingRef.current = true;

      hapticSuccess();

      setPhase("detected");

      setMessage(`QR detectado`);

      await stopScanner();

      window.setTimeout(() => {
        if (!mountedRef.current) return;

        navigate(`/punto/${encodeURIComponent(codigo)}`, {
          replace: true,

          state: { fromScan: true, returnTo: "/" },
        });
      }, 500);
    },

    [navigate, stopScanner],
  );

  useEffect(() => {
    mountedRef.current = true;

    navigatingRef.current = false;

    const elId = "ecoo-qr-reader";

    (async () => {
      try {
        setPhase("starting");

        setError("");

        const scanner = await startQrScanner({
          elementId: elId,

          onDecode: handleDecode,
        });

        if (!mountedRef.current) {
          await destroyQrScanner({ current: scanner });

          return;
        }

        scannerRef.current = scanner;

        setPhase("scanning");
      } catch (e) {
        if (mountedRef.current) {
          setError(e.message || "No se pudo acceder a la cámara");

          setPhase("error");
        }
      }
    })();

    return () => {
      mountedRef.current = false;

      destroyQrScanner(scannerRef);
    };
  }, [handleDecode]);

  return (
    <AppShell
      header={
        <PageHeader
          title="Escanear QR"
          subtitle="Punto ecológico de empresa afiliada"
          backLabel="Inicio"
          onBack={goHome}
          showLogo
        />
      }
      footer={<BottomNav />}
      className="scan-qr"
    >
      <main className="scan-qr__main">
        <ErrorBanner message={error} onClose={() => setError("")} />

        <div className="scan-qr__frame">
          <div
            id="ecoo-qr-reader"
            className={`scan-qr__viewport${phase === "detected" ? " scan-qr__viewport--ok" : ""}`}
          />

          {phase === "scanning" && (
            <div className="scan-qr__overlay" aria-hidden />
          )}
        </div>

        <div className="scan-qr__status">
          {phase === "starting" && <p>Iniciando cámara…</p>}

          {phase === "scanning" && (
            <>
              <span className="scan-qr__pulse" />

              <p>Centra el código QR en el marco</p>
            </>
          )}

          {phase === "detected" && (
            <>
              <EcoPointIcon size={48} />

              <p className="scan-qr__ok">{message}</p>

              <p>Abriendo formulario de reciclaje…</p>
            </>
          )}

          {phase === "error" && (
            <p className="scan-qr__hint">
              Permite el acceso a la cámara o ingresa manualmente desde un
              enlace de punto.
            </p>
          )}
        </div>
      </main>
    </AppShell>
  );
}
