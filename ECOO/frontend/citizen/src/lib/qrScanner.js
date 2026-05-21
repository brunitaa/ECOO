import { Html5Qrcode } from 'html5-qrcode';

/** Detiene tracks de cámara huérfanos en el documento */
export function stopAllCameraTracks() {
  document.querySelectorAll('video').forEach((video) => {
    const stream = video.srcObject;
    if (stream && typeof stream.getTracks === 'function') {
      stream.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          /* ignore */
        }
      });
    }
    video.srcObject = null;
  });
}

/**
 * Detiene y destruye una instancia Html5Qrcode de forma segura.
 * @param {React.MutableRefObject<Html5Qrcode|null>} ref
 */
export async function destroyQrScanner(ref) {
  const scanner = ref?.current;
  if (!scanner) return;
  ref.current = null;
  try {
    const state = scanner.getState?.();
    if (state === 2 /* SCANNING */) {
      await scanner.stop();
    }
  } catch {
    /* ya detenido */
  }
  try {
    await scanner.clear();
  } catch {
    /* ignore */
  }
  stopAllCameraTracks();
}

/**
 * Inicia el escáner; devuelve función cleanup.
 */
export async function startQrScanner({ elementId, onDecode, onError }) {
  const cameras = await Html5Qrcode.getCameras();
  if (!cameras?.length) {
    throw new Error('No se detectó cámara en este dispositivo');
  }
  const back =
    cameras.find((c) => /back|rear|environment/i.test(c.label || '')) ||
    cameras[cameras.length - 1];

  const scanner = new Html5Qrcode(elementId);
  let handled = false;

  await scanner.start(
    back.id,
    { fps: 10, qrbox: { width: 260, height: 260 }, aspectRatio: 1 },
    (decoded) => {
      if (handled) return;
      handled = true;
      onDecode(decoded);
    },
    () => {}
  );

  return scanner;
}

export function parseQrCodigo(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  try {
    const url = new URL(text);
    const parts = url.pathname.split('/').filter(Boolean);
    const i = parts.indexOf('punto');
    if (i >= 0 && parts[i + 1]) return decodeURIComponent(parts[i + 1]);
    return decodeURIComponent(parts[parts.length - 1] || '');
  } catch {
    const m = text.match(/\/punto\/([^/?#]+)/i);
    if (m) return decodeURIComponent(m[1]);
    return text.split(/[?#]/)[0] || null;
  }
}

export function hapticSuccess() {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([40, 30, 40]);
  }
}