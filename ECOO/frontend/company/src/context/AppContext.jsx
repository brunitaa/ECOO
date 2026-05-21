import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const DEMO_USER_ID = 1;
export const DEMO_ADMIN_ID = 1;

export function AppProvider({ children }) {
  const [userId] = useState(DEMO_USER_ID);
  const [adminId] = useState(DEMO_ADMIN_ID);
  const [saldo, setSaldo] = useState(null);
  const [impacto, setImpacto] = useState({ kg_reciclados: 0, co2_evitado: 0 });
  const [usuario, setUsuario] = useState(null);

  const updateSaldo = useCallback((data) => {
    if (data?.saldo != null) setSaldo(data.saldo);
    if (data?.impacto) setImpacto(data.impacto);
    if (data?.nombre) setUsuario((u) => ({ ...u, nombre: data.nombre }));
  }, []);

  return (
    <AppContext.Provider
      value={{ userId, adminId, saldo, impacto, usuario, setUsuario, setSaldo, setImpacto, updateSaldo }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp debe usarse dentro de AppProvider');
  return ctx;
}
