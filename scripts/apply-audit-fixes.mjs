import { readFileSync, writeFileSync } from "node:fs";

function read(path) {
  return readFileSync(path, "utf8");
}

function write(path, content) {
  writeFileSync(path, content.replace(/\r\n/g, "\n"));
}

function replaceOnce(path, from, to) {
  const content = read(path);
  if (!content.includes(from)) {
    throw new Error(`Trecho não encontrado em ${path}: ${from.slice(0, 120)}`);
  }
  write(path, content.replace(from, to));
}

function replaceAllChecked(path, from, to, minimum = 1) {
  const content = read(path);
  const count = content.split(from).length - 1;
  if (count < minimum) {
    throw new Error(`Esperava ao menos ${minimum} ocorrência(s) em ${path}: ${from}`);
  }
  write(path, content.split(from).join(to));
}

const questionDeck = String.raw`import { useMemo, useState } from "react";
import type { Mission } from "@/data/types";
import { isAnswerComplete, isAnswerCorrect, type Answer } from "@/lib/answers";

type QuestionDeckProps = {
  mission: Mission;
  previous: Record<string, { correct: boolean }>;
  onResult: (questionId: string, correct: boolean) => void;
  onFinish: () => void;
};

function initialQuestionIndex(
  mission: Mission,
  previous: Record<string, { correct: boolean }>,
) {
  const firstWrong = mission.questions.findIndex(
    (item) => previous[item.id] && !previous[item.id].correct,
  );
  if (firstWrong >= 0) return firstWrong;

  const firstPending = mission.questions.findIndex((item) => !previous[item.id]);
  return firstPending >= 0 ? firstPending : 0;
}

export default function QuestionDeck({
  mission,
  previous,
  onResult,
  onFinish,
}: QuestionDeckProps) {
  const [index, setIndex] = useState(() =>
    initialQuestionIndex(mission, previous),
  );
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [whyOpen, setWhyOpen] = useState<Record<string, boolean>>({});
  const question = mission.questions[index];
  const answer = answers[question.id];
  const revealed = checked[question.id];
  const correct =
    revealed && answer ? isAnswerCorrect(question, answer) : false;
  const answeredCount = useMemo(
    () =>
      mission.questions.filter((item) => checked[item.id] || previous[item.id])
        .length,
    [checked, mission.questions, previous],
  );
  const remainingCount = mission.questions.length - answeredCount;

  function setAnswer(value: Answer) {
    if (revealed) return;
    setAnswers((current) => ({ ...current, [question.id]: value }));
  }

  function check() {
    if (!answer || !isAnswerComplete(question, answer)) return;
    const result = isAnswerCorrect(question, answer);
    setChecked((current) => ({ ...current, [question.id]: true }));
    setWhyOpen((current) => ({
      ...current,
      [question.id]: !result,
    }));
    onResult(question.id, result);
  }

  function retry() {
    setAnswers((current) => {
      const next = { ...current };
      delete next[question.id];
      return next;
    });
    setChecked((current) => {
      const next = { ...current };
      delete next[question.id];
      return next;
    });
    setWhyOpen((current) => ({ ...current, [question.id]: false }));
  }

  function next() {
    if (index < mission.questions.length - 1) setIndex((value) => value + 1);
    else if (remainingCount === 0) onFinish();
    else {
      const firstPending = mission.questions.findIndex(
        (item) => !checked[item.id] && !previous[item.id],
      );
      setIndex(firstPending >= 0 ? firstPending : 0);
    }
  }

  function selectedForOption(optionId: string) {
    if (question.type === "choice") return answer === optionId;
    if (question.type === "multi")
      return Array.isArray(answer) && answer.includes(optionId);
    return false;
  }

  function correctOption(optionId: string) {
    if (question.type === "choice") return question.correctId === optionId;
    if (question.type === "multi") return question.correctIds.includes(optionId);
    return false;
  }

  function optionClass(optionId: string) {
    const selected = selectedForOption(optionId);
    if (!revealed) return selected ? "selected" : "";

    const shouldBeSelected = correctOption(optionId);
    if (selected && shouldBeSelected) return "is-correct";
    if (selected && !shouldBeSelected) return "is-wrong";
    if (!selected && shouldBeSelected) return "is-missed";
    return "";
  }

  function optionMarker(optionId: string) {
    const selected = selectedForOption(optionId);
    if (revealed && correctOption(optionId)) return "✓";
    if (revealed && selected) return "×";
    if (question.type === "multi" && selected) return "✓";
    return optionId.toUpperCase();
  }

  function feedbackTitle() {
    if (correct) return "Órbita estável.";

    if (question.type === "multi") {
      const selected = Array.isArray(answer) ? answer : [];
      const hits = selected.filter((id) => question.correctIds.includes(id)).length;
      const extras = selected.length - hits;
      if (extras === 0) {
        return (
          "Quase — você marcou " +
          hits +
          " de " +
          question.correctIds.length +
          " respostas corretas."
        );
      }
      return (
        "Ajuste: " +
        hits +
        " de " +
        question.correctIds.length +
        " corretas e " +
        extras +
        (extras === 1 ? " marcação indevida." : " marcações indevidas.")
      );
    }

    if (question.type === "match") {
      const matchAnswer: Record<string, string> =
        answer && typeof answer === "object" && !Array.isArray(answer)
          ? answer
          : {};
      const hits = question.rows.filter(
        (row) => matchAnswer[row.id] === row.correctOptionId,
      ).length;
      return hits + " de " + question.rows.length + " associações corretas.";
    }

    return "Ainda não — a alternativa correta está destacada.";
  }

  return (
    <section className="question-deck" aria-labelledby="practice-title">
      <div className="deck-head">
        <div>
          <p className="kicker">Prática fechada</p>
          <h3 id="practice-title">
            Questão {index + 1} de {mission.questions.length}
          </h3>
        </div>
        <span>
          {answeredCount}/{mission.questions.length} verificadas
        </span>
      </div>
      <div
        className="deck-progress"
        role="progressbar"
        aria-label="Questões verificadas nesta missão"
        aria-valuemin={0}
        aria-valuemax={mission.questions.length}
        aria-valuenow={answeredCount}
      >
        <i
          style={{
            width:
              String((answeredCount / mission.questions.length) * 100) + "%",
          }}
        />
      </div>
      <article className="question-card">
        <p className="question-type">
          {question.type === "choice"
            ? "Escolha única"
            : question.type === "multi"
              ? "Marque todas as corretas"
              : "Associação"}
        </p>
        <h4>{question.prompt}</h4>
        {(question.type === "choice" || question.type === "multi") && (
          <div className="option-list">
            {question.options.map((option) => {
              const selected = selectedForOption(option.id);
              return (
                <button
                  key={option.id}
                  className={"answer-option " + optionClass(option.id)}
                  onClick={() => {
                    if (question.type === "choice") {
                      setAnswer(option.id);
                      return;
                    }
                    setAnswer(
                      selected
                        ? (answer as string[]).filter((id) => id !== option.id)
                        : [
                            ...(Array.isArray(answer) ? answer : []),
                            option.id,
                          ],
                    );
                  }}
                  disabled={revealed}
                  aria-pressed={selected}
                >
                  <span>{optionMarker(option.id)}</span>
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
        {question.type === "match" && (
          <div className="match-list">
            {question.rows.map((row) => {
              const matchAnswer: Record<string, string> =
                answer && typeof answer === "object" && !Array.isArray(answer)
                  ? answer
                  : {};
              const rowAnswer = matchAnswer[row.id] ?? "";
              const rowCorrect = rowAnswer === row.correctOptionId;
              const correctLabel =
                question.options.find(
                  (option) => option.id === row.correctOptionId,
                )?.label ?? "";
              return (
                <label
                  key={row.id}
                  className={
                    revealed ? (rowCorrect ? "is-correct" : "is-wrong") : ""
                  }
                >
                  <strong>{row.left}</strong>
                  <select
                    value={rowAnswer}
                    onChange={(event) =>
                      setAnswer({
                        ...matchAnswer,
                        [row.id]: event.target.value,
                      })
                    }
                    disabled={revealed}
                  >
                    <option value="">Escolha…</option>
                    {question.options.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {revealed && !rowCorrect && (
                    <small className="match-correction">
                      Correto: {correctLabel}
                    </small>
                  )}
                </label>
              );
            })}
          </div>
        )}
        {!revealed ? (
          <button
            className="primary-action"
            onClick={check}
            disabled={!isAnswerComplete(question, answer)}
          >
            Conferir resposta
          </button>
        ) : (
          <div
            className={"feedback " + (correct ? "correct" : "wrong")}
            role="status"
          >
            <strong>{feedbackTitle()}</strong>
            {correct && (
              <button
                className="why-toggle"
                onClick={() =>
                  setWhyOpen((current) => ({
                    ...current,
                    [question.id]: !current[question.id],
                  }))
                }
                aria-expanded={Boolean(whyOpen[question.id])}
              >
                Por quê?
              </button>
            )}
            {(whyOpen[question.id] || !correct) && (
              <div className="why-answer">
                <p>{question.explanation}</p>
                <div>
                  <b>Armadilha:</b> {question.trap}
                </div>
              </div>
            )}
            <div className="feedback-actions">
              {!correct && (
                <button className="ghost-action retry-action" onClick={retry}>
                  Tentar novamente
                </button>
              )}
              <button className="primary-action" onClick={next}>
                {index === mission.questions.length - 1
                  ? remainingCount === 0
                    ? "Concluir missão"
                    : "Revisar " +
                      remainingCount +
                      " pendente" +
                      (remainingCount === 1 ? "" : "s")
                  : "Próxima questão"}
              </button>
            </div>
          </div>
        )}
      </article>
      <div className="question-dots" aria-label="Navegação das questões">
        {mission.questions.map((item, itemIndex) => (
          <button
            key={item.id}
            onClick={() => setIndex(itemIndex)}
            className={
              (itemIndex === index ? "active " : "") +
              (checked[item.id] || previous[item.id] ? "answered" : "")
            }
            aria-current={itemIndex === index ? "true" : undefined}
            aria-label={
              "Ir para questão " +
              (itemIndex + 1) +
              (checked[item.id] || previous[item.id]
                ? ", verificada"
                : ", pendente")
            }
          />
        ))}
      </div>
    </section>
  );
}
`;

write("src/components/QuestionDeck.tsx", questionDeck);

replaceOnce(
  "src/components/OrbitApp.tsx",
  `{progress.completedDays.length}/14 concluídas · 55–70 min`,
  `{progress.completedDays.length}/14 concluídas · 55–90 min`,
);
replaceOnce(
  "src/components/OrbitApp.tsx",
  `{progress.polyCompletedDays.length}/14 concluídas · 20–30 min`,
  `{progress.polyCompletedDays.length}/14 concluídas · 20–35 min`,
);
replaceOnce(
  "src/components/OrbitApp.tsx",
  `105–125`,
  `100–125`,
);

replaceOnce(
  "src/components/LessonVisual.tsx",
  `text="assíntota = buraco"`,
  `text="assíntota vertical"`,
);

replaceOnce(
  "src/data/missions.ts",
  `title: "Período π e buracos",\n        body: "tg x repete em π e não existe em π/2+kπ, onde cos x=0."`,
  `title: "Período π e assíntotas verticais",\n        body: "tg x repete em π e não existe em π/2+kπ, onde cos x=0. Nesses pontos, o gráfico possui assíntotas verticais."`,
);
replaceAllChecked(
  "src/data/missions.ts",
  `sen2a=2sen a cos a`,
  `sen(2a)=2 sen a cos a`,
);
replaceOnce(
  "src/data/missions.ts",
  `Em x=0, sen0=0 e cos0=1; ambas as funções repetem o desenho após uma volta.`,
  `Em x=0, sen(0)=0 e cos(0)=1; ambas as funções repetem o desenho após uma volta.`,
);
replaceOnce(
  "src/data/missions.ts",
  `"Associe o quadrante à fórmula de referência para 0°<α<90°.",\n        [\n          ["QII", "180°-θ"],\n          ["QIII", "θ-180°"],\n          ["QIV", "360°-θ"],\n        ],\n        ["180°-θ", "θ-180°", "360°-θ"],`,
  `"Associe cada quadrante à expressão do ângulo de referência α, com 0°<α<90°.",\n        [\n          ["QII", "α=180°-θ"],\n          ["QIII", "α=θ-180°"],\n          ["QIV", "α=360°-θ"],\n        ],\n        ["α=180°-θ", "α=θ-180°", "α=360°-θ"],`,
);
replaceOnce(
  "src/data/missions.ts",
  `"Em uma volta, sen x>0 em:",`,
  `"Em [0,2π], sen x>0 em:",`,
);
replaceOnce(
  "src/data/missions.ts",
  `"Em uma volta, cos x<0 em:",`,
  `"Em [0,2π], cos x<0 em:",`,
);

replaceOnce(
  "src/data/missions.ts",
  `      choice(\n        "d5q2",\n        "150° em radianos é:",\n        ["π/6", "2π/3", "5π/6", "3π/2"],\n        2,\n        "150π/180 = 5π/6.",\n        "Simplificar 150/180 incorretamente.",\n      ),`,
  `      choice(\n        "d5q2",\n        "210° em radianos é:",\n        ["π/6", "2π/3", "7π/6", "3π/2"],\n        2,\n        "210π/180 = 7π/6.",\n        "Simplificar 210/180 incorretamente.",\n      ),`,
);
replaceOnce(
  "src/data/missions.ts",
  `      choice(\n        "d11q6",\n        "sen 75° vale:",\n        ["(√6-√2)/4", "(√6+√2)/4", "√3/2", "1/2"],\n        1,\n        "Use 75°=45°+30° na fórmula da soma do seno.",\n        "Trocar soma por diferença.",\n      ),`,
  `      choice(\n        "d11q6",\n        "cos 75° vale:",\n        ["(√6-√2)/4", "(√6+√2)/4", "√3/2", "1/2"],\n        0,\n        "Use 75°=45°+30° e cos(a+b)=cos a cos b-sen a sen b.",\n        "Manter o sinal positivo como na fórmula do seno.",\n      ),`,
);
replaceOnce(
  "src/data/missions.ts",
  `      choice(\n        "d13q1",\n        "sen x=1/2 em [0,2π] tem soluções:",\n        ["π/6 apenas", "π/6 e 5π/6", "π/6 e 7π/6", "5π/6 e 11π/6"],\n        1,\n        "Seno é positivo nos quadrantes I e II.",\n        "Dar apenas a solução principal.",\n      ),`,
  `      choice(\n        "d13q1",\n        "sen x=√3/2 em [0,2π] tem soluções:",\n        ["π/3 apenas", "π/3 e 2π/3", "π/3 e 4π/3", "2π/3 e 5π/3"],\n        1,\n        "A referência é π/3 e o seno é positivo nos quadrantes I e II.",\n        "Dar apenas a solução principal ou usar quadrantes de seno negativo.",\n      ),`,
);
replaceOnce(
  "src/data/missions.ts",
  `      choice(\n        "d14q6",\n        "(1-sen²x)/cos x, com cos x≠0, simplifica para:",\n        ["sen x", "cos x", "tg x", "1"],\n        1,\n        "1-sen²x=cos²x; cos²x/cos x=cos x.",\n        "Cancelar dentro de uma soma antes de substituir.",\n      ),`,
  `      choice(\n        "d14q6",\n        "Se sen x=3/5 e x está no QII, cos x vale:",\n        ["4/5", "-4/5", "3/4", "-3/4"],\n        1,\n        "Da identidade, cos²x=1-9/25=16/25. No QII, o cosseno é negativo: cos x=-4/5.",\n        "Tirar a raiz e esquecer que o quadrante decide o sinal.",\n      ),`,
);

replaceOnce(
  "src/data/polynomialMissions.ts",
  `body: "Em gráficos reais, uma raiz de multiplicidade ímpar costuma atravessar o eixo; de multiplicidade par, tocar e voltar."`,
  `body: "Em polinômios reais, uma raiz de multiplicidade ímpar cruza o eixo; uma raiz de multiplicidade par toca o eixo e retorna."`,
);
replaceOnce(
  "src/data/polynomialMissions.ts",
  `"multiplicidade par: tende a tocar e voltar",\n          "multiplicidade ímpar: tende a cruzar o eixo",`,
  `"multiplicidade par: toca o eixo e retorna",\n          "multiplicidade ímpar: cruza o eixo",`,
);
replaceOnce(
  "src/data/polynomialMissions.ts",
  `"Para x³−6x²+11x−6=0, quais são candidatos inteiros positivos?",`,
  `"Entre as opções, quais são candidatos inteiros positivos para x³−6x²+11x−6=0?",`,
);
replaceOnce(
  "src/data/polynomialMissions.ts",
  `      multi(\n        "p13q1",\n        "Quais são candidatos inteiros para x³−4x²+x+6=0?",\n        ["−1", "2", "3", "5", "6"],\n        [0, 1, 2, 4],\n        "Os candidatos inteiros dividem 6; −1, 2, 3 e 6 pertencem à lista, enquanto 5 não.",\n        "Confundir candidato com raiz já confirmada.",\n      ),\n      choice(\n        "p13q2",\n        "Para P(x)=x³−4x²+x+6, qual teste zera o polinômio?",\n        ["P(−1)", "P(0)", "P(4)", "P(5)"],\n        0,\n        "P(−1)=−1−4−1+6=0, confirmando a raiz −1.",\n        "Escolher o coeficiente 4 como se fosse raiz.",\n      ),\n      choice(\n        "p13q3",\n        "Dividindo P por x+1, o quociente é:",\n        ["x²−5x+6", "x²−3x−2", "x²+5x+6", "x²−4x+1"],\n        0,\n        "Ruffini com a=−1 sobre [1,−4,1,6] produz [1,−5,6] e resto zero.",\n        "Usar a=1 apesar do divisor ser x+1.",\n      ),\n      multi(\n        "p13q4",\n        "Quais são todas as raízes de x³−4x²+x+6=0?",\n        ["−1", "1", "2", "3"],\n        [0, 2, 3],\n        "P=(x+1)(x−2)(x−3), então as raízes são −1, 2 e 3.",\n        "Trocar os sinais dos fatores ou incluir 1 sem teste.",\n      ),`,
  `      multi(\n        "p13q1",\n        "Entre as opções, quais são candidatos inteiros para x³+x²−4x−4=0?",\n        ["−1", "2", "3", "4", "5"],\n        [0, 1, 3],\n        "Os candidatos inteiros dividem 4; −1, 2 e 4 pertencem à lista, enquanto 3 e 5 não.",\n        "Confundir candidato com raiz já confirmada.",\n      ),\n      choice(\n        "p13q2",\n        "Para P(x)=x³−3x²−4x+12, qual teste zera o polinômio?",\n        ["P(2)", "P(0)", "P(1)", "P(5)"],\n        0,\n        "P(2)=8−12−8+12=0, confirmando a raiz 2.",\n        "Escolher um coeficiente ou o termo constante como se fosse raiz.",\n      ),\n      choice(\n        "p13q3",\n        "Dividindo x³+x²−4x−4 por x+1, o quociente é:",\n        ["x²−4", "x²+4", "x²−2x−4", "x²+x−4"],\n        0,\n        "Ruffini com a=−1 sobre [1,1,−4,−4] produz [1,0,−4] e resto zero.",\n        "Usar a=1 apesar do divisor ser x+1.",\n      ),\n      multi(\n        "p13q4",\n        "Quais são todas as raízes de x³−2x²−x+2=0?",\n        ["−1", "1", "2", "3"],\n        [0, 1, 2],\n        "P=(x+1)(x−1)(x−2), então as raízes são −1, 1 e 2.",\n        "Incluir 3 sem teste ou trocar os sinais dos fatores.",\n      ),`,
);
replaceOnce(
  "src/data/polynomialMissions.ts",
  `      multi(\n        "p14q3",\n        "Quais são as raízes de x³−2x²−5x+6=0?",\n        ["−2", "1", "2", "3"],\n        [0, 1, 3],\n        "O polinômio se decompõe como (x+2)(x−1)(x−3), dando −2, 1 e 3.",\n        "Incluir todo candidato testado como se fosse raiz.",\n      ),`,
  `      multi(\n        "p14q3",\n        "Quais são as raízes de x³+x²−4x−4=0?",\n        ["−2", "−1", "1", "2"],\n        [0, 1, 3],\n        "Por agrupamento, P=(x+1)(x²−4)=(x+1)(x−2)(x+2), dando −2, −1 e 2.",\n        "Parar no primeiro fator ou incluir 1 por copiar o sinal.",\n      ),`,
);

replaceOnce(
  "tests/content.test.ts",
  `["d5q2", "5π/6"],`,
  `["d5q2", "7π/6"],`,
);
replaceOnce(
  "tests/content.test.ts",
  `["d11q6", "(√6+√2)/4"],`,
  `["d11q6", "(√6-√2)/4"],`,
);
replaceOnce(
  "tests/polynomials.test.ts",
  `["p13q3", "x²−5x+6"],`,
  `["p13q3", "x²−4"],`,
);

const cssPath = "src/styles/global.css";
const cssMarker = "/* Feedback pedagógico pós-auditoria */";
const css = read(cssPath);
if (!css.includes(cssMarker)) {
  write(
    cssPath,
    css + String.raw`

/* Feedback pedagógico pós-auditoria */
.answer-option.is-correct,
.answer-option.is-missed {
  border-color: rgba(100, 232, 162, 0.72);
  background: rgba(100, 232, 162, 0.11);
}
.answer-option.is-correct span,
.answer-option.is-missed span {
  color: #062216;
  background: var(--green);
}
.answer-option.is-missed {
  box-shadow: inset 0 0 0 1px rgba(100, 232, 162, 0.2);
}
.answer-option.is-wrong {
  border-color: rgba(255, 142, 161, 0.72);
  background: rgba(255, 142, 161, 0.11);
}
.answer-option.is-wrong span {
  color: #2a0710;
  background: var(--rose);
}
.match-list label.is-correct {
  border-color: rgba(100, 232, 162, 0.58);
  background: rgba(100, 232, 162, 0.06);
}
.match-list label.is-wrong {
  border-color: rgba(255, 142, 161, 0.58);
  background: rgba(255, 142, 161, 0.06);
}
.match-correction {
  grid-column: 2;
  color: var(--green);
  font-weight: 850;
}
.feedback-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}
.retry-action {
  min-height: 50px;
}
@media (max-width: 620px) {
  .feedback-actions {
    display: grid;
  }
  .feedback-actions > button {
    width: 100%;
  }
  .match-correction {
    grid-column: 1;
  }
}
`,
  );
}

const editorialTest = String.raw`import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { missions } from "../src/data/missions";
import { polynomialMissions } from "../src/data/polynomialMissions";

describe("auditoria editorial", () => {
  it("não chama assíntota vertical de buraco", () => {
    const visual = readFileSync("src/components/LessonVisual.tsx", "utf8");
    const corpus = JSON.stringify(missions);
    expect(visual).not.toContain("assíntota = buraco");
    expect(corpus).not.toContain("Período π e buracos");
  });

  it("evita repetir os exemplos mais críticos nas avaliações", () => {
    const trigById = new Map(
      missions.flatMap((mission) => mission.questions).map((q) => [q.id, q]),
    );
    const polyById = new Map(
      polynomialMissions
        .flatMap((mission) => mission.questions)
        .map((q) => [q.id, q]),
    );
    expect(trigById.get("d5q2")?.prompt).toContain("210°");
    expect(trigById.get("d13q1")?.prompt).toContain("√3/2");
    expect(polyById.get("p13q3")?.prompt).toContain("x³+x²−4x−4");
    expect(polyById.get("p14q3")?.prompt).not.toContain("x³−2x²−5x+6");
  });

  it("explicita intervalos e conjuntos parciais de alternativas", () => {
    const corpus = JSON.stringify([...missions, ...polynomialMissions]);
    expect(corpus).not.toContain("Em uma volta, sen x>0");
    expect(corpus).not.toContain("Em uma volta, cos x<0");
    expect(corpus).not.toContain(
      "Quais são candidatos inteiros para x³−4x²+x+6=0?",
    );
  });
});
`;
write("tests/editorial.test.ts", editorialTest);

console.log("Correções da auditoria aplicadas com sucesso.");
