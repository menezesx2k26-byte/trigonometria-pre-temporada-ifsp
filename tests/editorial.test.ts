import { describe, expect, it } from "vitest";
import { missions } from "../src/data/missions";
import { polynomialMissions } from "../src/data/polynomialMissions";

describe("auditoria editorial", () => {
  it("usa a terminologia correta para assíntotas", () => {
    const corpus = JSON.stringify(missions);
    expect(corpus).not.toContain("Período π e buracos");
    expect(corpus).toContain("Período π e assíntotas verticais");
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
