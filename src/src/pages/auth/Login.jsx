// src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEnvironment } from '../../contexts/EnvironmentContext';
import EnvironmentSelector from '../../components/common/EnvironmentSelector';
import FormField from '../../components/forms/FormField';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { environmentConfig } = useEnvironment();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      navigate(from, { replace: true });
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
            <h2 className="text-3xl font-bold text-gray-900">Road-RW</h2>
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
                  {...register('password', { required: 'Senha é obrigatória' })}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#045c53] hover:bg-[#034a42] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link 
                to="/register" 
                className="font-medium text-[#045c53] hover:text-[#034a42] transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;