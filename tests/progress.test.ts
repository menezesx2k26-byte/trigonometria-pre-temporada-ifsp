import { describe, expect, it } from "vitest";
import { dayScore, freshProgress } from "../src/lib/progress";

describe("progresso local", () => {
  it("começa limpo no dia 1", () => {
    const state = freshProgress();
    expect(state.activeDay).toBe(1);
    expect(state.completedDays).toEqual([]);
    expect(state.questionResults).toEqual({});
  });

  it("calcula domínio usando o total real de questões", () => {
    const state = freshProgress();
    state.questionResults = {
      a: { correct: true, attempts: 1, updatedAt: "2026-07-11" },
      b: { correct: true, attempts: 1, updatedAt: "2026-07-11" },
      c: { correct: false, attempts: 1, updatedAt: "2026-07-11" },
    };
    expect(dayScore(state, ["a", "b", "c", "d"])).toEqual({
      answered: 3,
      correct: 2,
      percent: 50,
    });
  });
});
