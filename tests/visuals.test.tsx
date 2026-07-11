import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import LessonVisual from "../src/components/LessonVisual";
import { missions } from "../src/data/missions";

const rendered = missions.map((mission) => ({
  mission,
  markup: renderToStaticMarkup(<LessonVisual mission={mission} />),
}));

describe("mapas visuais das missões", () => {
  it.each(rendered)(
    "dia $mission.day renderiza um SVG acessível e íntegro",
    ({ mission, markup }) => {
      expect(markup).toContain("<svg");
      expect(markup).toContain(`visual-title-${mission.day}`);
      expect(markup).toContain(`visual-description-${mission.day}`);
      expect(markup).not.toContain("NaN");
      expect(markup).not.toContain("undefined");
    },
  );

  it("gera 14 composições distintas", () => {
    expect(new Set(rendered.map(({ markup }) => markup)).size).toBe(14);
  });

  it("mantém a escada notável entre 0° e 90°", () => {
    const markup = rendered[3].markup;
    expect(markup).toContain("0°");
    expect(markup).toContain("90°");
    expect(markup).toContain("√4/2");
    expect(markup).not.toContain("120°");
  });

  it("marca uma volta completa nos gráficos", () => {
    const markup = rendered[8].markup;
    expect(markup).toContain("sen x");
    expect(markup).toContain("cos x");
    expect(markup).toContain("2π");
  });

  it("distingue pontos de solução e arco de inequação", () => {
    const markup = rendered[12].markup;
    expect(markup).toContain("sen x = m");
    expect(markup).toContain("sen x &gt; m");
    expect(markup).toContain("π−α");
  });
});
