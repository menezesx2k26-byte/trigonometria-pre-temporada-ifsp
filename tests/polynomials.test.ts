import { describe, expect, it } from "vitest";
import { missions } from "../src/data/missions";
import {
  polynomialMissions,
  totalPolynomialQuestions,
} from "../src/data/polynomialMissions";

describe("currículo da Forja Polinomial", () => {
  it("tem 14 side quests leves e 56 questões", () => {
    expect(polynomialMissions).toHaveLength(14);
    expect(polynomialMissions.map((mission) => mission.day)).toEqual(
      Array.from({ length: 14 }, (_, index) => index + 1),
    );
    expect(
      polynomialMissions.every((mission) => mission.campaign === "poly"),
    ).toBe(true);
    expect(
      polynomialMissions.every((mission) => mission.questions.length === 4),
    ).toBe(true);
    expect(totalPolynomialQuestions).toBe(56);
  });

  it("não colide IDs com a campanha trigonométrica", () => {
    const ids = [...missions, ...polynomialMissions].flatMap((mission) =>
      mission.questions.map((question) => question.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mantém lição, exemplo, mnemônico e fonte em todas as side quests", () => {
    for (const mission of polynomialMissions) {
      expect(mission.duration).toMatch(/20|25|30/);
      expect(mission.source).toContain("FME 6");
      expect(mission.blocks).toHaveLength(3);
      expect(mission.example.steps.length).toBeGreaterThanOrEqual(4);
      expect(mission.mnemonic.chant.length).toBeGreaterThan(20);
      expect(mission.visual).toBe("polynomial");
    }
  });

  it("tem gabaritos estruturalmente válidos e textos explicativos", () => {
    for (const mission of polynomialMissions) {
      for (const question of mission.questions) {
        if (question.type === "choice") {
          expect(
            question.options.some((option) => option.id === question.correctId),
            question.id,
          ).toBe(true);
        }
        if (question.type === "multi") {
          expect(question.correctIds.length, question.id).toBeGreaterThan(1);
          for (const id of question.correctIds) {
            expect(
              question.options.some((option) => option.id === id),
              question.id,
            ).toBe(true);
          }
        }
        if (question.type === "match") {
          for (const row of question.rows) {
            expect(
              question.options.some(
                (option) => option.id === row.correctOptionId,
              ),
              question.id + ":" + row.id,
            ).toBe(true);
          }
        }
        expect(
          new Set(question.options.map((option) => option.label)).size,
        ).toBe(question.options.length);
        expect(question.explanation.length, question.id).toBeGreaterThanOrEqual(
          20,
        );
        expect(question.trap.length, question.id).toBeGreaterThanOrEqual(15);
      }
    }
  });
});

describe("oráculo matemático sentinela da Forja", () => {
  const byId = new Map(
    polynomialMissions
      .flatMap((mission) => mission.questions)
      .map((question) => [question.id, question]),
  );

  it.each([
    ["p1q2", "−3"],
    ["p2q2", "2"],
    ["p3q2", "2x²+5x−7"],
    ["p4q3", "−6x⁶"],
    ["p5q3", "x²+x+1"],
    ["p6q3", "1"],
    ["p7q4", "2x²+x−6"],
    ["p8q4", "x²+x−2=0"],
    ["p9q3", "(x−2)(x−3)"],
    ["p10q1", "4"],
    ["p11q2", "x²−5x+6=0"],
    ["p12q1", "5/2"],
    ["p13q3", "x²−4"],
    ["p14q2", "0"],
  ])("%s conserva o resultado recalculado", (id, expectedLabel) => {
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
