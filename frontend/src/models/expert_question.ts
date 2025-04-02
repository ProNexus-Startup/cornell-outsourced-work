import { Project } from "./project";

export interface ExpertQuestion {
  id: string;
  organizationId?: string | null;
  expertId: string;
  projectId?: string | null;
  question: string;
  answer?: string | null;
  sourceProjectQuestionId?: string | null;
  possibilityFraudulent?: number | null;
  label?: string | null;
  displayOrder?: number | null;
  aiMatchScore?: number | null;
}

// Utility function to convert JSON into an ExpertQuestion object
export const expertQuestionFromJson = (
  expertJson: any,
  thisProject: Project | null
): ExpertQuestion => {
  const sourceQuestion =
    thisProject?.projectQuestions?.find(
      (item) => item.id === expertJson.sourceProjectQuestionId
    ) || null;

  return {
    id: expertJson.id || "",
    organizationId: expertJson.organizationId || null,
    expertId: expertJson.expertId || "",
    projectId: expertJson.projectId || null,
    question: expertJson.question || "",
    answer: expertJson.answer || null,
    sourceProjectQuestionId: expertJson.sourceProjectQuestionId || null,
    possibilityFraudulent: expertJson.possibilityFraudulent
      ? parseFloat(expertJson.possibilityFraudulent)
      : null,
    label: sourceQuestion?.label || null,
    displayOrder:
      expertJson.displayOrder || sourceQuestion?.displayOrder || null,
    aiMatchScore: expertJson.aiMatchScore
      ? parseFloat(expertJson.aiMatchScore)
      : null,
  };
};

// Utility function to convert an ExpertQuestion object into JSON
export const expertQuestionToJson = (
  expertQuestion: ExpertQuestion
): Record<string, any> => {
  return {
    id: expertQuestion.id,
    organizationId: expertQuestion.organizationId || null,
    expertId: expertQuestion.expertId,
    question: expertQuestion.question,
    answer: expertQuestion.answer || null,
    sourceProjectQuestionId: expertQuestion.sourceProjectQuestionId || null,
    possibilityFraudulent:
      expertQuestion.possibilityFraudulent?.toString() || null,
    label: expertQuestion.label || null,
    displayOrder: expertQuestion.displayOrder?.toString() || null,
    aiMatchScore: expertQuestion.aiMatchScore?.toString() || null,
  };
};

// Function to create a default ExpertQuestion object
export const defaultExpertQuestion = (): ExpertQuestion => {
  return {
    id: "default-id",
    expertId: "default-expert-id",
    question: "Missing Question",
    answer: null,
    sourceProjectQuestionId: null,
    possibilityFraudulent: null,
    label: null,
    displayOrder: null,
    aiMatchScore: null,
  };
};
