// src/components/common/EnvironmentConfigButton.jsx
import { useState } from 'react';
import EnvironmentConfigModal from './EnvironmentConfigModal';
import { getEnvironmentConfig } from '../../services/api';

function EnvironmentConfigButton({ className = '', position = 'fixed' }) {
  const [showModal, setShowModal] = useState(false);
  const config = getEnvironmentConfig();

  const getEnvironmentIcon = () => {
    switch (config.ENVIRONMENT) {
      case 'development':
        return '🔧';
      case 'staging':
        return '🧪';
      case 'production':
        return '🚀';
      default:
        return '⚙️';
    }
  };

  const getEnvironmentColor = () => {
    switch (config.ENVIRONMENT) {
      case 'development':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'staging':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'production':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const buttonClasses = position === 'fixed' 
    ? `fixed bottom-4 right-4 z-[9990] ${getEnvironmentColor()} text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`
    : `inline-flex items-center ${getEnvironmentColor()} text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${className}`;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={buttonClasses}
        title={`Configurar Ambiente (${config.ENVIRONMENT})`}
      >
        <span className="text-lg">{getEnvironmentIcon()}</span>
        {position !== 'fixed' && (
          <span className="ml-2 capitalize">{config.ENVIRONMENT}</span>
        )}
      </button>

      {/* Portal para o modal para garantir z-index correto */}
      {showModal && (
        <div className="fixed inset-0 z-[9999]">
          <EnvironmentConfigModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
          />
        </div>
      )}
    </>
  );
}

export default EnvironmentConfigButton;