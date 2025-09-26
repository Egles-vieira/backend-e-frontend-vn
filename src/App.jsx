@@ .. @@
-import { useAuth } from './contexts/AuthContext';
-import { EnvironmentProvider } from './contexts/EnvironmentContext';
-import ProtectedRoute from './components/auth/ProtectedRoute';
-import Layout from './components/common/Layout';
+import { useAuth } from '../components/contexts/AuthContext';
+import { EnvironmentProvider } from '../components/contexts/EnvironmentContext';
+import ProtectedRoute from '../components/auth/ProtectedRoute';
+import Layout from '../components/common/Layout';

 // Auth Pages
-import Login from './pages/auth/Login';
-import Register from './pages/auth/Register';
+import Login from '../pages/auth/Login';
+import Register from '../pages/auth/Register';

 // Main Pages
-import Dashboard from './pages/Dashboard';
+import Dashboard from '../pages/Dashboard';

 // Clientes
-import ClientesList from './pages/clientes/ClientesList';
-import ClienteForm from './pages/clientes/ClienteForm';
-import ClienteDetail from './pages/clientes/ClienteDetail';
+import ClientesList from '../pages/clientes/ClientesList';
+import ClienteForm from '../pages/clientes/ClienteForm';
+import ClienteDetail from '../pages/clientes/ClienteDetail';