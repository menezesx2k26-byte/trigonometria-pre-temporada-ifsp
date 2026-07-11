import type {
  ChoiceQuestion,
  MatchQuestion,
  Mission,
  MultiQuestion,
  QuestionOption,
} from "./types";

const letters = "abcdefghijklmnopqrstuvwxyz";

function options(labels: string[]): QuestionOption[] {
  return labels.map((label, index) => ({ id: letters[index], label }));
}

function choice(
  id: string,
  prompt: string,
  labels: string[],
  correctIndex: number,
  explanation: string,
  trap: string,
): ChoiceQuestion {
  return {
    id,
    type: "choice",
    prompt,
    options: options(labels),
    correctId: letters[correctIndex],
    explanation,
    trap,
  };
}

function multi(
  id: string,
  prompt: string,
  labels: string[],
  correctIndexes: number[],
  explanation: string,
  trap: string,
): MultiQuestion {
  return {
    id,
    type: "multi",
    prompt,
    options: options(labels),
    correctIds: correctIndexes.map((index) => letters[index]),
    explanation,
    trap,
  };
}

function match(
  id: string,
  prompt: string,
  rows: Array<[string, string]>,
  answerLabels: string[],
  explanation: string,
  trap: string,
): MatchQuestion {
  const answerOptions = options(answerLabels);
  return {
    id,
    type: "match",
    prompt,
    rows: rows.map(([left, answer], index) => ({
      id: `r${index + 1}`,
      left,
      correctOptionId:
        answerOptions.find((option) => option.label === answer)?.id ?? "",
    })),
    options: answerOptions,
    explanation,
    trap,
  };
}

export const polynomialMissions: Mission[] = [
  {
    campaign: "poly",
    day: 1,
    slug: "raio-x-do-polinomio",
    title: "Raio-X do polinômio",
    shortTitle: "Anatomia",
    phase: "Forja",
    duration: "20–25 min",
    source: "FME 6 — Capítulo II, p. 53–54",
    objective:
      "Ler termos, coeficientes, grau, termo constante e valor numérico sem tropeçar na notação.",
    why: "Polinômio não é uma conta comprida: é uma ficha organizada por potências. Ler a ficha evita metade dos erros futuros.",
    mnemonic: {
      label: "Raio-X P.G.C.",
      chant:
        "Potência dá o grau; número da frente, coeficiente; sozinho, constante.",
      meaning:
        "Primeiro enxergue a maior potência, depois o número que a acompanha e, por fim, o termo sem x.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Anatomia",
        title: "Cada termo tem endereço",
        body: "Em P(x)=aₙxⁿ+...+a₁x+a₀, os expoentes são inteiros não negativos. Se uma potência não aparece, seu coeficiente é zero.",
        formula: "P(x)=aₙxⁿ+...+a₁x+a₀",
      },
      {
        eyebrow: "Leitura",
        title: "Grau olha para o alto",
        body: "Num polinômio não nulo, o grau é o maior expoente cujo coeficiente não é zero. O coeficiente desse termo é o coeficiente líder.",
        formula: "grau de 4x³−2x+7 = 3",
      },
      {
        eyebrow: "Substituição",
        title: "Valor numérico",
        body: "Calcular P(a) é substituir cada x por a, usando parênteses. Se P(a)=0, a é uma raiz do polinômio.",
        formula: "P(a)=0 ⇔ a é raiz",
      },
    ],
    example: {
      prompt: "Faça o raio-X de P(x)=2x³−5x+7 e calcule P(2).",
      steps: [
        "A maior potência presente é 3: o grau é 3.",
        "O coeficiente líder é 2 e o termo constante é 7.",
        "Substitua x por 2: P(2)=2·2³−5·2+7.",
        "Calcule: 16−10+7=13.",
      ],
      result: "Raio-X: grau 3, líder 2, constante 7 e P(2)=13.",
    },
    questions: [
      match(
        "p1q1",
        "Associe cada dado de P(x)=5x⁴−2x+9.",
        [
          ["grau", "4"],
          ["coeficiente líder", "5"],
          ["termo constante", "9"],
        ],
        ["4", "5", "9"],
        "A maior potência é 4, acompanhada por 5; o termo sem x é 9.",
        "Confundir o grau com o coeficiente líder.",
      ),
      choice(
        "p1q2",
        "Se P(x)=x²+3x−1, então P(−2) vale:",
        ["−3", "1", "9", "−11"],
        0,
        "P(−2)=(−2)²+3(−2)−1=4−6−1=−3.",
        "Esquecer os parênteses e fazer (−2)² negativo.",
      ),
      choice(
        "p1q3",
        "Qual expressão é um polinômio em x?",
        ["3x⁴−2x+1", "2/x+x", "√x+1", "x⁻²+4"],
        0,
        "Em um polinômio, os expoentes de x são inteiros não negativos; a primeira expressão respeita isso.",
        "Aceitar raiz, x no denominador ou expoente negativo.",
      ),
      multi(
        "p1q4",
        "Quais afirmações são verdadeiras para P(x)=aₙxⁿ+...+a₀?",
        [
          "P(0)=a₀",
          "uma potência ausente tem coeficiente zero",
          "P(r)=0 significa que r é raiz",
          "x pode ter expoente negativo",
        ],
        [0, 1, 2],
        "O termo constante aparece em P(0), potências ausentes carregam coeficiente zero e raízes anulam P.",
        "Misturar polinômios com expressões que têm potência negativa.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 2,
    slug: "identidade-sem-disfarce",
    title: "Identidade sem disfarce",
    shortTitle: "Coeficientes",
    phase: "Forja",
    duration: "20–25 min",
    source: "FME 6 — Capítulo II, p. 54–58",
    objective:
      "Reconhecer polinômio nulo e comparar coeficientes em identidades válidas para todo x.",
    why: "Quando duas expressões são iguais para todo x, cada potência entrega uma equação. É álgebra com scanner, não adivinhação.",
    mnemonic: {
      label: "Mesma potência, mesma gaveta",
      chant: "x² com x², x com x, constante com constante: gaveta não mistura.",
      meaning:
        "Organize as expressões por potência e compare somente coeficientes correspondentes.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Zero total",
        title: "Polinômio nulo",
        body: "Um polinômio é identicamente nulo somente quando todos os seus coeficientes são zero.",
        formula: "ax²+bx+c≡0 ⇔ a=b=c=0",
      },
      {
        eyebrow: "Identidade",
        title: "Igual para todo x",
        body: "P(x)≡Q(x) significa igualdade para qualquer valor de x, não apenas para uma solução isolada.",
        formula: "P≡Q ⇒ coeficientes correspondentes iguais",
      },
      {
        eyebrow: "Método",
        title: "Ordene antes de comparar",
        body: "Expanda, reduza termos semelhantes, preencha potências ausentes com zero e só então compare as gavetas.",
      },
    ],
    example: {
      prompt: "Ache a e b para (a−1)x²+(b+2)x+4≡3x²−x+4.",
      steps: [
        "Compare os coeficientes de x²: a−1=3.",
        "Resolva: a=4.",
        "Compare os coeficientes de x: b+2=−1.",
        "Resolva: b=−3; as constantes já coincidem.",
      ],
      result: "a=4 e b=−3.",
    },
    questions: [
      multi(
        "p2q1",
        "Para ax²+bx+c ser o polinômio nulo, marque todas as condições necessárias.",
        ["a=0", "b=0", "c=0", "a+b+c=0 é suficiente"],
        [0, 1, 2],
        "O polinômio nulo exige cada coeficiente igual a zero; apenas a soma deles zerar não basta.",
        "Trocar três condições por uma única soma igual a zero.",
      ),
      choice(
        "p2q2",
        "Para (m−2)x²+5 ser idêntico a 5, m deve valer:",
        ["0", "2", "5", "−2"],
        1,
        "O coeficiente de x² deve desaparecer: m−2=0, portanto m=2.",
        "Igualar m diretamente ao termo constante 5.",
      ),
      match(
        "p2q3",
        "Se (a+1)x+(b−2)≡4x+5, associe os parâmetros.",
        [
          ["a", "3"],
          ["b", "7"],
        ],
        ["3", "7"],
        "Dos termos em x, a+1=4 dá a=3; das constantes, b−2=5 dá b=7.",
        "Comparar a com 4 e b com 5 sem desfazer os deslocamentos.",
      ),
      choice(
        "p2q4",
        "Qual identidade é verdadeira para todo x?",
        ["(x+1)²=x²+2x+1", "(x+1)²=x²+1", "(x−1)(x+1)=x²+1", "2(x+3)=2x+3"],
        0,
        "Ao expandir (x+1)², obtemos x²+2x+1 para qualquer x.",
        "Apagar o termo cruzado ou distribuir apenas no primeiro termo.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 3,
    slug: "soma-sem-salada",
    title: "Soma sem salada",
    shortTitle: "Somar e subtrair",
    phase: "Forja",
    duration: "20–25 min",
    source: "FME 6 — Capítulo II, p. 59–61",
    objective:
      "Somar e subtrair polinômios alinhando potências e distribuindo corretamente o sinal de menos.",
    why: "Termos semelhantes são peças do mesmo tipo. A conta fica curta quando você para de tentar somar x² com x.",
    mnemonic: {
      label: "Coluna da potência",
      chant: "Alinha, abre, troca o sinal; junta só quem tem potência igual.",
      meaning:
        "Na subtração, distribua o menos por todo o segundo polinômio antes de reduzir termos semelhantes.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Organização",
        title: "Potências em colunas",
        body: "Ordene do maior para o menor expoente e imagine uma coluna para cada potência.",
        formula: "x³ | x² | x | 1",
      },
      {
        eyebrow: "Soma",
        title: "Some coeficientes",
        body: "Somente termos com a mesma parte literal podem ser reduzidos. A potência permanece a mesma.",
        formula: "3x²+5x²=8x²",
      },
      {
        eyebrow: "Subtração",
        title: "O menos invade o parêntese",
        body: "Em P−Q, todos os sinais de Q são trocados. Depois disso, a operação volta a ser uma soma por colunas.",
      },
    ],
    example: {
      prompt: "Calcule (2x²−3x+1)−(x²+5x−4).",
      steps: [
        "Distribua o menos: 2x²−3x+1−x²−5x+4.",
        "Junte os termos em x²: 2x²−x²=x².",
        "Junte os termos em x: −3x−5x=−8x.",
        "Junte as constantes: 1+4=5.",
      ],
      result: "x²−8x+5.",
    },
    questions: [
      choice(
        "p3q1",
        "(2x²−3x+1)+(x²+5x−4) é:",
        ["3x²+2x−3", "3x²+8x−3", "3x⁴+2x−3", "x²+2x+5"],
        0,
        "Somando por potência: 2+1=3, −3+5=2 e 1−4=−3.",
        "Somar expoentes em vez de somar coeficientes.",
      ),
      choice(
        "p3q2",
        "(3x²+x−2)−(x²−4x+5) é:",
        ["2x²+5x−7", "2x²−3x+3", "4x²−3x−7", "2x²−5x−7"],
        0,
        "Trocando os sinais do segundo: 3x²+x−2−x²+4x−5=2x²+5x−7.",
        "Trocar apenas o primeiro sinal dentro do parêntese.",
      ),
      multi(
        "p3q3",
        "Quais termos são semelhantes entre si?",
        ["4x³", "−2x³", "7x²", "5"],
        [0, 1],
        "4x³ e −2x³ têm exatamente a mesma parte literal x³; apenas os coeficientes mudam.",
        "Agrupar termos só porque todos possuem a letra x.",
      ),
      match(
        "p3q4",
        "Considere P=x²+x e Q=x²−x. Associe.",
        [
          ["P+Q", "2x²"],
          ["P−Q", "2x"],
        ],
        ["2x²", "2x"],
        "Na soma, os termos em x cancelam; na diferença, os termos em x² cancelam.",
        "Cancelar os termos iguais também durante a soma.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 4,
    slug: "produto-e-grau",
    title: "Produto e grau",
    shortTitle: "Multiplicar",
    phase: "Forja",
    duration: "20–25 min",
    source: "FME 6 — Capítulo II, p. 61–68",
    objective:
      "Multiplicar polinômios e prever grau e termo líder antes de expandir tudo.",
    why: "O termo líder funciona como radar: ele prevê a potência máxima e denuncia respostas impossíveis.",
    mnemonic: {
      label: "Todos com todos",
      chant:
        "No produto, todos com todos; no topo, graus somam e líderes multiplicam.",
      meaning:
        "Distribua cada termo e use grau/coeficiente líder como controle rápido do resultado.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Distribuição",
        title: "Todos com todos",
        body: "Cada termo do primeiro polinômio multiplica cada termo do segundo. Depois, reduza os semelhantes.",
      },
      {
        eyebrow: "Radar",
        title: "O topo encontra o topo",
        body: "Para polinômios não nulos, o grau do produto é a soma dos graus e o coeficiente líder é o produto dos líderes.",
        formula: "grau(PQ)=grau P+grau Q",
      },
      {
        eyebrow: "Cuidado",
        title: "Na soma, o grau pode cair",
        body: "Se os termos líderes se cancelarem, o grau de P+Q fica menor. Por isso não existe uma fórmula de soma tão rígida quanto a do produto.",
      },
    ],
    example: {
      prompt: "Expanda (2x−1)(x²+3) e confira pelo termo líder.",
      steps: [
        "Distribua 2x: 2x³+6x.",
        "Distribua −1: −x²−3.",
        "Junte: 2x³−x²+6x−3.",
        "Controle: graus 1+2=3 e líderes 2·1=2, exatamente o termo 2x³.",
      ],
      result: "2x³−x²+6x−3.",
    },
    questions: [
      choice(
        "p4q1",
        "(x+2)(x−3) é:",
        ["x²−x−6", "x²−5x−6", "x²+x−6", "x²−6"],
        0,
        "Pela distributiva, x²−3x+2x−6=x²−x−6.",
        "Esquecer os termos cruzados ou errar −3x+2x.",
      ),
      choice(
        "p4q2",
        "Se P e Q são não nulos, com graus 2 e 3, o grau de PQ é:",
        ["1", "5", "6", "não é possível saber"],
        1,
        "No produto de polinômios não nulos, os graus somam: 2+3=5.",
        "Multiplicar os graus e responder 6.",
      ),
      choice(
        "p4q3",
        "O termo líder de (2x²+...)(−3x⁴+...) é:",
        ["−6x⁶", "−x⁶", "6x⁸", "−6x⁸"],
        0,
        "Multiplicam-se os líderes: 2·(−3)=−6 e x²·x⁴=x⁶.",
        "Multiplicar os expoentes em vez de somá-los.",
      ),
      choice(
        "p4q4",
        "Se P e Q têm grau 4, o que é sempre verdade sobre P+Q?",
        [
          "tem grau exatamente 8",
          "tem grau exatamente 4",
          "tem grau no máximo 4 ou pode ser nulo",
          "tem grau exatamente zero",
        ],
        2,
        "A soma não cria potência acima de 4 e os termos líderes podem se cancelar, até produzindo o polinômio nulo.",
        "Aplicar à soma a regra de graus do produto.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 5,
    slug: "divisao-com-gps",
    title: "Divisão com GPS",
    shortTitle: "Divisão",
    phase: "Fatoração",
    duration: "25–30 min",
    source: "FME 6 — Capítulo II, p. 69–79",
    objective:
      "Entender a divisão euclidiana, reconstruir o dividendo e reconhecer quando a divisão é exata.",
    why: "Quociente e resto não são sobras decorativas: eles guardam toda a divisão numa única identidade.",
    mnemonic: {
      label: "D=dq+r",
      chant:
        "Dividendo é divisor vezes quociente, mais resto menor que o divisor.",
      meaning:
        "A identidade reconstrói a conta e a condição do grau torna quociente e resto únicos.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Identidade",
        title: "A divisão inteira cabe numa linha",
        body: "Se D é dividido por d, então existem quociente q e resto r tais que D=dq+r.",
        formula: "D(x)=d(x)q(x)+r(x)",
      },
      {
        eyebrow: "Trava",
        title: "O resto precisa ser menor",
        body: "O resto é zero ou possui grau estritamente menor que o grau do divisor.",
        formula: "r=0 ou grau(r)<grau(d)",
      },
      {
        eyebrow: "Exatidão",
        title: "Resto zero vira fator",
        body: "Quando r=0, a divisão é exata e o divisor é um fator do dividendo.",
      },
    ],
    example: {
      prompt: "Divida x³−1 por x−1 e reconstrua o dividendo.",
      steps: [
        "O quociente é x²+x+1.",
        "O resto é zero.",
        "Reconstrua: (x−1)(x²+x+1)+0.",
        "Expandindo, obtemos x³−1.",
      ],
      result: "q=x²+x+1 e r=0; portanto x−1 é fator.",
    },
    questions: [
      choice(
        "p5q1",
        "Qual identidade representa a divisão de D por d?",
        ["D=d+q+r", "D=dq+r", "D=dr+q", "D=q/r+d"],
        1,
        "A divisão euclidiana é registrada por D=d·q+r.",
        "Somar divisor e quociente em vez de multiplicá-los.",
      ),
      choice(
        "p5q2",
        "Se o divisor tem grau 3 e o resto não é zero, o grau do resto deve ser:",
        ["menor que 3", "igual a 3", "maior que 3", "sempre zero"],
        0,
        "A condição da divisão euclidiana exige grau(r)<grau(d), portanto menor que 3.",
        "Permitir que resto e divisor tenham o mesmo grau.",
      ),
      choice(
        "p5q3",
        "Se d=x−1, q=x+2 e r=3, então o dividendo D é:",
        ["x²+x+1", "x²+x−5", "2x+4", "x²+3x+1"],
        0,
        "D=(x−1)(x+2)+3=x²+x−2+3=x²+x+1.",
        "Esquecer de somar o resto depois do produto.",
      ),
      multi(
        "p5q4",
        "Uma divisão polinomial exata garante:",
        [
          "resto zero",
          "D=dq",
          "d é fator de D",
          "o quociente é sempre constante",
        ],
        [0, 1, 2],
        "Divisão exata significa r=0; então D=dq e o divisor é fator do dividendo.",
        "Achar que exatidão obriga quociente de grau zero.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 6,
    slug: "resto-entrega-o-fator",
    title: "O resto entrega o fator",
    shortTitle: "Resto e fator",
    phase: "Fatoração",
    duration: "20–25 min",
    source: "FME 6 — Capítulo II, p. 80–84",
    objective:
      "Usar P(a) para obter o resto da divisão por x−a e decidir se x−a é fator.",
    why: "Você pode substituir um número e descobrir uma divisão inteira sem montar a chave. É o primeiro golpe realmente apelão da campanha.",
    mnemonic: {
      label: "Substitui e sentencia",
      chant: "Por x menos a, o resto é P de a; se zerou, virou fator.",
      meaning:
        "O Teorema do Resto calcula r=P(a); o Teorema de D’Alembert transforma r=0 em divisibilidade.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Teorema do resto",
        title: "Dividir por x−a",
        body: "O resto da divisão de P(x) por x−a é o número P(a).",
        formula: "resto=P(a)",
      },
      {
        eyebrow: "D’Alembert",
        title: "Zero significa fator",
        body: "Se P(a)=0, a divisão por x−a é exata; logo, x−a é fator de P.",
        formula: "P(a)=0 ⇔ (x−a) divide P",
      },
      {
        eyebrow: "Sinal",
        title: "x+a é x−(−a)",
        body: "Para dividir por x+3, substitua a=−3. O sinal dentro do binômio chega invertido na substituição.",
      },
    ],
    example: {
      prompt: "Descubra se x−1 é fator de P(x)=x³−4x+3.",
      steps: [
        "O divisor x−1 indica a=1.",
        "Calcule P(1)=1³−4·1+3.",
        "P(1)=1−4+3=0.",
        "Resto zero: x−1 divide P exatamente.",
      ],
      result: "Sim, x−1 é fator de P.",
    },
    questions: [
      choice(
        "p6q1",
        "O resto de x²+3x+2 dividido por x+1 é:",
        ["0", "2", "4", "−2"],
        0,
        "x+1=x−(−1); P(−1)=1−3+2=0.",
        "Substituir a=1 porque aparece um sinal de mais.",
      ),
      choice(
        "p6q2",
        "x−2 é fator de P(x) exatamente quando:",
        ["P(−2)=0", "P(2)=0", "P(0)=2", "P(2)=2"],
        1,
        "Para o divisor x−a, usamos a=2; ele é fator quando P(2)=0.",
        "Inverter o sinal mesmo quando o divisor já é x−2.",
      ),
      choice(
        "p6q3",
        "O resto de P(x)=x³−4x+1 por x−2 vale:",
        ["0", "1", "−1", "8"],
        1,
        "P(2)=8−8+1=1, que é o resto.",
        "Parar em 8−8 e esquecer o termo constante.",
      ),
      multi(
        "p6q4",
        "Se x+3 é fator de P(x), quais afirmações são verdadeiras?",
        [
          "P(−3)=0",
          "−3 é raiz",
          "o resto por x+3 é zero",
          "P(3)=0 obrigatoriamente",
        ],
        [0, 1, 2],
        "x+3=x−(−3): fator, raiz −3 e resto zero são três formas da mesma informação.",
        "Usar 3 no lugar de −3 por copiar o sinal do divisor.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 7,
    slug: "briot-ruffini-sem-panico",
    title: "Briot–Ruffini sem pânico",
    shortTitle: "Ruffini",
    phase: "Fatoração",
    duration: "25–30 min",
    source: "FME 6 — Capítulo II, p. 84–97",
    objective:
      "Executar a divisão sintética por x−a sem perder coeficientes de potências ausentes.",
    why: "Ruffini compacta a divisão justamente quando você está caçando raízes. É a ponte entre encontrar uma raiz e desmontar a equação.",
    mnemonic: {
      label: "Desce, multiplica, soma",
      chant:
        "Completa os coeficientes; desce, multiplica por a e soma até o resto.",
      meaning:
        "A repetição é sempre a mesma; o erro mortal é omitir o zero de uma potência ausente.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Preparação",
        title: "Liste todos os coeficientes",
        body: "Ordene o polinômio e escreva zero no lugar de cada potência ausente.",
        formula: "x³−4x+5 → [1,0,−4,5]",
      },
      {
        eyebrow: "Algoritmo",
        title: "Desce, multiplica, soma",
        body: "Desça o primeiro coeficiente; multiplique por a; some à próxima coluna e repita.",
      },
      {
        eyebrow: "Leitura",
        title: "Último número é o resto",
        body: "Os números anteriores formam os coeficientes do quociente, cujo grau é uma unidade menor.",
      },
    ],
    example: {
      prompt: "Divida x³−6x²+11x−6 por x−1.",
      steps: [
        "Use a=1 e os coeficientes [1,−6,11,−6].",
        "Desça 1; multiplique por 1 e some: −6+1=−5.",
        "Multiplique −5 por 1 e some: 11−5=6.",
        "Multiplique 6 por 1 e some: −6+6=0.",
      ],
      result: "Quociente x²−5x+6 e resto 0.",
    },
    questions: [
      choice(
        "p7q1",
        "Quais coeficientes entram em Ruffini para x³−4x+5?",
        ["[1,−4,5]", "[1,0,−4,5]", "[3,−4,5]", "[1,−4,0,5]"],
        1,
        "O termo x² está ausente, então seu coeficiente zero precisa ocupar a segunda posição.",
        "Pular a potência ausente e deslocar todas as colunas.",
      ),
      choice(
        "p7q2",
        "O quociente de x³−6x²+11x−6 por x−1 é:",
        ["x²−5x+6", "x²−6x+11", "x²+5x−6", "x²−5x"],
        0,
        "Ruffini com a=1 produz coeficientes 1, −5 e 6, com resto zero.",
        "Copiar os três primeiros coeficientes sem executar o algoritmo.",
      ),
      choice(
        "p7q3",
        "Para dividir por x+2 em Ruffini, o número lateral é:",
        ["2", "−2", "0", "1/2"],
        1,
        "x+2=x−(−2), portanto a=−2.",
        "Copiar o sinal de dentro do binômio.",
      ),
      choice(
        "p7q4",
        "O quociente de 2x³−3x²−8x+12 por x−2 é:",
        ["2x²+x−6", "2x²−x−6", "x²+x−6", "2x²+x+6"],
        0,
        "Ruffini com 2 transforma [2,−3,−8,12] em [2,1,−6] e resto zero.",
        "Errar a soma −3+4 ou o produto 1·2.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 8,
    slug: "equacao-vira-produto",
    title: "Equação vira produto",
    shortTitle: "Equações",
    phase: "Raízes",
    duration: "20–25 min",
    source: "FME 6 — Capítulo III, p. 100–104",
    objective:
      "Colocar equações na forma P(x)=0 e extrair soluções de produtos fatorados.",
    why: "Uma equação polinomial fica vulnerável quando tudo está de um lado e o outro lado é zero.",
    mnemonic: {
      label: "Zera, fatora, separa",
      chant: "Leva tudo pro zero, fatora o bloco e zera cada fator.",
      meaning:
        "A propriedade do produto nulo transforma uma equação grande em equações pequenas.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Forma padrão",
        title: "Tudo para um lado",
        body: "Transforme P(x)=Q(x) em P(x)−Q(x)=0 antes de procurar raízes.",
      },
      {
        eyebrow: "Produto nulo",
        title: "Cada fator pode zerar",
        body: "Se A(x)B(x)=0, então A(x)=0 ou B(x)=0.",
        formula: "AB=0 ⇒ A=0 ou B=0",
      },
      {
        eyebrow: "Conjunto solução",
        title: "Reúna sem repetir",
        body: "Resolva cada fator no universo pedido e reúna as raízes no conjunto solução.",
      },
    ],
    example: {
      prompt: "Resolva (x−2)(x+3)=0.",
      steps: [
        "O produto já está igual a zero.",
        "Primeiro fator: x−2=0, então x=2.",
        "Segundo fator: x+3=0, então x=−3.",
        "Reúna as duas soluções.",
      ],
      result: "S={−3,2}.",
    },
    questions: [
      choice(
        "p8q1",
        "P(x)=Q(x) pode ser escrita na forma padrão como:",
        ["P+Q=1", "P−Q=0", "P/Q=0", "PQ=1"],
        1,
        "Subtrair Q dos dois lados produz P(x)−Q(x)=0 sem mudar as soluções.",
        "Multiplicar os lados ou dividir por expressão que pode zerar.",
      ),
      choice(
        "p8q2",
        "As raízes de (x−2)(x+3)=0 são:",
        ["2 e 3", "−2 e −3", "2 e −3", "−2 e 3"],
        2,
        "x−2=0 dá 2; x+3=0 dá −3.",
        "Copiar os sinais mostrados nos fatores.",
      ),
      multi(
        "p8q3",
        "Quais são as raízes de x(x−1)(x+4)=0?",
        ["0", "1", "−4", "4"],
        [0, 1, 2],
        "Cada fator pode zerar: x=0, x−1=0 e x+4=0 fornecem 0, 1 e −4.",
        "Ignorar o fator x ou copiar +4 como raiz.",
      ),
      choice(
        "p8q4",
        "A equação mônica de 2º grau com raízes 1 e −2 é:",
        ["x²+x−2=0", "x²−x−2=0", "x²+x+2=0", "x²−3x+2=0"],
        0,
        "Os fatores são (x−1)(x+2); expandindo, x²+x−2=0.",
        "Usar as raízes como sinais idênticos dentro dos fatores.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 9,
    slug: "decomposicao-em-fatores",
    title: "Decomposição em fatores",
    shortTitle: "Decompor",
    phase: "Raízes",
    duration: "20–25 min",
    source: "FME 6 — Capítulo III, p. 104–110",
    objective:
      "Relacionar grau, raízes e decomposição em fatores lineares, contando multiplicidades.",
    why: "As raízes são o DNA do polinômio: com o coeficiente líder, elas remontam a expressão inteira.",
    mnemonic: {
      label: "Raiz r vira x−r",
      chant: "Achou raiz r, nasce x menos r; grau conta fatores com repetição.",
      meaning:
        "Cada raiz produz um fator linear, repetido de acordo com sua multiplicidade.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "TFA",
        title: "O grau conta raízes em C",
        body: "Um polinômio não constante de grau n possui n raízes complexas quando contamos repetições.",
      },
      {
        eyebrow: "Decomposição",
        title: "Raízes viram fatores",
        body: "Se r₁,...,rₙ são as raízes e a é o líder, então P(x)=a(x−r₁)...(x−rₙ).",
        formula: "P(x)=a∏(x−rᵢ)",
      },
      {
        eyebrow: "Universo",
        title: "Nem toda raiz precisa ser real",
        body: "Nesta campanha caçaremos principalmente raízes reais e racionais; as não reais ficam no módulo de Complexos.",
      },
    ],
    example: {
      prompt: "Decomponha x²−5x+6.",
      steps: [
        "Procure dois números com soma 5 e produto 6.",
        "Os números são 2 e 3.",
        "As raízes são 2 e 3.",
        "Cada raiz r gera o fator x−r.",
      ],
      result: "x²−5x+6=(x−2)(x−3).",
    },
    questions: [
      choice(
        "p9q1",
        "Contando multiplicidades, um polinômio de grau 5 possui em C:",
        [
          "no máximo 4 raízes",
          "exatamente 5 raízes",
          "sempre 5 raízes reais",
          "uma única raiz",
        ],
        1,
        "Pelo Teorema Fundamental da Álgebra, são 5 raízes complexas contadas com multiplicidade.",
        "Trocar raízes complexas por raízes obrigatoriamente reais.",
      ),
      choice(
        "p9q2",
        "Se P tem líder a e raízes r₁ e r₂, sua forma fatorada é:",
        ["a(x−r₁)(x−r₂)", "(x+a)(r₁+r₂)", "a(x+r₁)(x+r₂)", "x²−a"],
        0,
        "Cada raiz r produz x−r, e o coeficiente líder multiplica todo o produto.",
        "Esquecer o líder ou usar x+r para uma raiz r.",
      ),
      choice(
        "p9q3",
        "x²−5x+6 se decompõe como:",
        ["(x−2)(x−3)", "(x+2)(x+3)", "(x−1)(x−6)", "(x+2)(x−3)"],
        0,
        "O produto 2·3=6 e a soma 2+3=5 geram o termo −5x nos fatores x−2 e x−3.",
        "Olhar apenas para o produto e ignorar o termo do meio.",
      ),
      choice(
        "p9q4",
        "O polinômio mônico com raízes 1, 1 e −2 é:",
        ["(x−1)²(x+2)", "(x+1)²(x−2)", "(x−1)(x+2)", "(x−1)³(x+2)"],
        0,
        "A raiz 1 aparece duas vezes, produzindo (x−1)²; a raiz −2 produz x+2.",
        "Eliminar a repetição da raiz ou copiar os sinais.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 10,
    slug: "raízes-com-eco",
    title: "Raízes com eco",
    shortTitle: "Multiplicidade",
    phase: "Raízes",
    duration: "20–25 min",
    source: "FME 6 — Capítulo III, p. 111–113",
    objective:
      "Identificar multiplicidade, conferir a soma das repetições e interpretar o comportamento local do gráfico.",
    why: "Uma raiz pode aparecer mais de uma vez. Ignorar o eco faz o grau sumir e o gráfico parecer quebrar as regras.",
    mnemonic: {
      label: "Expoente é eco",
      chant:
        "Fator repetido deixa eco: o expoente conta quantas vezes a raiz voltou.",
      meaning:
        "Em (x−r)ᵐ, r é raiz de multiplicidade m; a soma das multiplicidades recupera o grau.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Definição",
        title: "Quantas vezes o fator aparece",
        body: "Se (x−r)ᵐ divide P, mas (x−r)ᵐ⁺¹ não divide, r tem multiplicidade m.",
      },
      {
        eyebrow: "Contagem",
        title: "Multiplicidades somam o grau",
        body: "Na decomposição completa em C, a soma das multiplicidades é o grau do polinômio.",
      },
      {
        eyebrow: "Imagem mental",
        title: "Ímpar cruza, par encosta",
        body: "Em gráficos reais, uma raiz de multiplicidade ímpar costuma atravessar o eixo; de multiplicidade par, tocar e voltar.",
      },
    ],
    example: {
      prompt: "Leia P(x)=(x−3)²(x+1)³.",
      steps: [
        "O fator x−3 fornece a raiz 3.",
        "Seu expoente 2 dá multiplicidade 2.",
        "O fator x+1 fornece a raiz −1, com multiplicidade 3.",
        "As multiplicidades somam 2+3=5, o grau de P.",
      ],
      result: "3 é dupla; −1 é tripla; grau 5.",
    },
    questions: [
      choice(
        "p10q1",
        "Em P(x)=(x−3)⁴(x+2), a multiplicidade da raiz 3 é:",
        ["1", "2", "3", "4"],
        3,
        "O fator x−3 aparece elevado à quarta potência, então a raiz 3 tem multiplicidade 4.",
        "Contar a quantidade de fatores diferentes.",
      ),
      match(
        "p10q2",
        "Para P(x)=(x+1)²(x−4), associe.",
        [
          ["raiz −1", "multiplicidade 2"],
          ["raiz 4", "multiplicidade 1"],
        ],
        ["multiplicidade 2", "multiplicidade 1"],
        "O expoente de cada fator indica a multiplicidade da raiz correspondente.",
        "Trocar o sinal da raiz e também trocar seu expoente.",
      ),
      choice(
        "p10q3",
        "Um polinômio de grau 6 totalmente decomposto tem multiplicidades que somam:",
        ["3", "6", "12", "depende do número de raízes distintas"],
        1,
        "Contando repetições no conjunto complexo, as multiplicidades sempre somam o grau 6.",
        "Somar apenas as raízes distintas.",
      ),
      multi(
        "p10q4",
        "Sobre uma raiz real e seu gráfico, marque as associações corretas.",
        [
          "multiplicidade par: tende a tocar e voltar",
          "multiplicidade ímpar: tende a cruzar o eixo",
          "multiplicidade 2 é par",
          "toda raiz tem multiplicidade 1",
        ],
        [0, 1, 2],
        "Paridade controla a troca de sinal local; multiplicidade 2 é par e raízes podem se repetir.",
        "Achar que toda interseção com o eixo obrigatoriamente o atravessa.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 11,
    slug: "girard-ouve-os-coeficientes",
    title: "Girard ouve os coeficientes",
    shortTitle: "Girard",
    phase: "Raízes",
    duration: "25–30 min",
    source: "FME 6 — Capítulo III, p. 114–127",
    objective:
      "Obter somas e produtos de raízes diretamente dos coeficientes em graus 2 e 3.",
    why: "Nem toda pergunta quer as raízes individuais. Girard pega o atalho quando o enunciado só pede relações entre elas.",
    mnemonic: {
      label: "Alterna o sinal, divide pelo líder",
      chant:
        "Soma troca o sinal do segundo; produto segue o termo final e o grau.",
      meaning:
        "No quadrático, soma=−b/a e produto=c/a; no cúbico mônico, soma, pares e produto alternam sinais.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Grau 2",
        title: "Soma e produto",
        body: "Para ax²+bx+c=0, as raízes α e β satisfazem α+β=−b/a e αβ=c/a.",
        formula: "α+β=−b/a · αβ=c/a",
      },
      {
        eyebrow: "Grau 3",
        title: "Soma, pares, produto",
        body: "Para x³−Sx²+Px−R=0, S é a soma das raízes, P é a soma dos produtos aos pares e R é o produto.",
      },
      {
        eyebrow: "Estratégia",
        title: "Responda só o que foi pedido",
        body: "Se a questão pede soma ou produto, não gaste tempo resolvendo toda a equação.",
      },
    ],
    example: {
      prompt: "Sem resolver, obtenha soma e produto das raízes de 2x²−7x+3=0.",
      steps: [
        "Identifique a=2, b=−7 e c=3.",
        "Soma: −b/a=−(−7)/2=7/2.",
        "Produto: c/a=3/2.",
        "Não é necessário calcular cada raiz.",
      ],
      result: "Soma 7/2 e produto 3/2.",
    },
    questions: [
      match(
        "p11q1",
        "Para x²−7x+10=0, associe.",
        [
          ["soma das raízes", "7"],
          ["produto das raízes", "10"],
        ],
        ["7", "10"],
        "Pelas relações de Girard, soma=−(−7)=7 e produto=10.",
        "Usar o coeficiente −7 sem trocar o sinal da soma.",
      ),
      choice(
        "p11q2",
        "A equação mônica cujas raízes têm soma 5 e produto 6 é:",
        ["x²−5x+6=0", "x²+5x+6=0", "x²−6x+5=0", "x²+6x−5=0"],
        0,
        "Para soma S e produto P, a forma mônica é x²−Sx+P=0.",
        "Colocar a soma com sinal positivo no coeficiente de x.",
      ),
      match(
        "p11q3",
        "Para x³−6x²+11x−6=0, associe as relações.",
        [
          ["α+β+γ", "6 (soma)"],
          ["αβ+αγ+βγ", "11"],
          ["αβγ", "6 (produto)"],
        ],
        ["6 (soma)", "11", "6 (produto)"],
        "Na forma x³−Sx²+Px−R, lemos S=6, P=11 e R=6.",
        "Ler o termo final −6 como produto −6.",
      ),
      choice(
        "p11q4",
        "Se a pergunta pede apenas a soma das raízes de 3x²+12x−5=0, o atalho correto é:",
        ["−12/3=−4", "12/3=4", "−5/3", "usar Bhaskara obrigatoriamente"],
        0,
        "A soma é −b/a=−12/3=−4.",
        "Resolver a equação inteira quando uma relação direta basta.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 12,
    slug: "radar-de-raizes-racionais",
    title: "Radar de raízes racionais",
    shortTitle: "Candidatas",
    phase: "Raízes",
    duration: "25–30 min",
    source: "FME 6 — Capítulo III, p. 140–145",
    objective:
      "Gerar candidatos racionais, testá-los com P(a) e separar possibilidade de certeza.",
    why: "O teorema não entrega a raiz; ele reduz uma multidão infinita a uma pequena lista de suspeitos.",
    mnemonic: {
      label: "Final sobre inicial",
      chant:
        "Candidato é divisor do final sobre divisor do inicial; testa antes de comemorar.",
      meaning:
        "Para coeficientes inteiros, p/q em forma irredutível exige p divisor do termo constante e q divisor do líder.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Teorema",
        title: "Lista finita de candidatos",
        body: "Se p/q é raiz racional irredutível, p divide o termo constante e q divide o coeficiente líder.",
        formula: "candidatos ± divisores(a₀) / divisores(aₙ)",
      },
      {
        eyebrow: "Caso mônico",
        title: "Inteiros que dividem a constante",
        body: "Quando o líder é 1, toda raiz racional possível é inteira e divide o termo constante.",
      },
      {
        eyebrow: "Teste",
        title: "Candidato não é culpado",
        body: "Cada candidato precisa ser substituído em P. Somente P(a)=0 confirma uma raiz.",
      },
    ],
    example: {
      prompt: "Liste e teste uma raiz de P(x)=x³−6x²+11x−6.",
      steps: [
        "Como P é mônico, os candidatos inteiros dividem −6.",
        "Lista: ±1, ±2, ±3, ±6.",
        "Teste 1: P(1)=1−6+11−6=0.",
        "Logo, 1 é raiz e x−1 é fator.",
      ],
      result: "1 é uma raiz confirmada; a lista continua sendo apenas radar.",
    },
    questions: [
      choice(
        "p12q1",
        "Qual número NÃO é candidato racional para 2x³−3x²−8x+12=0?",
        ["3/2", "−2", "6", "5/2"],
        3,
        "O numerador deve dividir 12 e o denominador deve dividir 2; 5 não divide 12, então 5/2 é impossível.",
        "Aceitar qualquer fração com denominador 2.",
      ),
      multi(
        "p12q2",
        "Para x³−6x²+11x−6=0, quais são candidatos inteiros positivos?",
        ["1", "2", "3", "5", "6"],
        [0, 1, 2, 4],
        "Como o polinômio é mônico, os candidatos inteiros positivos são os divisores de 6: 1, 2, 3 e 6.",
        "Incluir 5 só porque está próximo do termo constante.",
      ),
      choice(
        "p12q3",
        "Para P(x)=x³−2x²−5x+6, o teste de x=1 produz:",
        ["P(1)=0", "P(1)=1", "P(1)=−2", "P(1)=6"],
        0,
        "P(1)=1−2−5+6=0; portanto 1 é raiz.",
        "Somar os módulos e ignorar os sinais.",
      ),
      choice(
        "p12q4",
        "O Teorema das Raízes Racionais garante que:",
        [
          "todo candidato é raiz",
          "toda raiz é inteira",
          "uma raiz racional, se existir, está entre os candidatos",
          "todo polinômio tem raiz racional",
        ],
        2,
        "O teorema fornece uma condição necessária: a raiz racional precisa estar na lista, mas a lista pode ter falsos suspeitos.",
        "Confundir lista de possibilidades com conjunto solução.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 13,
    slug: "caca-as-raizes",
    title: "Caça às raízes",
    shortTitle: "Caçada",
    phase: "Raízes",
    duration: "25–30 min",
    source: "FME 6 — Capítulos II–III, p. 80–145",
    objective:
      "Encadear candidatos, teste do resto, Ruffini e fatoração para resolver uma cúbica inteira.",
    why: "Agora as ferramentas deixam de ser capítulos separados e viram um protocolo único de caça.",
    mnemonic: {
      label: "L.T.D.F.",
      chant: "Lista, testa, divide, fatora: uma raiz abre a porta das outras.",
      meaning:
        "Liste candidatos, confirme com P(a), reduza o grau com Ruffini e resolva o quociente.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Passo 1",
        title: "Liste poucos suspeitos",
        body: "Use o teorema das raízes racionais para gerar uma lista controlada.",
      },
      {
        eyebrow: "Passos 2 e 3",
        title: "Teste e reduza o grau",
        body: "Ao encontrar P(a)=0, divida por x−a usando Ruffini.",
      },
      {
        eyebrow: "Passo 4",
        title: "Fatore o que sobrou",
        body: "Resolva o quociente por fatoração ou fórmula adequada e confira o número de raízes com o grau.",
      },
    ],
    example: {
      prompt: "Resolva x³−4x²+x+6=0.",
      steps: [
        "Candidatos inteiros: ±1, ±2, ±3, ±6.",
        "Teste −1: −1−4−1+6=0; logo, −1 é raiz.",
        "Ruffini por x+1 produz x²−5x+6.",
        "Fatore: x²−5x+6=(x−2)(x−3).",
      ],
      result: "S={−1,2,3}.",
    },
    questions: [
      multi(
        "p13q1",
        "Quais são candidatos inteiros para x³−4x²+x+6=0?",
        ["−1", "2", "3", "5", "6"],
        [0, 1, 2, 4],
        "Os candidatos inteiros dividem 6; −1, 2, 3 e 6 pertencem à lista, enquanto 5 não.",
        "Confundir candidato com raiz já confirmada.",
      ),
      choice(
        "p13q2",
        "Para P(x)=x³−4x²+x+6, qual teste zera o polinômio?",
        ["P(−1)", "P(0)", "P(4)", "P(5)"],
        0,
        "P(−1)=−1−4−1+6=0, confirmando a raiz −1.",
        "Escolher o coeficiente 4 como se fosse raiz.",
      ),
      choice(
        "p13q3",
        "Dividindo P por x+1, o quociente é:",
        ["x²−5x+6", "x²−3x−2", "x²+5x+6", "x²−4x+1"],
        0,
        "Ruffini com a=−1 sobre [1,−4,1,6] produz [1,−5,6] e resto zero.",
        "Usar a=1 apesar do divisor ser x+1.",
      ),
      multi(
        "p13q4",
        "Quais são todas as raízes de x³−4x²+x+6=0?",
        ["−1", "1", "2", "3"],
        [0, 2, 3],
        "P=(x+1)(x−2)(x−3), então as raízes são −1, 2 e 3.",
        "Trocar os sinais dos fatores ou incluir 1 sem teste.",
      ),
    ],
  },
  {
    campaign: "poly",
    day: 14,
    slug: "boss-da-forja",
    title: "Boss da Forja",
    shortTitle: "Boss Polinomial",
    phase: "Domínio",
    duration: "30–35 min",
    source: "Revisão autoral — FME 6, capítulos II–III",
    objective:
      "Combinar leitura, operações, divisão, fatoração, raízes e Girard sem receber o método pronto.",
    why: "Chegar tinindo não é decorar quatorze truques: é reconhecer qual ferramenta derruba cada defesa do problema.",
    mnemonic: {
      label: "Protocolo T.I.N.I.N.D.O.",
      chant:
        "Termos, identidade, nível, inspeção, número-raiz, divisão e operação final.",
      meaning:
        "Leia os termos, organize a identidade, estime o grau, inspecione candidatos, confirme a raiz, divida e finalize.",
    },
    visual: "polynomial",
    blocks: [
      {
        eyebrow: "Diagnóstico",
        title: "O enunciado escolhe a arma",
        body: "Valor numérico pede substituição; divisibilidade pede resto; soma de raízes pede Girard; solução completa pede fatoração.",
      },
      {
        eyebrow: "Controle",
        title: "Grau é contador de peças",
        body: "Use o grau para conferir termo líder, grau do quociente e total de raízes com multiplicidade.",
      },
      {
        eyebrow: "Fechamento",
        title: "Reconstrua para verificar",
        body: "Multiplique os fatores ou use D=dq+r. Uma solução boa termina com uma checagem curta.",
      },
    ],
    example: {
      prompt: "Resolva x³−2x²−5x+6=0 e confira por Girard.",
      steps: [
        "Candidatos inteiros: ±1, ±2, ±3, ±6; P(1)=0.",
        "Ruffini por x−1 produz x²−x−6.",
        "Fatore o quociente: (x−3)(x+2).",
        "Raízes: 1, 3 e −2; soma 2, igual ao oposto do coeficiente −2.",
      ],
      result: "S={−2,1,3}; decomposição (x+2)(x−1)(x−3).",
    },
    questions: [
      match(
        "p14q1",
        "Faça o raio-X de P(x)=2x⁴−3x²+7.",
        [
          ["grau", "4"],
          ["coeficiente líder", "2"],
          ["P(0)", "7"],
        ],
        ["4", "2", "7"],
        "A maior potência é 4, seu coeficiente é 2 e P(0) revela a constante 7.",
        "Usar a quantidade de termos como grau.",
      ),
      choice(
        "p14q2",
        "O resto de 2x³−3x²−8x+12 por x−2 é:",
        ["0", "2", "−2", "12"],
        0,
        "P(2)=16−12−16+12=0; portanto x−2 é fator.",
        "Parar a soma antes de incluir o termo constante.",
      ),
      multi(
        "p14q3",
        "Quais são as raízes de x³−2x²−5x+6=0?",
        ["−2", "1", "2", "3"],
        [0, 1, 3],
        "O polinômio se decompõe como (x+2)(x−1)(x−3), dando −2, 1 e 3.",
        "Incluir todo candidato testado como se fosse raiz.",
      ),
      multi(
        "p14q4",
        "Quais verificações pertencem ao protocolo final polinomial?",
        [
          "graus e termo líder são compatíveis",
          "cada raiz zera P",
          "multiplicidades somam o grau",
          "todo candidato racional deve ser raiz",
        ],
        [0, 1, 2],
        "Grau, líder, substituição e multiplicidade são controles objetivos; candidatos racionais ainda precisam de teste.",
        "Transformar uma lista de candidatos em gabarito automático.",
      ),
    ],
  },
];

export const totalPolynomialQuestions = polynomialMissions.reduce(
  (total, mission) => total + mission.questions.length,
  0,
);
