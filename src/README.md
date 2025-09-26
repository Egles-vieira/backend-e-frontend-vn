# Road-RW Frontend

Frontend React + Vite para o sistema de gestão logística Road-RW.

## 🚀 Características

- **React 18** + **Vite** para desenvolvimento rápido
- **Tailwind CSS** para estilização profissional
- **React Router** para navegação
- **React Hook Form** para formulários performáticos
- **Axios** para requisições HTTP
- **JWT Authentication** com refresh automático
- **Seletor de Ambiente** dinâmico (dev/staging/prod)
- **Componentes reutilizáveis** e modulares
- **Design responsivo** e acessível

## 🎨 Paleta de Cores

- **Primary**: `#045c53` (Verde escuro)
- **Secondary**: `#e8f5ef` (Verde claro)
- **Accent**: `#aacb55` (Verde lima)
- **Success**: `#165d2b` (Verde)
- **Info**: `#7ab467` (Verde médio)
- **Warning**: `#84b472` (Verde oliva)
- **Neutral**: `#3c844c`, `#3e867f`, `#78a8a4`, `#599458`

## 📁 Estrutura do Projeto

```
src/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── common/        # Componentes comuns (Layout, DataTable, Modal)
│   │   ├── forms/         # Componentes de formulário
│   │   └── auth/          # Componentes de autenticação
│   ├── contexts/          # Contexts do React (Auth, Environment)
│   ├── pages/             # Páginas da aplicação
│   │   ├── auth/          # Páginas de autenticação
│   │   ├── clientes/      # CRUD de clientes
│   │   └── ...            # Outras entidades
│   ├── services/          # Serviços de API
│   ├── config/            # Configurações
│   ├── utils/             # Utilitários
│   └── hooks/             # Custom hooks
├── package.json
└── README.md
```

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Backend Road-RW rodando

### Instalação

```bash
# Navegar para a pasta do frontend
cd src

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🔧 Configuração

### Ambientes

O sistema suporta múltiplos ambientes configuráveis:

```javascript
// src/config/environments.js
export const environments = {
  development: {
    name: 'Desenvolvimento',
    baseURL: 'http://localhost:3001',
    apiPrefix: '/api'
  },
  production: {
    name: 'Produção', 
    baseURL: 'https://api.roadrw.com',
    apiPrefix: '/api'
  },
  staging: {
    name: 'Homologação',
    baseURL: 'https://staging-api.roadrw.com',
    apiPrefix: '/api'
  }
};
```

### Seletor de Ambiente

- **Localização**: Header da aplicação
- **Persistência**: localStorage (`app.env.selected`)
- **Atualização**: Automática do Axios baseURL
- **Indicador visual**: Cor e nome do ambiente

## 🔐 Autenticação

### Login
- Email + senha
- JWT token armazenado no localStorage
- Redirecionamento automático após login

### Proteção de Rotas
- `ProtectedRoute` component
- Verificação de token válido
- Redirecionamento para login se não autenticado

### Refresh Automático
- Interceptor do Axios para renovar token
- Logout automático em caso de token inválido

## 📊 Componentes Principais

### DataTable
- Paginação automática
- Ordenação por colunas
- Busca em tempo real
- Ações (ver, editar, excluir)
- Seleção múltipla
- Estados de loading

### FormField
- Validação integrada
- Tipos: text, email, password, select, textarea, checkbox
- Máscaras de input (CPF, CNPJ, CEP, telefone)
- Estados de erro

### AsyncSelect
- Busca assíncrona
- Debounce automático
- Seleção múltipla
- Loading states

### Modal
- Tamanhos configuráveis
- Fechamento por ESC ou overlay
- Animações suaves

## 🗂️ Entidades Implementadas

### ✅ Completo
- **Clientes**: CRUD completo com validações

### 🚧 Em Desenvolvimento
- **Transportadoras**: Estrutura base criada
- **Embarcadores**: Estrutura base criada  
- **Motoristas**: Estrutura base criada
- **Notas Fiscais**: Estrutura base criada
- **Romaneios**: Estrutura base criada
- **Códigos de Ocorrência**: Estrutura base criada
- **Endereços de Entrega**: Estrutura base criada
- **Jobs**: Estrutura base criada
- **Monitoramento**: Estrutura base criada

## 🔄 Padrão de Implementação

Para implementar CRUD completo para outras entidades, siga o padrão dos clientes:

### 1. Service (src/services/entities.service.js)
```javascript
class NovaEntidadeService extends BaseService {
  constructor() {
    super('/nova-entidade');
  }
  
  // Métodos específicos da entidade
}
```

### 2. Pages
- `NovaEntidadeList.jsx` - Listagem com filtros
- `NovaEntidadeForm.jsx` - Formulário create/edit  
- `NovaEntidadeDetail.jsx` - Visualização detalhada

### 3. Routes (src/App.jsx)
```javascript
<Route path="/nova-entidade" element={<NovaEntidadeList />} />
<Route path="/nova-entidade/new" element={<NovaEntidadeForm />} />
<Route path="/nova-entidade/:id" element={<NovaEntidadeDetail />} />
<Route path="/nova-entidade/:id/edit" element={<NovaEntidadeForm />} />
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Login com email/senha
- [x] Registro de usuário
- [x] Logout
- [x] Proteção de rotas
- [x] Refresh automático de token

### ✅ Navegação
- [x] Sidebar responsiva
- [x] Breadcrumbs
- [x] Menu de usuário
- [x] Seletor de ambiente

### ✅ Componentes Base
- [x] DataTable com paginação/ordenação/busca
- [x] Formulários com validação
- [x] Modais e dialogs
- [x] Loading states
- [x] Toast notifications
- [x] AsyncSelect para relacionamentos

### ✅ CRUD Clientes
- [x] Listagem com filtros
- [x] Criação de cliente
- [x] Edição de cliente
- [x] Visualização detalhada
- [x] Exclusão com confirmação
- [x] Validações (CPF/CNPJ, campos obrigatórios)
- [x] Máscaras de input

## 🚀 Próximos Passos

1. **Implementar CRUD completo** para todas as entidades seguindo o padrão dos clientes
2. **Adicionar validações específicas** para cada entidade
3. **Implementar relacionamentos** com AsyncSelect
4. **Adicionar filtros avançados** por entidade
5. **Implementar dashboard** com gráficos e métricas
6. **Adicionar exportação** de dados (CSV, PDF)
7. **Implementar notificações** em tempo real
8. **Adicionar testes** unitários e de integração

## 🐛 Troubleshooting

### Erro de CORS
Certifique-se que o backend está configurado para aceitar requisições do frontend:
```javascript
// Backend: cors configuration
origin: ['http://localhost:5173', 'http://localhost:3000']
```

### Token Expirado
O sistema faz logout automático quando o token expira. Verifique:
- Configuração JWT no backend
- Interceptors do Axios funcionando

### Ambiente não conecta
Verifique:
- URL do backend no seletor de ambiente
- Backend rodando na porta correta
- Firewall/proxy não bloqueando

## 📝 Contribuição

1. Siga o padrão de código estabelecido
2. Use os componentes reutilizáveis existentes
3. Implemente validações adequadas
4. Teste em diferentes ambientes
5. Documente mudanças significativas

## 📄 Licença

MIT License - veja LICENSE para detalhes.