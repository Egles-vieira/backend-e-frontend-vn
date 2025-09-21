import notasFiscaisService from '../../services/notas-fiscais.service';

function StatusBadge({ status, finalizada = false, className = '' }) {
  const getStatusColor = (status) => {
    const colors = {
      'pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'em_transito': 'bg-blue-100 text-blue-800 border-blue-200',
      'entregue': 'bg-green-100 text-green-800 border-green-200',
      'devolvida': 'bg-red-100 text-red-800 border-red-200',
      'cancelada': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pendente': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      'em_transito': 'M13 10V3L4 14h7v7l9-11h-7z',
      'entregue': 'M5 13l4 4L19 7',
      'devolvida': 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
      'cancelada': 'M6 18L18 6M6 6l12 12'
    };
    return icons[status] || 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  };
  
  const statusColor = getStatusColor(status);
  const statusIcon = getStatusIcon(status);
  
  const displayStatus = status || 'pendente';
  const statusText = {
    'pendente': 'Pendente',
    'em_transito': 'Em Trânsito',
    'entregue': 'Entregue',
    'devolvida': 'Devolvida',
    'cancelada': 'Cancelada'
  }[displayStatus] || 'Pendente';

  return (
    <div className={`inline-flex items-center ${className}`}>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor}`}>
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={statusIcon} />
        </svg>
        {statusText}
      </span>
      
      {finalizada && (
        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Finalizada
        </span>
      )}
    </div>
  );
}

export default StatusBadge;