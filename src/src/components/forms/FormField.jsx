// src/components/forms/FormField.jsx
import React from 'react';

const FormField = ({
  label,
  name,
  type = 'text',
  register,
  error,
  required = false,
  placeholder = '',
  options = [],
  rows = 3,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseInputClass = `
    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#045c53] focus:border-transparent transition-colors
    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${className}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...register(name, { required: required && `${label} é obrigatório` })}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            className={baseInputClass}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            {...register(name, { required: required && `${label} é obrigatório` })}
            disabled={disabled}
            className={baseInputClass}
            {...props}
          >
            <option value="">Selecione...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register(name)}
              disabled={disabled}
              className="h-4 w-4 text-[#045c53] focus:ring-[#045c53] border-gray-300 rounded"
              {...props}
            />
            <label className="ml-2 text-sm text-gray-700">
              {label}
            </label>
          </div>
        );

      default:
        return (
          <input
            type={type}
            {...register(name, { required: required && `${label} é obrigatório` })}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClass}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="space-y-1">
        {renderInput()}
        {error && (
          <p className="text-sm text-red-600">{error.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default FormField;