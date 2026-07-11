import { describe, expect, it } from "vitest";
import { missions, totalQuestions } from "../src/data/missions";

describe("currículo Órbita 14", () => {
  it("tem exatamente 14 dias e 112 questões", () => {
    expect(missions).toHaveLength(14);
    expect(missions.map((mission) => mission.day)).toEqual(
      Array.from({ length: 14 }, (_, index) => index + 1),
    );
    expect(totalQuestions).toBe(112);
    expect(missions.every((mission) => mission.questions.length === 8)).toBe(
      true,
    );
  });

  it("usa apenas respostas fechadas", () => {
    const allowed = new Set(["choice", "multi", "match"]);
    for (const mission of missions) {
      for (const question of mission.questions)
        expect(allowed.has(question.type)).toBe(true);
    }
  });

  it("tem IDs únicos", () => {
    const ids = missions.flatMap((mission) =>
      mission.questions.map((question) => question.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("tem gabaritos estruturalmente válidos", () => {
    for (const mission of missions) {
      for (const question of mission.questions) {
        if (question.type === "choice") {
          expect(
            question.options.some((option) => option.id === question.correctId),
            question.id,
          ).toBe(true);
        }
        if (question.type === "multi") {
          expect(question.correctIds.length, question.id).toBeGreaterThan(1);
          for (const id of question.correctIds)
            expect(
              question.options.some((option) => option.id === id),
              question.id,
            ).toBe(true);
        }
        if (question.type === "match") {
          for (const row of question.rows)
            expect(
              question.options.some(
                (option) => option.id === row.correctOptionId,
              ),
              `${question.id}:${row.id}`,
            ).toBe(true);
        }
        expect(
          new Set(question.options.map((option) => option.label)).size,
          question.id,
        ).toBe(question.options.length);
        expect(
          question.explanation.trim().length,
          question.id,
        ).toBeGreaterThanOrEqual(15);
        expect(question.trap.trim().length, question.id).toBeGreaterThan(8);
      }
    }
  });

  it("não contém moldes genéricos nem erros editoriais conhecidos", () => {
    const corpus = JSON.stringify(missions);
    for (const forbidden of [
      "Escreva a ideia central",
      "qual é o papel de",
      "Qual érro",
      "Qual éxpress",
      "ignorar o a base",
      "short-answer",
      "numeric-input",
      "extranhas",
    ])
      expect(corpus).not.toContain(forbidden);
  });

  it("mantém páginas de referência sem copiar o livro", () => {
    for (const mission of missions) {
      expect(mission.source.length).toBeGreaterThan(10);
      expect(mission.blocks).toHaveLength(3);
      expect(mission.example.steps.length).toBeGreaterThanOrEqual(3);
      expect(mission.mnemonic.chant.length).toBeGreaterThan(15);
    }
  });
});

describe("checagens matemáticas sentinela", () => {
  const byId = new Map(
    missions
      .flatMap((mission) => mission.questions)
      .map((question) => [question.id, question]),
  );

  it.each([
    ["d1q3", "180°"],
    ["d3q5", "3/5"],
    ["d4q1", "1/2"],
    ["d5q2", "5π/6"],
    ["d6q4", "cos θ=0"],
    ["d7q4", "1+tg²θ=sec²θ"],
    ["d8q5", "-√3/2"],
    ["d9q3", "2π"],
    ["d10q4", "π"],
    ["d11q6", "(√6+√2)/4"],
    ["d12q4", "1"],
    ["d13q3", "π/4 e 5π/4"],
    ["d14q4", "-1/2"],
  ])("%s mantém o gabarito esperado", (id, expectedLabel) => {
    const question = byId.get(id);
    expect(question?.type).toBe("choice");
    if (question?.type === "choice") {
      expect(
        question.options.find((option) => option.id === question.correctId)
          ?.label,
      ).toBe(expectedLabel);
    }
  });
});
