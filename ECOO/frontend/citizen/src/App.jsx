import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ProtectedApp from './components/ProtectedApp';
import GuestRoute from './components/GuestRoute';
import CitizenHome from './pages/CitizenHome';
import CitizenRewards from './pages/CitizenRewards';
import PuntoFlow from './pages/PuntoFlow';
import ScanQR from './pages/ScanQR';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/AuthCallback';

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedApp>
                <Routes>
                  <Route index element={<CitizenHome />} />
                  <Route path="premios" element={<CitizenRewards />} />
                  <Route path="escanear" element={<ScanQR />} />
                  <Route path="punto/:qrCodigo" element={<PuntoFlow />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ProtectedApp>
            }
          />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
