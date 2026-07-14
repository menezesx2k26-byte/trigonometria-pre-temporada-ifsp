import { useMemo, useState } from "react";
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
