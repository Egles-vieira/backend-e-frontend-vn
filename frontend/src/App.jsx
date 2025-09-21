// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// Importar serviços
import authService from './services/auth.service';
import { checkAPIHealth } from './services/api';

// Importar componentes de layout
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Importar páginas
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import TransportadorasPage from './pages/transportadoras/TransportadorasPage';
import ClientesPage from './pages/clientes/ClientesPage';
import EmbarcadoresPage from './pages/embarcadores/EmbarcadoresPage';
import MotoristasPage from './pages/motoristas/MotoristasPage';
import NotasFiscaisPage from './pages/notas-fiscais/NotasFiscaisPage';
import RomaneiosPage from './pages/romaneios/RomaneiosPage';
import OcorrenciasPage from './pages/ocorrencias/OcorrenciasPage';

// Componente para rotas protegidas
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Componente para verificar se já está logado
function PublicRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificar saúde da API
        const healthCheck = await checkAPIHealth();
        setApiStatus(healthCheck);
        
        // Verificar se há token válido - SEM tentar refresh automático
        if (authService.isAuthenticated()) {
          // Apenas verificar se o token existe, não tentar refresh
          console.log('Usuário autenticado encontrado');
        } else {
          console.log('Nenhum usuário autenticado');
        }
      } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
        setApiStatus({ status: 'ERROR', error: error.message });
        
        // Se houver erro de API, limpar dados de auth para forçar novo login
        authService.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Mostrar loading enquanto inicializa
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se API não estiver disponível
  if (apiStatus?.status === 'ERROR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Erro de Conexão!</strong>
            <span className="block sm:inline"> Não foi possível conectar com o servidor.</span>
          </div>
          <p className="text-gray-600 mb-4">
            Verifique se o backend está rodando na porta 3001.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rotas públicas */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />

          {/* Rotas protegidas */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Redirecionar / para /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Páginas principais */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="transportadoras" element={<TransportadorasPage />} />
            <Route path="clientes" element={<ClientesPage />} />
            <Route path="embarcadores" element={<EmbarcadoresPage />} />
            <Route path="motoristas" element={<MotoristasPage />} />
            <Route path="notas-fiscais" element={<NotasFiscaisPage />} />
            <Route path="romaneios" element={<RomaneiosPage />} />
            <Route path="ocorrencias" element={<OcorrenciasPage />} />
          </Route>

          {/* Rota catch-all para 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Página não encontrada</p>
                  <button 
                    onClick={() => window.history.back()} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>

        {/* Notificações */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;