# ⚖️ Aplicativo Legal — Painel de Serviço

Aplicação web full stack desenvolvida como parte do processo seletivo para a posição de Desenvolvedor Full Stack Júnior na Resende Mori Hutchison Advocacia.

O sistema possibilita visualizar, pesquisar, filtrar e exportar compromissos e serviços jurídicos através de um painel administrativo moderno e responsivo.

---

## 🚀 Como executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)
- npm (vem com o Node.js)

> **Atenção para usuários Windows:** se for a primeira vez usando npm no computador, pode ser necessário autorizar a execução de scripts no PowerShell. Abra o PowerShell como administrador e execute:
> ```
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

---

### Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Inicie o servidor em modo de desenvolvimento
npm run dev
```

O servidor estará rodando em: **http://localhost:3001**

---

### Frontend

Em um novo terminal:

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/agendamentos` | Lista agendamentos com filtros e paginação |
| GET | `/api/agendamentos/metricas` | Retorna métricas do painel |
| GET | `/api/agendamentos/exportar` | Exporta dados filtrados em CSV |

### Parâmetros disponíveis em `/api/agendamentos`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `search` | string | Pesquisa por cliente, advogado, CPF ou organização |
| `status` | string | Filtra por status (ex.: `Válido`) |
| `tipo` | string | Filtra por tipo (ex.: `Online`, `Presencial`) |
| `realizado` | string | Filtra por situação (ex.: `Sim`, `Não`) |
| `page` | number | Página atual (padrão: 1) |
| `limit` | number | Registros por página (padrão: 20) |

---

## 📦 Dependências

### Backend

| Dependência | Versão | Justificativa |
|-------------|--------|---------------|
| `express` | ^4.18.2 | Framework web para construir a API REST |
| `cors` | ^2.8.5 | Permite requisições cross-origin do frontend em React |
| `nodemon` | ^3.0.1 | Reinicia automaticamente o servidor em desenvolvimento |

### Frontend

| Dependência | Versão | Justificativa |
|-------------|--------|---------------|
| `react` | ^19.0.0 | Biblioteca principal para construir a interface |
| `axios` | — | Cliente HTTP para consumir a API REST |
| `recharts` | — | Biblioteca de gráficos para React (pizza e linha) |
| `jspdf` | — | Geração de arquivos PDF no navegador |
| `jspdf-autotable` | — | Plugin para gerar tabelas formatadas em PDF |

---

## 🏗️ Decisões Técnicas

### Backend

**Arquivo JSON como banco de dados:** conforme especificado, os dados são lidos diretamente do arquivo `agendamentos.json` sem usar um banco de dados real. A função `loadData()` lê e mapeia os campos a cada requisição.

**Organização em camadas:** o projeto segue a estrutura `routes/` → `controllers/` → `data/`, separando responsabilidades e facilitando a manutenção.

**Tratamento de erros HTTP:** a API retorna status apropriados — `400` para parâmetros inválidos, `404` para rotas inexistentes e `500` para erros internos.

**Exportação CSV:** o endpoint `/exportar` aplica os mesmos filtros da listagem e retorna o arquivo com BOM UTF-8 (`\uFEFF`) para garantir compatibilidade com Excel e outros editores.

### Frontend

**Hooks personalizados:** a lógica de busca de dados foi separada em `useAgendamentos` e `useMetricas`, mantendo os componentes limpos e focados apenas na apresentação.

**Debounce na pesquisa:** a pesquisa de texto espera 500ms após o usuário parar de digitar antes de chamar a API, evitando requisições desnecessárias a cada tecla pressionada.

**Exportação completa em PDF:** a exportação em PDF inclui todos os registros filtrados (não apenas a página atual), fazendo uma requisição com `limit=99999` para garantir que os dados reflitam exatamente os filtros ativos.

**Ordenação no lado do cliente:** a ordenação por data, cliente e advogado é feita no frontend sobre os dados já carregados, sem necessidade de uma nova requisição ao backend.

**Identidade visual:** o layout foi desenvolvido com as cores institucionais da Resende Mori Hutchison Advocacia (`#08353a`), transmitindo seriedade e alinhamento com a marca do escritório.

---

## ⚠️ Limitações Conhecidas

- **Campos Serviço e Local:** estão presentes na estrutura da API, mas chegam como `null` na base de dados fornecida. A pesquisa por área jurídica está implementada e funcionará automaticamente se os dados forem preenchidos.

- **Receita Total:** o campo `receita` não existe na base de dados fornecida. A lógica está implementada no backend (`data.reduce`) e o KPI exibirá o valor automaticamente se o campo for adicionado ao JSON.

- **Performance:** os dados são lidos do arquivo JSON a cada requisição. Em produção, recomenda-se usar um banco de dados real com índices para melhor desempenho.

- **Autenticação:** o sistema não possui controle de acesso. Em produção, recomenda-se implementar autenticação JWT ou similar.

---

## 🔮 Melhorias Futuras

- Implementar banco de dados (PostgreSQL ou MongoDB)
- Adicionar autenticação e controle de perfis de acesso
- Filtrar por intervalo de datas
- Ordenação no lado do servidor para grandes volumes de dados
- Testes automatizados (Jest + React Testing Library)
- Deploy em nuvem (Railway, Vercel, etc.)
