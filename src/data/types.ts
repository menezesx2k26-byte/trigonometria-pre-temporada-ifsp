export type QuestionOption = {
  id: string;
  label: string;
};

export type ChoiceQuestion = {
  id: string;
  type: "choice";
  prompt: string;
  options: QuestionOption[];
  correctId: string;
  explanation: string;
  trap: string;
};

export type MultiQuestion = {
  id: string;
  type: "multi";
  prompt: string;
  options: QuestionOption[];
  correctIds: string[];
  explanation: string;
  trap: string;
};

export type MatchQuestion = {
  id: string;
  type: "match";
  prompt: string;
  rows: Array<{ id: string; left: string; correctOptionId: string }>;
  options: QuestionOption[];
  explanation: string;
  trap: string;
};

export type Question = ChoiceQuestion | MultiQuestion | MatchQuestion;

export type LessonBlock = {
  eyebrow: string;
  title: string;
  body: string;
  formula?: string;
};

export type WorkedExample = {
  prompt: string;
  steps: string[];
  result: string;
};

export type CampaignId = "trig" | "poly";

export type Mission = {
  campaign: CampaignId;
  day: number;
  slug: string;
  title: string;
  shortTitle: string;
  phase: "Fundação" | "Órbita" | "Domínio" | "Forja" | "Fatoração" | "Raízes";
  duration: string;
  source: string;
  objective: string;
  why: string;
  mnemonic: {
    label: string;
    chant: string;
    meaning: string;
  };
  blocks: LessonBlock[];
  example: WorkedExample;
  visual:
    | "angles"
    | "triangle"
    | "notable"
    | "radians"
    | "circle"
    | "identity"
    | "wave"
    | "transform"
    | "equation"
    | "polynomial";
  questions: Question[];
};
