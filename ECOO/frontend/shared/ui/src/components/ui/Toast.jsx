import { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '../icons/Icon.jsx';
import './Toast.css';

const ToastContext = createContext(null);

const ICON_BY_TYPE = {
  success: 'check',
  error: 'alert',
  info: 'info',
  warning: 'alert',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback((message, opts = {}) => {
    const id = crypto.randomUUID();
    const type = opts.type || 'info';
    const duration = opts.duration ?? 4200;
    setToasts((t) => [...t, { id, message, type, action: opts.action }]);
    if (duration > 0) {
      window.setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <motion.div className="ec-toast-host" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`ec-toast ec-toast--${t.type}`}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24 }}
              layout
            >
              <Icon name={ICON_BY_TYPE[t.type] || 'info'} size={18} />
              <div className="ec-toast__content">
                <p>{t.message}</p>
                {t.action && <small>{t.action}</small>}
              </div>
              <button type="button" className="ec-toast__close" onClick={() => dismiss(t.id)} aria-label="Cerrar">
                <Icon name="x" size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}