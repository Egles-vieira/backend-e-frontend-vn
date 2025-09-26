// src/components/common/Layout.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Home, Users, Truck, Package, FileText, 
  MapPin, Settings, BarChart3, LogOut, User, Bell,
  ChevronDown, Building2, UserCheck, Route
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import EnvironmentSelector from './EnvironmentSelector';
import toast from 'react-hot-toast';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { 
      name: 'Cadastros', 
      icon: Users,
      children: [
        { name: 'Clientes', href: '/clientes', icon: Users },
        { name: 'Transportadoras', href: '/transportadoras', icon: Truck },
        { name: 'Embarcadores', href: '/embarcadores', icon: Building2 },
        { name: 'Motoristas', href: '/motoristas', icon: UserCheck },
        { name: 'Endereços de Entrega', href: '/enderecos-entrega', icon: MapPin }
      ]
    },
    {
      name: 'Operacional',
      icon: Package,
      children: [
        { name: 'Notas Fiscais', href: '/notas-fiscais', icon: FileText },
        { name: 'Romaneios', href: '/romaneios', icon: Route },
        { name: 'Códigos de Ocorrência', href: '/ocorrencias', icon: Settings }
      ]
    },
    {
      name: 'Integrações',
      icon: Settings,
      children: [
        { name: 'Jobs', href: '/jobs', icon: Settings },
        { name: 'Monitoramento', href: '/monitoring', icon: BarChart3 },
        { name: 'Vínculos Transportadora', href: '/transportadora-codigo', icon: Settings }
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const isActiveRoute = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const NavItem = ({ item, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(
      item.children?.some(child => isActiveRoute(child.href)) || false
    );

    if (item.children) {
      return (
        <div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${isOpen || item.children.some(child => isActiveRoute(child.href))
                ? 'bg-[#e8f5ef] text-[#045c53]' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#045c53]'
              }
            `}
          >
            <div className="flex items-center">
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </div>
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          {isOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => (
                <NavItem key={child.href} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to={item.href}
        className={`
          flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors
          ${isActiveRoute(item.href)
            ? 'bg-[#045c53] text-white' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-[#045c53]'
          }
          ${level > 0 ? 'ml-4' : ''}
        `}
        onClick={() => setSidebarOpen(false)}
      >
        <item.icon className="mr-3 h-5 w-5" />
        {item.name}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3"
                style={{ backgroundColor: '#045c53' }}
              >
                R
              </div>
              <span className="text-xl font-bold text-gray-900">Road-RW</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Environment Selector */}
          <div className="p-4 border-t border-gray-200">
            <EnvironmentSelector />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 lg:ml-0 text-2xl font-semibold text-gray-900">
                Road-RW
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#045c53] rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;