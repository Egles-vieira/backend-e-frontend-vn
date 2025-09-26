import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { EnvironmentProvider } from './contexts/EnvironmentContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import Dashboard from './pages/Dashboard';

// Clientes
import ClientesList from './pages/clientes/ClientesList';
import ClienteForm from './pages/clientes/ClienteForm';
import ClienteDetail from './pages/clientes/ClienteDetail';

// Placeholder pages for other entities
const PlaceholderPage = ({ title }) => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
    <p className="text-gray-600">Esta página está em desenvolvimento.</p>
    <p className="text-sm text-gray-500 mt-2">
      O CRUD completo será implementado seguindo o mesmo padrão dos clientes.
    </p>
  </div>
);

function App() {
  return (
    <EnvironmentProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* Clientes Routes */}
              <Route path="/clientes" element={
                <ProtectedRoute>
                  <Layout>
                    <ClientesList />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/clientes/new" element={
                <ProtectedRoute>
                  <Layout>
                    <ClienteForm />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/clientes/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <ClienteDetail />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/clientes/:id/edit" element={
                <ProtectedRoute>
                  <Layout>
                    <ClienteForm />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Placeholder Routes */}
              <Route path="/transportadoras" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Transportadoras" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/embarcadores" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Embarcadores" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/motoristas" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Motoristas" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/enderecos-entrega" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Endereços de Entrega" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/notas-fiscais" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Notas Fiscais" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/romaneios" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Romaneios" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/ocorrencias" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Códigos de Ocorrência" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/transportadora-codigo" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Vínculos Transportadora-Código" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/jobs" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Jobs de Integração" />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/monitoring" element={
                <ProtectedRoute>
                  <Layout>
                    <PlaceholderPage title="Monitoramento" />
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '14px'
                },
                success: {
                  iconTheme: {
                    primary: '#165d2b',
                    secondary: '#fff'
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#dc2626',
                    secondary: '#fff'
                  }
                }
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </EnvironmentProvider>
  );
}

export default App;