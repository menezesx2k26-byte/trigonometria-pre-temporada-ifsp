import type { Question } from "@/data/types";

export type Answer = string | string[] | Record<string, string>;

export function isAnswerComplete(
  question: Question,
  answer: Answer | undefined,
): boolean {
  if (!answer) return false;
  if (question.type === "choice")
    return typeof answer === "string" && answer.length > 0;
  if (question.type === "multi")
    return Array.isArray(answer) && answer.length > 0;
  return (
    typeof answer === "object" &&
    !Array.isArray(answer) &&
    question.rows.every((row) => Boolean(answer[row.id]))
  );
}

export function isAnswerCorrect(question: Question, answer: Answer): boolean {
  if (question.type === "choice") return answer === question.correctId;
  if (question.type === "multi") {
    if (!Array.isArray(answer)) return false;
    return (
      [...answer].sort().join("|") === [...question.correctIds].sort().join("|")
    );
  }
  if (typeof answer !== "object" || Array.isArray(answer)) return false;
  return question.rows.every((row) => answer[row.id] === row.correctOptionId);
}
