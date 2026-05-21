import { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children, session }) {
  const userId = session.user?.id_usuario;
  const [saldo, setSaldo] = useState(null);
  const [impacto, setImpacto] = useState({ kg_reciclados: 0, co2_evitado: 0 });
  const [usuario, setUsuario] = useState(session.user);

  const updateSaldo = useCallback((data) => {
    if (data?.saldo != null) setSaldo(data.saldo);
    if (data?.impacto) setImpacto(data.impacto);
    if (data?.nombre) setUsuario((u) => ({ ...u, nombre: data.nombre }));
  }, []);

  return (
    <AppContext.Provider
      value={{ userId, saldo, impacto, usuario, setUsuario, setSaldo, setImpacto, updateSaldo, session }}
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
