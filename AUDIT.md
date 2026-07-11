# Auditoria e decisões pedagógicas

## Resultado

O projeto anterior foi reconstruído porque apenas o deploy compilado estava disponível. A nova versão reduz a rota principal a 14 dias e retira Complexos e Polinômios da carga imediata sem apagá-los do mapa do componente.

## Fontes usadas como mapa

- FME 3 — Trigonometria, 9ª edição: sequência em espiral do triângulo retângulo à circunferência e às funções.
- FME 6 — Complexos, Polinômios e Equações, 8ª edição: continuação do componente, fora da rota intensiva.
- PPC do curso: componente integrado de Trigonometria, Números Complexos e Polinômios.

Os PDFs, imagens e textos dos livros não são distribuídos. O app contém explicações, diagramas e questões autorais e apenas aponta capítulos e páginas para consulta.

## Rota de 14 dias

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

## Banco de questões

- 112 questões fechadas;
- 92 de escolha única;
- 8 de múltipla seleção;
- 12 de associação;
- zero `short-answer`;
- zero `numeric-input`;
- feedback com explicação e armadilha por meio do botão “Por quê?”.

## Mudanças de experiência

- Sem bloqueio artificial entre missões.
- Progresso salvo apenas no navegador.
- 75% marca domínio, mas nota menor não prende o estudante.
- Erros ficam associados à missão e reaparecem primeiro na próxima prática.
- Diagramas SVG autorais e responsivos.
- Modo escuro adulto, alto contraste e animação desativada quando o sistema pede movimento reduzido.
- Layouts específicos para desktop, tablet e celular.

## Validação

- 133 testes automatizados.
- Todas as 112 questões passam pelo motor de correção: o gabarito é aceito e respostas incompletas/distratores são rejeitados.
- IDs, opções e associações são validados contra duplicação e referências inexistentes.
- Sentinelas matemáticas cobrem os principais resultados de cada fase.
- `astro check`: zero erro, zero aviso.
- `astro build`: build estático concluído.

## Deploy

O projeto está configurado para Cloudflare Pages em `wrangler.jsonc`:

- comando de build: `npm run build`;
- diretório de saída: `dist`;
- nome pretendido: `trigonometria-pre-temporada-ifsp`.

O deploy não foi executado porque a sessão não recebeu autenticação da conta Cloudflare.
