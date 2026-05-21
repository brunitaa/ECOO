import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import RewardCard from '../components/RewardCard';
import QRModal from '../components/QRModal';
import Spinner from '../components/Spinner';
import ErrorBanner from '../components/ErrorBanner';
import './CitizenRewards.css';

const ICONS = {
  'Café gratis': '☕',
  '20% off eco tienda': '🛍️',
  'Día de gym gratis': '🏃',
};

export default function CitizenRewards() {
  const { userId, saldo, usuario, updateSaldo } = useApp();
  const [recompensas, setRecompensas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canjeando, setCanjeando] = useState(null);
  const [error, setError] = useState('');
  const [qr, setQr] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const [list, saldoData] = await Promise.all([
        api.getRecompensas(),
        api.getSaldo(userId),
      ]);
      setRecompensas(
        list.map((r, i) => ({
          ...r,
          icono: ICONS[r.titulo] || '🎁',
          destacado: i === 1,
        }))
      );
      updateSaldo(saldoData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  const handleCanjear = async (rec) => {
    try {
      setCanjeando(rec.id_recompensa);
      setError('');
      const res = await api.canjear({ id_usuario: userId, id_recompensa: rec.id_recompensa });
      updateSaldo({ saldo: res.saldo_restante });
      setQr({
        codigo: res.cupon.codigo_unico,
        titulo: res.recompensa.titulo,
      });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setCanjeando(null);
    }
  };

  return (
    <div className="app-shell">
      <Navbar nombre={usuario?.nombre} saldo={saldo} compact />
      <main className="page citizen-rewards">
        <ErrorBanner message={error} onClose={() => setError('')} />
        <h2 className="citizen-rewards__title">Catálogo de premios</h2>

        {loading ? (
          <Spinner />
        ) : (
          <div className="citizen-rewards__list">
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
