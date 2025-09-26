// src/components/common/EnvironmentSelector.jsx
import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useEnvironment } from '../../contexts/EnvironmentContext';

const EnvironmentSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentEnvironment, environments, changeEnvironment, environmentConfig } = useEnvironment();

  const handleEnvironmentChange = (envKey) => {
    changeEnvironment(envKey);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-full"
      >
        <Globe className="h-4 w-4" style={{ color: environmentConfig.color }} />
        <span className="flex-1 text-left">{environmentConfig.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {Object.entries(environments).map(([key, env]) => (
              <button
                key={key}
                onClick={() => handleEnvironmentChange(key)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: env.color }}
                  />
                  <span>{env.name}</span>
                </div>
                {currentEnvironment === key && (
                  <Check className="h-4 w-4 text-[#045c53]" />
                )}
              </button>
            ))}
            
            <div className="border-t border-gray-200 mt-1 pt-1">
              <div className="px-3 py-2 text-xs text-gray-500">
                URL: {environmentConfig.baseURL}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EnvironmentSelector;