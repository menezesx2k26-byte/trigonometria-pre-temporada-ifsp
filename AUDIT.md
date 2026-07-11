# Auditoria e decisões pedagógicas

## Resultado atual

A pré-temporada continua organizada em 14 dias, mas agora possui duas trilhas coordenadas:

1. **Órbita Trigonométrica**, campanha principal;
2. **Forja Polinomial**, side quest diária curta.

A divisão evita dois extremos: estudar apenas Trigonometria e chegar cru em Polinômios, ou tentar comprimir todo o FME 6 em duas semanas e abandonar a campanha por saturação.

## Fontes usadas como mapa

- FME 3 — Trigonometria, 9ª edição: sequência do ângulo às equações e inequações trigonométricas.
- FME 6 — Complexos, Polinômios e Equações, 8ª edição:
  - Capítulo II, p. 53–97: polinômios, operações, grau, divisão, resto, fator e Briot–Ruffini;
  - Capítulo III, p. 100–145: equações, decomposição, multiplicidade, Girard e raízes racionais.
- Complexos, raízes avançadas e capítulos IV–V permanecem no hangar de continuação.

Os PDFs, imagens e textos dos livros não são distribuídos. O app contém conteúdo autoral e apenas indica páginas para leitura.

## Campanha principal: Trigonometria

1. Ângulos
2. Triângulo retângulo
3. Seno, cosseno e tangente
4. Ângulos notáveis
5. Graus e radianos
6. Ciclo e sinais
7. Relações fundamentais
8. Redução ao primeiro quadrante
9. Funções seno e cosseno
10. Tangente e transformações gráficas
11. Fórmulas de transformação
12. Identidades
13. Equações e inequações
14. Boss integrado

## Side quests: Forja Polinomial

1. Anatomia e valor numérico
2. Identidade e coeficientes
3. Soma e subtração
4. Produto e grau
5. Divisão euclidiana
6. Teoremas do resto e do fator
7. Briot–Ruffini
8. Equações e produto nulo
9. Decomposição em fatores
10. Multiplicidade
11. Relações de Girard
12. Raízes racionais
13. Protocolo integrado de caça
14. Boss Polinomial

## Banco de questões

- 168 questões fechadas;
- 112 de Trigonometria;
- 56 de Polinômios;
- escolha única, múltipla seleção e associação;
- zero `short-answer`;
- zero `numeric-input`;
- explicação e armadilha disponíveis após a conferência.

## Integridade do progresso

- Uma missão só é concluída quando todas as suas questões foram verificadas.
- O domínio de 75% representa a pontuação atual e pode ser removido após uma tentativa posterior inferior.
- Campanhas possuem progresso e recomendação independentes.
- Trocar de missão remonta o painel e elimina vazamento de estado.
- Leitura e escrita do `localStorage` são defensivas e dados inválidos são filtrados.
- Trigonometria e Forja compartilham apenas o banco de resultados, cujos IDs são únicos.

## Experiência

- 28 mapas SVG autorais e responsivos;
- 28 mnemônicos;
- plano diário com modos sobrevivência, combo e Boss;
- XP baseado em conclusão e domínio, sem streak punitiva;
- erros capturados e reabertos por missão;
- navegação livre entre dias;
- foco restaurado ao fechar o painel;
- abas com papéis ARIA e navegação por setas;
- alvos de navegação das questões maiores que 24 px;
- animações desativadas quando o sistema pede movimento reduzido.

## Validação

- 244 testes automatizados na primeira integração da Forja;
- sentinelas matemáticas independentes para os 14 dias polinomiais;
- renderização e integridade dos 28 SVGs;
- validação estrutural de todos os gabaritos;
- `astro check`: zero erro, zero aviso;
- `astro build`: build estático concluído;
- build limpo gera somente cinco arquivos;
- inspeção visual em desktop e celular sem overflow horizontal ou erro de console.

## Publicação

O projeto Cloudflare Pages é `trigonometria-orbita-14`. A publicação deve sempre usar o `dist` produzido pelo comando `npm run build`, que agora remove a saída anterior antes de compilar.

