import type { CampaignId } from "@/data/types";

export const STORAGE_KEY = "orbita-14-progress-v1";

export type QuestionResult = {
  correct: boolean;
  attempts: number;
  updatedAt: string;
};

export type OrbitProgress = {
  activeDay: number;
  completedDays: number[];
  masteredDays: number[];
  polyActiveDay: number;
  polyCompletedDays: number[];
  polyMasteredDays: number[];
  questionResults: Record<string, QuestionResult>;
  startedAt: string;
  lastStudyAt: string;
};

export function freshProgress(): OrbitProgress {
  const now = new Date().toISOString();
  return {
    activeDay: 1,
    completedDays: [],
    masteredDays: [],
    polyActiveDay: 1,
    polyCompletedDays: [],
    polyMasteredDays: [],
    questionResults: {},
    startedAt: now,
    lastStudyAt: now,
  };
}

function validDay(value: unknown): number {
  return Math.min(14, Math.max(1, Number(value) || 1));
}

function validDays(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value
        .map(Number)
        .filter((day) => Number.isInteger(day) && day >= 1 && day <= 14),
    ),
  ].sort((a, b) => a - b);
}

function validQuestionResults(value: unknown): Record<string, QuestionResult> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([id, result]) => {
      if (!result || typeof result !== "object" || Array.isArray(result))
        return [];
      const candidate = result as Partial<QuestionResult>;
      if (typeof candidate.correct !== "boolean") return [];
      const attempts = Number(candidate.attempts);
      if (!Number.isInteger(attempts) || attempts < 1) return [];
      return [
        [
          id,
          {
            correct: candidate.correct,
            attempts,
            updatedAt:
              typeof candidate.updatedAt === "string"
                ? candidate.updatedAt
                : new Date(0).toISOString(),
          },
        ],
      ];
    }),
  );
}

export function loadProgress(): OrbitProgress {
  if (typeof window === "undefined") return freshProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshProgress();
    const parsed = JSON.parse(raw) as Partial<OrbitProgress>;
    const base = freshProgress();
    return {
      ...base,
      ...parsed,
      activeDay: validDay(parsed.activeDay),
      completedDays: validDays(parsed.completedDays),
      masteredDays: validDays(parsed.masteredDays),
      polyActiveDay: validDay(parsed.polyActiveDay),
      polyCompletedDays: validDays(parsed.polyCompletedDays),
      polyMasteredDays: validDays(parsed.polyMasteredDays),
      questionResults: validQuestionResults(parsed.questionResults),
    };
  } catch {
    return freshProgress();
  }
}

export function saveProgress(progress: OrbitProgress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // O estudo continua em memória quando o navegador bloqueia armazenamento.
  }
}

export function dayScore(
  progress: OrbitProgress,
  questionIds: string[],
): { answered: number; correct: number; percent: number } {
  const results = questionIds
    .map((id) => progress.questionResults[id])
    .filter(Boolean);
  const correct = results.filter((result) => result.correct).length;
  return {
    answered: results.length,
    correct,
    percent: questionIds.length
      ? Math.round((correct / questionIds.length) * 100)
      : 0,
  };
}

function nextPendingDay(completedDays: number[]): number {
  return (
    Array.from({ length: 14 }, (_, index) => index + 1).find(
      (day) => !completedDays.includes(day),
    ) ?? 14
  );
}

function withDay(days: number[], day: number): number[] {
  return [...new Set([...days, day])].sort((a, b) => a - b);
}

export function completeMission(
  progress: OrbitProgress,
  campaign: CampaignId,
  day: number,
  questionIds: string[],
  completedAt = new Date().toISOString(),
): OrbitProgress {
  const score = dayScore(progress, questionIds);
  if (score.answered !== questionIds.length) return progress;

  if (campaign === "poly") {
    const polyCompletedDays = withDay(progress.polyCompletedDays, day);
    const polyMasteredDays =
      score.percent >= 75
        ? withDay(progress.polyMasteredDays, day)
        : progress.polyMasteredDays.filter((item) => item !== day);
    return {
      ...progress,
      polyCompletedDays,
      polyMasteredDays,
      polyActiveDay: nextPendingDay(polyCompletedDays),
      lastStudyAt: completedAt,
    };
  }

  const completedDays = withDay(progress.completedDays, day);
  const masteredDays =
    score.percent >= 75
      ? withDay(progress.masteredDays, day)
      : progress.masteredDays.filter((item) => item !== day);
  return {
    ...progress,
    completedDays,
    masteredDays,
    activeDay: nextPendingDay(completedDays),
    lastStudyAt: completedAt,
  };
}
