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
    questionResults: {},
    startedAt: now,
    lastStudyAt: now,
  };
}

export function loadProgress(): OrbitProgress {
  if (typeof window === "undefined") return freshProgress();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return freshProgress();
  try {
    const parsed = JSON.parse(raw) as Partial<OrbitProgress>;
    const base = freshProgress();
    return {
      ...base,
      ...parsed,
      activeDay: Math.min(14, Math.max(1, Number(parsed.activeDay) || 1)),
      completedDays: Array.isArray(parsed.completedDays)
        ? parsed.completedDays
        : [],
      masteredDays: Array.isArray(parsed.masteredDays)
        ? parsed.masteredDays
        : [],
      questionResults:
        parsed.questionResults && typeof parsed.questionResults === "object"
          ? parsed.questionResults
          : {},
    };
  } catch {
    return freshProgress();
  }
}

export function saveProgress(progress: OrbitProgress): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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
