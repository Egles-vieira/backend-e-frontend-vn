// src/components/common/RoleGuard.jsx
import authService from '../../services/auth.service';

function RoleGuard({ 
  children, 
  roles = [], 
  permissions = [], 
  fallback = null,
  requireAll = false 
}) {
  const hasAccess = () => {
    // Se não há restrições, permitir acesso
    if (roles.length === 0 && permissions.length === 0) {
      return true;
    }

    // Verificar roles
    const hasRole = roles.length === 0 || (
      requireAll 
        ? roles.every(role => authService.hasRole(role))
        : roles.some(role => authService.hasRole(role))
    );

    // Verificar permissões
    const hasPermission = permissions.length === 0 || (
      requireAll
        ? permissions.every(permission => authService.hasPermission(permission))
        : permissions.some(permission => authService.hasPermission(permission))
    );

    return hasRole && hasPermission;
  };

  if (!hasAccess()) {
    return fallback;
  }

  return children;
}

export default RoleGuard;