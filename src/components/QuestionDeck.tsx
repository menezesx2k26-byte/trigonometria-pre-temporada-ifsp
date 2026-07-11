import { useMemo, useState } from "react";
import type { Mission } from "@/data/types";
import { isAnswerComplete, isAnswerCorrect, type Answer } from "@/lib/answers";

type QuestionDeckProps = {
  mission: Mission;
  previous: Record<string, { correct: boolean }>;
  onResult: (questionId: string, correct: boolean) => void;
  onFinish: () => void;
};

export default function QuestionDeck({
  mission,
  previous,
  onResult,
  onFinish,
}: QuestionDeckProps) {
  const [index, setIndex] = useState(() => {
    const firstWrong = mission.questions.findIndex(
      (item) => previous[item.id] && !previous[item.id].correct,
    );
    return firstWrong >= 0 ? firstWrong : 0;
  });
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

  function setAnswer(value: Answer) {
    if (revealed) return;
    setAnswers((current) => ({ ...current, [question.id]: value }));
  }

  function check() {
    if (!answer || !isAnswerComplete(question, answer)) return;
    const result = isAnswerCorrect(question, answer);
    setChecked((current) => ({ ...current, [question.id]: true }));
    onResult(question.id, result);
  }

  function next() {
    if (index < mission.questions.length - 1) setIndex((value) => value + 1);
    else onFinish();
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
      <div className="deck-progress">
        <i
          style={{
            width: `${((index + 1) / mission.questions.length) * 100}%`,
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
        {question.type === "choice" && (
          <div className="option-list">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={`answer-option ${answer === option.id ? "selected" : ""}`}
                onClick={() => setAnswer(option.id)}
                disabled={revealed}
              >
                <span>{option.id.toUpperCase()}</span>
                {option.label}
              </button>
            ))}
          </div>
        )}
        {question.type === "multi" && (
          <div className="option-list">
            {question.options.map((option) => {
              const selected =
                Array.isArray(answer) && answer.includes(option.id);
              return (
                <button
                  key={option.id}
                  className={`answer-option ${selected ? "selected" : ""}`}
                  onClick={() =>
                    setAnswer(
                      selected
                        ? (answer as string[]).filter((id) => id !== option.id)
                        : [...(Array.isArray(answer) ? answer : []), option.id],
                    )
                  }
                  disabled={revealed}
                >
                  <span>{selected ? "✓" : option.id.toUpperCase()}</span>
                  {option.label}
                </button>
              );
            })}
          </div>
        )}
        {question.type === "match" && (
          <div className="match-list">
            {question.rows.map((row) => (
              <label key={row.id}>
                <strong>{row.left}</strong>
                <select
                  value={
                    (typeof answer === "object" && !Array.isArray(answer)
                      ? answer[row.id]
                      : "") ?? ""
                  }
                  onChange={(event) =>
                    setAnswer({
                      ...(typeof answer === "object" && !Array.isArray(answer)
                        ? answer
                        : {}),
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
              </label>
            ))}
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
            className={`feedback ${correct ? "correct" : "wrong"}`}
            role="status"
          >
            <strong>
              {correct ? "Órbita estável." : "Ajuste de trajetória."}
            </strong>
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
            {whyOpen[question.id] && (
              <div className="why-answer">
                <p>{question.explanation}</p>
                <div>
                  <b>Armadilha:</b> {question.trap}
                </div>
              </div>
            )}
            <button className="primary-action" onClick={next}>
              {index === mission.questions.length - 1
                ? "Fechar missão"
                : "Próxima questão"}
            </button>
          </div>
        )}
      </article>
      <div className="question-dots" aria-label="Navegação das questões">
        {mission.questions.map((item, itemIndex) => (
          <button
            key={item.id}
            onClick={() => setIndex(itemIndex)}
            className={`${itemIndex === index ? "active" : ""} ${checked[item.id] || previous[item.id] ? "answered" : ""}`}
            aria-label={`Ir para questão ${itemIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
