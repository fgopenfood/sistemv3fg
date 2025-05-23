import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import './styles/global.css'; // Importando os estilos globais

// Componentes
import Dashboard from './components/Dashboard';
import EventosGestao from './components/EventosGestao';
import Calendario from './components/Calendario';
import Precificador from './components/Precificador';
import Pagamentos from './components/Pagamentos';
import Relatorios from './components/Relatorios';
import Usuarios from './components/Usuarios';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Combos from './components/Combos'; // Novo componente para gestão de combos
import Brinquedos from './components/Brinquedos'; // Novo componente para gestão de brinquedos
import EstacoesComida from './components/EstacoesComida'; // Novo componente para estações de comida
import Checklist from './components/Checklist'; // Novo componente para checklist

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDtytAFpYlxyRKK7-FkVE1HlyzIgyNLfVo",
  authDomain: "sistema-fg.firebaseapp.com",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Marca d'água global com logo FG
  const Watermark = () => (
    <div className="watermark">
      <div className="watermark-image" style={{ backgroundImage: "url('/assets/FG.jpg')" }}></div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Watermark />
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Watermark />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="main-content">
          <Header user={user} onLogout={handleLogout} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/eventos" element={<EventosGestao />} />
              <Route path="/calendario" element={<Calendario />} />
              <Route path="/precificador" element={<Precificador />} />
              <Route path="/pagamentos" element={<Pagamentos />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/brinquedos" element={<Brinquedos />} />
              <Route path="/estacoes-comida" element={<EstacoesComida />} />
              <Route path="/combos" element={<Combos />} />
              <Route path="/checklist" element={<Checklist />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
