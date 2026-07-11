# Órbita 14 — Pré-temporada IFSP

Uma campanha dupla de 14 dias para chegar ao segundo semestre com Trigonometria e Polinômios em funcionamento, sem transformar as férias numa segunda faculdade.

## Estrutura

- **Órbita Trigonométrica:** 14 missões principais de 55–90 minutos e 112 questões.
- **Forja Polinomial:** 14 side quests de 20–35 minutos e 56 questões.
- **Combo diário normal:** aproximadamente 75–100 minutos.
- **Modo sobrevivência:** somente a side quest, para manter o movimento em dias ruins.
- **Modo Boss:** combo completo mais dois erros capturados.

## Princípios

- zero respostas escritas obrigatórias;
- explicações, questões e 28 mapas SVG autorais;
- 168 questões fechadas;
- FME 3 como mapa da campanha trigonométrica;
- FME 6, capítulos II–III, como mapa da Forja;
- progresso local, sem conta e sem coleta de dados;
- domínio atual recalculado a partir da pontuação;
- nenhuma missão é concluída com questões pendentes;
- build sempre começa apagando a saída anterior.

## Rodar

```bash
npm install
npm run dev
```

## Validar

```bash
npm test
npm run build
npm run preview
```

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22 ou superior

Publicação manual:

```bash
npx wrangler pages deploy dist --project-name trigonometria-orbita-14
```

Os PDFs do FME são referências privadas do estudo e não devem ser adicionados ao repositório.

