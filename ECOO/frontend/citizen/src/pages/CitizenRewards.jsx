import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import RewardCard from '../components/RewardCard';
import QRModal from '../components/QRModal';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import PageTransition from '@ecoo/ui/motion/PageTransition';
import './CitizenRewards.css';

const REWARD_ICONS = {
  'Café gratis': 'gift',
  '20% off eco tienda': 'shopping',
  'Día de gym gratis': 'zap',
};

export default function CitizenRewards() {
  const { userId, saldo, usuario, updateSaldo } = useApp();
  const [recompensas, setRecompensas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canjeando, setCanjeando] = useState(null);
  const [error, setError] = useState('');
  const [qr, setQr] = useState(null);

  // Evitamos peticiones infinitas cuando cambie el estado de la app global
  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const [list, saldoData] = await Promise.all([
        api.getRecompensas(),
        api.getSaldo(userId),
      ]);
      setRecompensas(
        list.map((r, i) => ({
          ...r,
          iconName: REWARD_ICONS[r.titulo] || 'gift',
          destacado: i === 1,
        }))
      );
      updateSaldo(saldoData);
    } catch (e) {
      setError(e.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [userId, updateSaldo]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCanjear = async (rec) => {
    try {
      setCanjeando(rec.id_recompensa);
      setError('');
      const res = await api.canjear({ id_usuario: userId, id_recompensa: rec.id_recompensa });
      
      if (res && res.cupon) {
        updateSaldo({ saldo: res.saldo_restante });
        setQr({
          codigo: res.cupon.codigo_unico,
          titulo: res.recompensa?.titulo || rec.titulo,
        });
        await load();
      }
    } catch (e) {
      setError(e.message || 'No se pudo procesar el canje');
    } finally {
      setCanjeando(null);
    }
  };

  return (
    <div className="app-shell">
      <Navbar nombre={usuario?.nombre} saldo={saldo} compact />
      
      <main className="page-content">
        <PageTransition className="citizen-rewards-transition">
          <div className="citizen-rewards">
            <ErrorBanner message={error} onClose={() => setError('')} />
            
            <h2 className="citizen-rewards__title">Catálogo de premios</h2>

            {loading ? (
              <div className="citizen-rewards__loader">
                <Spinner label="Cargando premios…" />
              </div>
            ) : (
              <div className="citizen-rewards__grid">
                {recompensas.map((r) => (
                  <RewardCard
                    key={r.id_recompensa}
                    recompensa={r}
                    saldo={saldo ?? 0}
                    loading={canjeando === r.id_recompensa}
                    onCanjear={handleCanjear}
                  />
                ))}
              </div>
            )}
          </div>
        </PageTransition>
      </main>

      <BottomNav />

      <QRModal
        open={!!qr}
        codigo={qr?.codigo}
        titulo={qr?.titulo}
        onClose={() => setQr(null)}
      />
    </div>
  );
}
