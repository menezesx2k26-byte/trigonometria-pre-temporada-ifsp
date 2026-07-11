# Órbita 14 — Pré-temporada IFSP

Uma reconstrução limpa do app de Trigonometria, desenhada para uma rota intensiva de 14 dias.

## Princípios

- zero respostas livres obrigatórias;
- explicações autorais, sem reproduzir os livros;
- 112 questões fechadas e validadas;
- progressão em espiral: triângulo → circunferência → funções;
- FME 3 como mapa de conteúdo e FME 6 como continuação fora da rota principal;
- estado local no navegador, sem conta e sem coleta de dados.

## Rodar

```bash
npm install
npm run dev
```

## Validar

```bash
npm test
npm run build
```

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22 ou superior

O `wrangler.jsonc` está pronto para `npx wrangler pages deploy dist --project-name trigonometria-pre-temporada-ifsp` após autenticação.

Os PDFs dos FME não pertencem ao repositório e são bloqueados pelo `.gitignore`.
