// src/components/common/ActionButton.jsx
import Button from './Button';
import RoleGuard from './RoleGuard';

function ActionButton({ 
  children, 
  roles = [], 
  permissions = [], 
  requireAll = false,
  ...buttonProps 
}) {
  return (
    <RoleGuard 
      roles={roles} 
      permissions={permissions} 
      requireAll={requireAll}
      fallback={null}
    >
      <Button {...buttonProps}>
        {children}
      </Button>
    </RoleGuard>
  );
}

export default ActionButton;