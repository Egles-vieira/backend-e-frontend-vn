// src/components/forms/InputMask.jsx
import React from 'react';

const InputMask = ({
  label,
  name,
  mask,
  register,
  error,
  required = false,
  placeholder = '',
  disabled = false,
  className = ''
}) => {
  const applyMask = (value, maskPattern) => {
    if (!value || !maskPattern) return value;
    
    const cleanValue = value.replace(/\D/g, '');
    let maskedValue = '';
    let valueIndex = 0;
    
    for (let i = 0; i < maskPattern.length && valueIndex < cleanValue.length; i++) {
      if (maskPattern[i] === '#') {
        maskedValue += cleanValue[valueIndex];
        valueIndex++;
      } else {
        maskedValue += maskPattern[i];
      }
    }
    
    return maskedValue;
  };

  const handleChange = (e) => {
    const maskedValue = applyMask(e.target.value, mask);
    e.target.value = maskedValue;
  };

  const masks = {
    cpf: '###.###.###-##',
    cnpj: '##.###.###/####-##',
    cep: '#####-###',
    phone: '(##) #####-####',
    date: '##/##/####'
  };

  const maskPattern = masks[mask] || mask;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        type="text"
        {...register(name, { required: required && `${label} é obrigatório` })}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleChange}
        className={`
          w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#045c53] focus:border-transparent transition-colors
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${className}
        `}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default InputMask;