export type TagCategory =
  | "primary_industry"
  | "sub_industry"
  | "certifications"
  | "functional_expertise"
  | "technical_skills"
  | "seniority"
  | "company"
  | "notable_milestones"
  | "degrees"
  | "education"
  | "location"
  | "language_proficiency"
  | "vendor_tools"
  | "conversation_topic";

export interface Tag {
  id: string;
  category: TagCategory;
  value: string;
}

// Consulting-relevant conversation topics
export const CONVERSATION_TOPICS = [
  "Digital Transformation",
  "Corporate Strategy",
  "Mergers & Acquisitions",
  "Operational Excellence",
  "Change Management",
  "Supply Chain Optimization",
  "Data Analytics",
  "Customer Experience",
  "Cost Reduction",
  "Market Entry Strategy",
  "Organizational Design",
  "Risk Management",
  "ESG & Sustainability",
  "Innovation Strategy",
  "Post-Merger Integration",
  "Pricing Strategy",
  "Business Model Transformation",
  "Process Optimization",
  "IT Strategy",
  "Talent Management",
] as const;

export type ConversationTopic = (typeof CONVERSATION_TOPICS)[number];
