import { describe, expect, it } from "vitest";
import { missions } from "../src/data/missions";
import { isAnswerComplete, isAnswerCorrect } from "../src/lib/answers";

describe("motor de respostas fechadas", () => {
  for (const question of missions.flatMap((mission) => mission.questions)) {
    it(`${question.id} aceita o gabarito e rejeita uma resposta incompleta`, () => {
      if (question.type === "choice") {
        expect(isAnswerCorrect(question, question.correctId)).toBe(true);
        const wrong = question.options.find(
          (option) => option.id !== question.correctId,
        );
        expect(wrong && isAnswerCorrect(question, wrong.id)).toBe(false);
        expect(isAnswerComplete(question, undefined)).toBe(false);
      }
      if (question.type === "multi") {
        expect(
          isAnswerCorrect(question, [...question.correctIds].reverse()),
        ).toBe(true);
        expect(isAnswerCorrect(question, question.correctIds.slice(0, 1))).toBe(
          false,
        );
        expect(isAnswerComplete(question, [])).toBe(false);
      }
      if (question.type === "match") {
        const correct = Object.fromEntries(
          question.rows.map((row) => [row.id, row.correctOptionId]),
        );
        expect(isAnswerCorrect(question, correct)).toBe(true);
        const incomplete = { ...correct };
        delete incomplete[question.rows[0].id];
        expect(isAnswerComplete(question, incomplete)).toBe(false);
      }
    });
  }
});
