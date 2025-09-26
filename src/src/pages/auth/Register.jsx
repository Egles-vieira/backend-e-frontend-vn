// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEnvironment } from '../../contexts/EnvironmentContext';
import EnvironmentSelector from '../../components/common/EnvironmentSelector';
import FormField from '../../components/forms/FormField';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const { environmentConfig } = useEnvironment();
  const navigate = useNavigate();
  
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser(data);
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f5ef] to-[#aacb55]">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4"
              style={{ backgroundColor: '#045c53' }}
            >
              R
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Criar Conta</h2>
            <p className="text-gray-600 mt-2">Sistema de Gestão Logística</p>
          </div>

          {/* Seletor de Ambiente */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Ambiente:</span>
              <EnvironmentSelector />
            </div>
            <div className="text-xs text-gray-500 text-center">
              Conectando em: {environmentConfig.baseURL}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              label="Nome"
              name="name"
              register={register}
              error={errors.name}
              required
              placeholder="Seu nome completo"
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              required
              placeholder="seu@email.com"
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Senha é obrigatória',
                    minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' }
                  })}
                  placeholder="Sua senha"
                  className={`
                    w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#045c53] focus:border-transparent transition-colors
                    ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Confirmar Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('password_confirmation', { 
                    required: 'Confirmação de senha é obrigatória',
                    validate: value => value === password || 'As senhas não coincidem'
                  })}
                  placeholder="Confirme sua senha"
                  className={`
                    w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#045c53] focus:border-transparent transition-colors
                    ${errors.password_confirmation ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-sm text-red-600">{errors.password_confirmation.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#045c53] hover:bg-[#034a42] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link 
                to="/login" 
                className="font-medium text-[#045c53] hover:text-[#034a42] transition-colors"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;