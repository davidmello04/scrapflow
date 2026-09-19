# Arquitetura

O ScrapFlow começa como um monorepo modular, suficiente para demonstrar decisões de engenharia sem impor complexidade prematura.

## Limites

- **Mobile:** interação, navegação e consumo da API; não decide preços nem totais finais.
- **API:** valida entradas, consulta preços vigentes, calcula totais e persiste as operações.
- **MongoDB:** mantém catálogo e compras; cada item da compra registra um snapshot do nome e preço usado.

## Próximas extrações

Quando o fluxo crescer, a API será organizada em módulos de autenticação, materiais, fornecedores, compras e comprovantes. A geração de PDF será um serviço de aplicação acionado somente após a persistência bem-sucedida da compra.
