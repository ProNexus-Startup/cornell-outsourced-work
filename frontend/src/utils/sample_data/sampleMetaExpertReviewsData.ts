import { Review } from "@/models/review";
import { v4 as uuidv4 } from "uuid";

const sampleReviewComments = [
  {
    rating: 5,
    comments: [
      "Exceptional expertise in industry analysis. Provided invaluable strategic insights.",
      "Outstanding communication and deep technical knowledge. Highly recommended.",
      "Demonstrated remarkable understanding of market dynamics and trends.",
    ],
  },
  {
    rating: 4,
    comments: [
      "Very knowledgeable professional with strong analytical skills.",
      "Provided clear and actionable recommendations. Good industry perspective.",
      "Strong expertise in the field with practical implementation insights.",
    ],
  },
  {
    rating: 3,
    comments: [
      "Adequate knowledge of the subject matter. Met basic expectations.",
      "Provided useful insights but could be more detailed in analysis.",
      "Demonstrated good understanding with room for deeper expertise.",
    ],
  },
  {
    rating: 2,
    comments: [
      "Limited depth in some key areas. Basic understanding demonstrated.",
      "Could improve on providing more specific examples and insights.",
      "Some knowledge gaps in critical areas. Needs more experience.",
    ],
  },
  {
    rating: 1,
    comments: [
      "Did not meet expectations. Limited practical knowledge.",
      "Struggled to provide concrete examples or insights.",
      "Significant gaps in understanding core concepts.",
    ],
  },
];

const sampleQuestions = [
  {
    question:
      "What is your experience with digital transformation initiatives?",
    answers: [
      "Led multiple enterprise-wide digital transformation projects, achieving 40% efficiency improvement.",
      "Implemented cloud migration strategies for Fortune 500 companies, reducing operational costs by 30%.",
      "Developed and executed digital roadmaps for various industries, focusing on AI and ML integration.",
    ],
  },
  {
    question: "How do you approach operational efficiency improvements?",
    answers: [
      "Utilize data-driven analysis to identify bottlenecks and implement lean methodologies.",
      "Focus on end-to-end process optimization using Six Sigma principles.",
      "Combine technology solutions with process reengineering for maximum impact.",
    ],
  },
  {
    question: "What is your methodology for market entry strategy?",
    answers: [
      "Conduct comprehensive market analysis and competitive landscape assessment.",
      "Develop detailed go-to-market strategies based on customer segmentation.",
      "Focus on identifying unique value propositions and market opportunities.",
    ],
  },
];

const sampleQuestionData = {
  questions: [
    "What was your role in implementing the data analytics pipeline?",
    "How did you approach scaling the system architecture?",
    "What were the key challenges in the project and how did you overcome them?",
    "Can you describe your experience with cloud infrastructure optimization?",
    "How did you handle stakeholder management in this project?",
    "What methodologies did you use for project delivery?",
    "How did you ensure data security and compliance?",
    "What was your approach to team leadership and mentoring?",
    "How did you measure and improve system performance?",
    "What innovations did you introduce to improve efficiency?",
  ],
  answers: [
    "Led the end-to-end implementation of a robust data pipeline processing over 1M events daily. Utilized Apache Kafka for real-time streaming and implemented data validation checks.",
    "Designed a microservices architecture using Kubernetes. Implemented auto-scaling policies based on traffic patterns, resulting in 40% cost reduction.",
    "Main challenge was data consistency across distributed systems. Implemented event sourcing pattern and established clear data ownership protocols.",
    "Optimized AWS infrastructure costs by 35% through right-sizing instances and implementing spot instances for non-critical workloads.",
    "Established weekly sync meetings with stakeholders, created detailed project dashboards, and maintained clear communication channels.",
    "Utilized Agile/Scrum methodology with 2-week sprints. Introduced automated testing and CI/CD pipelines for faster delivery.",
    "Implemented encryption at rest and in transit. Set up role-based access control and regular security audits.",
    "Mentored 5 junior developers, conducted code reviews, and established best practices documentation.",
    "Reduced API response times by 60% through query optimization and caching strategies.",
    "Introduced automated deployment processes that reduced deployment time from 2 hours to 15 minutes.",
  ],
  projectTypes: [
    "Data Analytics Implementation",
    "Cloud Migration",
    "System Architecture Redesign",
    "Performance Optimization",
    "Security Enhancement",
  ],
  companies: [
    "TechCorp",
    "GlobalFinance",
    "HealthTech",
    "RetailGiant",
    "EnergyInnovate",
    "LogisticsPro",
    "MediaStream",
    "InsureTech",
    "AutoMotive",
    "SmartManufacturing",
  ],
  projectTemplates: [
    "{type} for {company}",
    "{company} {type} Initiative",
    "{type} Transformation at {company}",
    "{company} Digital Evolution: {type}",
    "Enterprise {type} for {company}",
  ],
};

const sampleComments = [
  "Excellent communication and technical expertise. Delivered great insights.",
  "Very knowledgeable in their field. Provided valuable strategic advice.",
  "Outstanding contributor with deep industry knowledge.",
  "Great at explaining complex concepts in simple terms.",
  "Highly professional and insightful. Would definitely consult again.",
  "Brought unique perspectives that helped shape our strategy.",
  "Exceptional domain expertise and problem-solving abilities.",
  "Very thorough in their analysis and recommendations.",
  "Fantastic experience working with this expert.",
  "Provided actionable insights that drove real results.",
  "Deep understanding of the industry and current trends.",
  "Clear communicator with excellent strategic thinking.",
  "Helped us navigate complex challenges effectively.",
  "Brought valuable experience and practical solutions.",
  "Very responsive and helpful throughout the engagement.",
];

export const generateSampleReviews = (expertId: string): Review[] => {
  const reviews: Review[] = [];
  const now = new Date();
  // Generate a random number between 6 and 13
  const numReviews = Math.floor(Math.random() * (13 - 6 + 1)) + 6;

  for (let i = 0; i < numReviews; i++) {
    const reviewDate = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      Math.floor(Math.random() * 28) + 1
    );

    reviews.push({
      id: uuidv4(),
      metaExpertId: expertId,
      rating: Math.random() * 2 + 3, // Random rating between 3 and 5
      comment:
        sampleComments[Math.floor(Math.random() * sampleComments.length)],
      date: reviewDate,
    });
  }

  return reviews;
};

export const generateSampleQuestions = (expertId: string): any[] => {
  // Generate 2-4 projects
  const numProjects = Math.floor(Math.random() * 3) + 2;
  const questions = [];
  const projectNames: Record<string, string> = {};

  for (let i = 0; i < numProjects; i++) {
    const projectId = uuidv4();
    const projectType =
      sampleQuestionData.projectTypes[
        Math.floor(Math.random() * sampleQuestionData.projectTypes.length)
      ];
    const company =
      sampleQuestionData.companies[
        Math.floor(Math.random() * sampleQuestionData.companies.length)
      ];
    const template =
      sampleQuestionData.projectTemplates[
        Math.floor(Math.random() * sampleQuestionData.projectTemplates.length)
      ];

    // Generate project name from template
    const projectName = template
      .replace("{type}", projectType)
      .replace("{company}", company);

    projectNames[projectId] = projectName;

    // Generate 3-5 questions per project
    const numQuestions = Math.floor(Math.random() * 3) + 3;

    for (let j = 0; j < numQuestions; j++) {
      const questionIndex = Math.floor(
        Math.random() * sampleQuestionData.questions.length
      );
      const answerIndex = Math.floor(
        Math.random() * sampleQuestionData.answers.length
      );

      questions.push({
        id: uuidv4(),
        expertId: expertId,
        projectId: projectId,
        projectName: projectName,
        question: sampleQuestionData.questions[questionIndex],
        answer: sampleQuestionData.answers[answerIndex],
        displayOrder: j + 1,
        projectType: projectType,
      });
    }
  }

  return questions;
};
