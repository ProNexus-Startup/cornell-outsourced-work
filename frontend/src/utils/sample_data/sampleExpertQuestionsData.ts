import { ExpertQuestion } from "@/models/expert_question";
import { Project } from "@/models/project";
import { v4 as uuidv4 } from "uuid";

const sampleAnswers = {
  financialAnalysis: [
    "Based on my experience at [Company], I've conducted over 20 financial due diligence projects in the last 3 years.",
    "I specialize in EBITDA analysis and have worked on deals ranging from $50M to $2B in enterprise value.",
    "My expertise includes detailed financial modeling, working capital analysis, and quality of earnings assessments.",
    "I've led multiple buy-side due diligence projects and have experience identifying key deal risks and opportunities.",
    "I have extensive experience in analyzing historical financials and developing forward-looking projections.",
  ],
  operationalEfficiency: [
    "I've implemented operational improvement initiatives that resulted in 15-20% cost reduction across multiple projects.",
    "My experience includes end-to-end supply chain optimization and process reengineering for manufacturing clients.",
    "I've led operational due diligence projects focusing on capacity utilization and efficiency improvements.",
    "I specialize in identifying operational synergies and have achieved $10M+ in annual savings for clients.",
    "My background includes lean manufacturing implementation and operational excellence programs.",
  ],
  industryExperience: [
    "I have over 10 years of experience in the technology sector, focusing on SaaS companies.",
    "My background includes extensive work in healthcare, particularly in medical devices and pharmaceuticals.",
    "I've worked across multiple industrial manufacturing segments, specializing in automotive and aerospace.",
    "I have deep expertise in consumer goods and retail, with focus on e-commerce transformation.",
    "My experience spans financial services, including fintech and traditional banking.",
  ],
  methodologyApproach: [
    "I use a structured approach combining data analysis with stakeholder interviews to validate findings.",
    "My methodology involves detailed process mapping and root cause analysis to identify improvement areas.",
    "I employ a risk-based approach to prioritize areas of focus and develop actionable recommendations.",
    "My work style emphasizes collaboration with client teams to ensure sustainable implementation.",
    "I utilize both quantitative and qualitative analysis methods to provide comprehensive insights.",
  ],
};

const getRandomAnswer = (category: keyof typeof sampleAnswers): string => {
  const answers = sampleAnswers[category];
  return answers[Math.floor(Math.random() * answers.length)];
};

const getCategoryForQuestion = (
  question: string
): keyof typeof sampleAnswers => {
  const questionLower = question.toLowerCase();
  if (
    questionLower.includes("financial") ||
    questionLower.includes("revenue") ||
    questionLower.includes("ebitda")
  ) {
    return "financialAnalysis";
  } else if (
    questionLower.includes("operational") ||
    questionLower.includes("process") ||
    questionLower.includes("efficiency")
  ) {
    return "operationalEfficiency";
  } else if (
    questionLower.includes("industry") ||
    questionLower.includes("sector") ||
    questionLower.includes("market")
  ) {
    return "industryExperience";
  }
  return "methodologyApproach";
};

export const createSampleExpertQuestions = (
  project: Project,
  expertId: string
): ExpertQuestion[] => {
  if (!project.projectQuestions) {
    return [];
  }

  return project.projectQuestions.map((projectQuestion) => {
    const category = getCategoryForQuestion(projectQuestion.question);

    return {
      id: uuidv4(),
      organizationId: project.organizationId || null,
      expertId: expertId,
      projectId: project.id,
      question: projectQuestion.question,
      answer: getRandomAnswer(category),
      sourceProjectQuestionId: projectQuestion.id || null,
      possibilityFraudulent: Math.random() * 0.2, // 0-0.2 range for fraud possibility
      label: projectQuestion.label || null,
      order: projectQuestion.displayOrder || null,
      aiMatchScore: Math.random() * 40 + 60, // 60-100 range for AI match score
    } as ExpertQuestion;
  });
};
