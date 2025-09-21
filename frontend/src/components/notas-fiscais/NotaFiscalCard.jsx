import StatusBadge from './StatusBadge';

function NotaFiscalCard({ nota, onView, onEdit, onFinalizar, clientes = [], transportadoras = [] }) {
  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatWeight = (weight) => {
    if (!weight) return '-';
    return `${weight.toFixed(2)} kg`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calcularDiasAtraso = (previsaoEntrega, dataEntrega = null) => {
    if (!previsaoEntrega) return 0;
    const previsao = new Date(previsaoEntrega);
    const entrega = dataEntrega ? new Date(dataEntrega) : new Date();
    
    if (entrega <= previsao) return 0;
    
    const diffTime = entrega.getTime() - previsao.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getClienteName = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : `Cliente ${clienteId}`;
  };

  const getTransportadoraName = (transportadoraId) => {
    const transportadora = transportadoras.find(t => t.id === transportadoraId);
    return transportadora ? transportadora.nome : `Transportadora ${transportadoraId}`;
  };

  const diasAtraso = nota.previsao_entrega ? 
    calcularDiasAtraso(nota.previsao_entrega, nota.data_entrega) : 0;

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            NF {nota.nro || 'S/N'}
            {nota.ser && <span className="text-sm text-gray-500 ml-2">Série {nota.ser}</span>}
          </h3>
          <p className="text-sm text-gray-600">
            {getClienteName(nota.cliente_id)}
          </p>
        </div>
        
        <StatusBadge status={nota.status_nf} finalizada={nota.finalizada} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <dt className="text-sm font-medium text-gray-500">Transportadora</dt>
          <dd className="text-sm text-gray-900">{getTransportadoraName(nota.transportadora_id)}</dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-gray-500">Valor</dt>
          <dd className="text-sm text-gray-900 font-medium">
            {formatCurrency(nota.valor)}
          </dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-gray-500">Peso</dt>
          <dd className="text-sm text-gray-900">
            {formatWeight(nota.peso_calculo)}
          </dd>
        </div>
        
        <div>
          <dt className="text-sm font-medium text-gray-500">Previsão</dt>
          <dd className="text-sm text-gray-900">
            {formatDate(nota.previsao_entrega)}
          </dd>
        </div>
      </div>
      
      {diasAtraso > 0 && !nota.finalizada && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Entrega em atraso
              </h3>
              <div className="text-sm text-red-700">
                {diasAtraso} dia(s) de atraso
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => onView(nota)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Visualizar
        </button>
        
        <button
          onClick={() => onEdit(nota)}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Editar
        </button>
        
        {!nota.finalizada && (
          <button
            onClick={() => onFinalizar(nota)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
}

export default NotaFiscalCard;