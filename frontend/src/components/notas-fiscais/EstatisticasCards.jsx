// src/components/notas-fiscais/EstatisticasCards.jsx
function EstatisticasCards({ stats = {}, loading = false }) {
  const cards = [
    {
      title: 'Total',
      value: stats.total || 0,
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      color: 'text-gray-400',
      bgColor: 'bg-white'
    },
    {
      title: 'Finalizadas',
      value: stats.finalizadas || 0,
      icon: 'M5 13l4 4L19 7',
      color: 'text-green-400',
      bgColor: 'bg-white'
    },
    {
      title: 'Pendentes',
      value: stats.pendentes || 0,
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-yellow-400',
      bgColor: 'bg-white'
    },
    {
      title: 'Em Trânsito',
      value: stats.em_transito || 0,
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'text-blue-400',
      bgColor: 'bg-white'
    },
    {
      title: 'Entregues',
      value: stats.entregues || 0,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: 'text-green-400',
      bgColor: 'bg-white'
    },
    {
      title: 'Com Atraso',
      value: stats.com_atraso || 0,
      icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z',
      color: 'text-red-400',
      bgColor: 'bg-white'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-8"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow`}>
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className={`h-6 w-6 ${card.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.title}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {card.value.toLocaleString('pt-BR')}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EstatisticasCards;