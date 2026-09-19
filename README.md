# ScrapFlow

Sistema mobile para gestão de compras de materiais recicláveis e emissão de comprovantes.

> Evolução independente de um projeto comercial anterior. Esta versão foi reconstruída com identidade, configuração e histórico próprios; não contém dados, credenciais ou ativos do cliente original.

## O que o projeto resolve

O ScrapFlow organiza o fluxo diário de um ponto de compra de recicláveis:

- cadastro e atualização de materiais e preços por quilograma;
- aplicativo com navegação, listagem, cadastro, edição e desativação de materiais;
- registro de compras com múltiplos itens;
- fluxo mobile com vendedor, pesos, prévia e confirmação do total oficial;
- cálculo automático de subtotais e total;
- histórico de operações;
- base preparada para emissão e compartilhamento de comprovantes em PDF.

## Arquitetura

```text
scrapflow/
├── apps/
│   ├── api/       # API REST com Node.js, Express, TypeScript e MongoDB
│   └── mobile/    # Aplicativo Expo + React Native + TypeScript
├── docs/          # Documentação e imagens do projeto
└── .github/       # CI e atualização de dependências
```

## Tecnologias

- TypeScript
- React Native e Expo
- Node.js e Express
- MongoDB e Mongoose
- Zod
- Vitest
- Docker

## Como executar

### Pré-requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Docker (opcional, para o MongoDB local)

### Instalação

```bash
git clone https://github.com/davidmello04/scrapflow.git
cd scrapflow
npm install
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
docker compose up -d mongo
npm run dev:api
```

Em outro terminal:

```bash
npm run dev:mobile
```

A API responde em `http://localhost:3333`; sua verificação de saúde fica em `GET /health`.

> Em um celular físico, configure `EXPO_PUBLIC_API_URL` com o IP local do computador em vez de `localhost`.

## Endpoints iniciais

| Método | Rota | Finalidade |
|---|---|---|
| `GET` | `/health` | Saúde da aplicação |
| `GET` | `/api/materials` | Listar materiais ativos |
| `POST` | `/api/materials` | Cadastrar material |
| `PATCH` | `/api/materials/:id` | Atualizar material |
| `DELETE` | `/api/materials/:id` | Desativar material |
| `GET` | `/api/purchases` | Listar compras |
| `POST` | `/api/purchases` | Registrar compra e calcular total |
| `GET` | `/api/purchases/:id` | Consultar uma compra |

## Decisões de domínio

- valores monetários são armazenados em centavos;
- pesos são armazenados em gramas;
- totais são calculados no servidor para evitar divergências;
- exclusão de materiais é lógica, preservando o histórico;
- identificadores e datas são gerados pela API.

## Segurança

- nenhuma credencial é versionada;
- variáveis de ambiente são validadas na inicialização;
- entradas da API são validadas com Zod;
- os repositórios históricos permanecem privados;
- qualquer credencial do projeto anterior deve ser revogada e nunca reutilizada.

## Roadmap

- [x] Monorepo público e configuração segura
- [x] Catálogo de materiais com telas mobile funcionais
- [x] Registro de compras com cálculo no servidor
- [x] Fluxo mobile completo para registrar compras
- [ ] Autenticação e perfis de acesso
- [ ] Cadastro de vendedores/fornecedores
- [ ] Filtros, indicadores e dashboard
- [ ] Geração e compartilhamento de comprovante em PDF
- [ ] Testes de integração e cobertura ampliada
- [ ] Screenshots e vídeo demonstrativo
- [ ] Deploy de demonstração

## Licença

Código disponibilizado para fins de estudo e portfólio. Uma licença de uso será definida antes de aceitar contribuições externas.
