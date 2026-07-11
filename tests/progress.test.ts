import { describe, expect, it } from "vitest";
import { completeMission, dayScore, freshProgress } from "../src/lib/progress";

describe("progresso local", () => {
  it("começa limpo no dia 1", () => {
    const state = freshProgress();
    expect(state.activeDay).toBe(1);
    expect(state.completedDays).toEqual([]);
    expect(state.polyActiveDay).toBe(1);
    expect(state.polyCompletedDays).toEqual([]);
    expect(state.questionResults).toEqual({});
  });

  it("não conclui uma missão com questões pendentes", () => {
    const state = freshProgress();
    state.questionResults = {
      q4: { correct: true, attempts: 1, updatedAt: "2026-07-11" },
    };
    const next = completeMission(state, "poly", 1, ["q1", "q2", "q3", "q4"]);
    expect(next).toBe(state);
    expect(next.polyCompletedDays).toEqual([]);
  });

  it("conclui e domina a campanha correta quando todas foram verificadas", () => {
    const state = freshProgress();
    state.questionResults = Object.fromEntries(
      ["q1", "q2", "q3", "q4"].map((id) => [
        id,
        { correct: true, attempts: 1, updatedAt: "2026-07-11" },
      ]),
    );
    const next = completeMission(
      state,
      "poly",
      1,
      ["q1", "q2", "q3", "q4"],
      "2026-07-12",
    );
    expect(next.polyCompletedDays).toEqual([1]);
    expect(next.polyMasteredDays).toEqual([1]);
    expect(next.polyActiveDay).toBe(2);
    expect(next.completedDays).toEqual([]);
  });

  it("remove domínio atual quando uma nova tentativa cai abaixo de 75%", () => {
    const state = freshProgress();
    state.polyCompletedDays = [1];
    state.polyMasteredDays = [1];
    state.questionResults = {
      q1: { correct: true, attempts: 2, updatedAt: "2026-07-11" },
      q2: { correct: true, attempts: 2, updatedAt: "2026-07-11" },
      q3: { correct: false, attempts: 2, updatedAt: "2026-07-11" },
      q4: { correct: false, attempts: 2, updatedAt: "2026-07-11" },
    };
    const next = completeMission(state, "poly", 1, ["q1", "q2", "q3", "q4"]);
    expect(next.polyCompletedDays).toEqual([1]);
    expect(next.polyMasteredDays).toEqual([]);
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
