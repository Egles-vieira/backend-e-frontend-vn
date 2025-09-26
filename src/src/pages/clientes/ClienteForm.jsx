// src/pages/clientes/ClienteForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Save, ArrowLeft } from 'lucide-react';
import FormField from '../../components/forms/FormField';
import InputMask from '../../components/forms/InputMask';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { clientesService } from '../../services/entities.service';
import toast from 'react-hot-toast';

const ClienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (isEdit) {
      loadCliente();
    }
  }, [id, isEdit]);

  const loadCliente = async () => {
    try {
      setLoading(true);
      const response = await clientesService.getById(id);
      
      if (response.success) {
        reset(response.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar cliente');
      navigate('/clientes');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      const response = isEdit 
        ? await clientesService.update(id, data)
        : await clientesService.create(data);
      
      if (response.success) {
        toast.success(`Cliente ${isEdit ? 'atualizado' : 'criado'} com sucesso`);
        navigate('/clientes');
      }
    } catch (error) {
      toast.error(error.message || `Erro ao ${isEdit ? 'atualizar' : 'criar'} cliente`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Carregando cliente..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/clientes')}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Atualize as informações do cliente' : 'Preencha os dados do novo cliente'}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Dados Básicos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Básicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Código do Cliente"
                name="cod_cliente"
                type="number"
                register={register}
                error={errors.cod_cliente}
                required
                placeholder="12345"
              />
              
              <InputMask
                label="CPF/CNPJ"
                name="documento"
                mask="cnpj"
                register={register}
                error={errors.documento}
                required
                placeholder="00.000.000/0000-00"
              />
              
              <div className="md:col-span-2">
                <FormField
                  label="Nome"
                  name="nome"
                  register={register}
                  error={errors.nome}
                  required
                  placeholder="Nome do cliente"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <FormField
                  label="Endereço"
                  name="endereco"
                  register={register}
                  error={errors.endereco}
                  placeholder="Rua, número"
                />
              </div>
              
              <FormField
                label="Bairro"
                name="bairro"
                register={register}
                error={errors.bairro}
                placeholder="Bairro"
              />
              
              <FormField
                label="Cidade"
                name="cidade"
                register={register}
                error={errors.cidade}
                placeholder="Cidade"
              />
              
              <FormField
                label="UF"
                name="uf"
                type="select"
                register={register}
                error={errors.uf}
                options={[
                  { value: 'AC', label: 'AC' }, { value: 'AL', label: 'AL' },
                  { value: 'AP', label: 'AP' }, { value: 'AM', label: 'AM' },
                  { value: 'BA', label: 'BA' }, { value: 'CE', label: 'CE' },
                  { value: 'DF', label: 'DF' }, { value: 'ES', label: 'ES' },
                  { value: 'GO', label: 'GO' }, { value: 'MA', label: 'MA' },
                  { value: 'MT', label: 'MT' }, { value: 'MS', label: 'MS' },
                  { value: 'MG', label: 'MG' }, { value: 'PA', label: 'PA' },
                  { value: 'PB', label: 'PB' }, { value: 'PR', label: 'PR' },
                  { value: 'PE', label: 'PE' }, { value: 'PI', label: 'PI' },
                  { value: 'RJ', label: 'RJ' }, { value: 'RN', label: 'RN' },
                  { value: 'RS', label: 'RS' }, { value: 'RO', label: 'RO' },
                  { value: 'RR', label: 'RR' }, { value: 'SC', label: 'SC' },
                  { value: 'SP', label: 'SP' }, { value: 'SE', label: 'SE' },
                  { value: 'TO', label: 'TO' }
                ]}
              />
              
              <InputMask
                label="CEP"
                name="cep"
                mask="cep"
                register={register}
                error={errors.cep}
                placeholder="00000-000"
              />
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputMask
                label="Telefone"
                name="contato"
                mask="phone"
                register={register}
                error={errors.contato}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/clientes')}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center px-4 py-2 bg-[#045c53] text-white rounded-lg hover:bg-[#034a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {submitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteForm;