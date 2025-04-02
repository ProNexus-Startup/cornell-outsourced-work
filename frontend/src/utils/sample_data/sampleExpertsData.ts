import { Expert } from "@/models/expert";
import { Project } from "@/models/project";
import { Job } from "@/models/job";
import { v4 as uuidv4 } from "uuid";
import { createSampleExpertQuestions } from "./sampleExpertQuestionsData";
import { createSampleAvailabilities } from "./sampleAvailabilitiesData";

const sampleData = {
  firstNames: [
    "James",
    "Emma",
    "Michael",
    "Sarah",
    "David",
    "Lisa",
    "Robert",
    "Jennifer",
    "William",
    "Elizabeth",
  ],
  lastNames: [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Anderson",
    "Wilson",
  ],
  companies: [
    "Deloitte",
    "KPMG",
    "EY",
    "PwC",
    "McKinsey",
    "BCG",
    "Bain",
    "Accenture",
    "Goldman Sachs",
    "Morgan Stanley",
  ],
  professions: [
    "Financial Due Diligence Manager",
    "Operational Due Diligence Specialist",
    "M&A Advisor",
    "Transaction Services Director",
    "Corporate Finance Manager",
    "Supply Chain Consultant",
    "Business Valuation Expert",
    "Strategic Operations Consultant",
    "Financial Planning Analyst",
    "Risk Management Specialist",
  ],
  geographies: [
    "New York",
    "London",
    "Chicago",
    "Boston",
    "San Francisco",
    "Toronto",
    "Singapore",
    "Hong Kong",
  ],
  profileTypeIds: [
    "550e8400-e29b-41d4-a716-446655440000", // Financial Analyst
    "6ba7b810-9dad-11d1-80b4-00c04fd430c8", // Operational Consultant
  ],
  education: [
    "Stanford University",
    "Harvard University",
    "MIT",
    "UC Berkeley",
    "Yale University",
    "Princeton University",
    "Columbia University",
    "University of Pennsylvania",
    "Cornell University",
    "Duke University",
  ],
  degrees: [
    "Bachelor of Science",
    "Bachelor of Arts",
    "Master of Science",
    "Master of Business Administration",
    "Master of Arts",
    "Doctor of Philosophy",
  ],
  majors: [
    "Computer Science",
    "Business Administration",
    "Finance",
    "Economics",
    "Data Science",
    "Engineering",
    "Mathematics",
    "Statistics",
  ],
};

const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const generateExperienceJobs = (id: string): Job[] => {
  const numJobs = Math.floor(Math.random() * 2) + 3; // 3-4 jobs
  return Array.from({ length: numJobs }, (_, jobIndex) => {
    const duration = Math.floor(Math.random() * 4) + 1;
    const currentYear = new Date().getFullYear();
    const endDate =
      jobIndex === 0
        ? new Date()
        : new Date(
            currentYear - jobIndex * duration,
            Math.floor(Math.random() * 12),
            1
          );
    const startDate = new Date(
      endDate.getFullYear() - duration,
      Math.floor(Math.random() * 12),
      1
    );

    return {
      id: `job-${id}-${jobIndex}`,
      expertId: id,
      role: getRandomItem(sampleData.professions),
      company: getRandomItem(sampleData.companies),
      startDate,
      endDate: jobIndex === 0 ? null : endDate,
      organizationId: uuidv4(),
      isHighlighted: jobIndex === 0,
      type: "experience",
    };
  });
};

const generateEducationJobs = (id: string): Job[] => {
  const numDegrees = Math.floor(Math.random() * 2) + 1; // 1-2 degrees
  let currentYear = new Date().getFullYear() - 10; // Start education 10 years ago

  return Array.from({ length: numDegrees }, (_, index) => {
    const duration = index === 0 ? 2 : 4; // MBA = 2 years, Bachelors = 4 years
    const endDate = new Date(currentYear, Math.floor(Math.random() * 12), 1);
    const startDate = new Date(
      currentYear - duration,
      Math.floor(Math.random() * 12),
      1
    );

    const school = getRandomItem(sampleData.education);
    const degree =
      index === 0
        ? "Master of Business Administration"
        : getRandomItem(sampleData.degrees);
    const major = getRandomItem(sampleData.majors);

    currentYear -= duration + Math.floor(Math.random() * 2); // Add gap between degrees

    return {
      id: `edu-${id}-${index}`,
      expertId: id,
      role: `${degree} in ${major}`,
      company: school,
      startDate,
      endDate,
      organizationId: uuidv4(),
      isHighlighted: index === 0,
      type: "education",
      isEducation: true,
    };
  });
};

export const createSampleExperts = (project: Project): Expert[] => {
  return Array.from({ length: 100 }, (_, index) => {
    // Special case for the first expert (Esteban)
    if (index === 0) {
      const id = `exp${index + 1}`;
      const expert: Expert = {
        id,
        name: "Esteban Guio",
        organizationId: uuidv4(),
        projectId: project.id,
        favorite: true,
        profession: "Data Analytics and IT Professional",
        company: "BCG",
        description:
          "Experienced financial analyst with 10 years of experience in managing financial statements, assessing risk, and making economic projections.",
        geography: "Miami, Florida",
        profileTypeId: sampleData.profileTypeIds[0], // Financial Analyst
        metaExpertId: uuidv4(),
        status: "Sourced",
        internalStatus: "Pending Review",
        aiAssessment: 95,
        aiAnalysis:
          "Excellent match for project requirements with strong technical and financial background",
        expertNetworkName: "GLG",
        cost: 800,
        currency: "USD",
        rating: 5,
        linkedInLink: "https://www.linkedin.com/in/estebanguio/",
        checked: true,
        callScheduled: false,
        dismissed: false,
        fraudFlag: false,
        profilePictureLink:
          "https://media.licdn.com/dms/image/v2/C5603AQEm98LkUzoMpw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1556317203522?e=1747267200&v=beta&t=-FEyvO2uUGww3CaEzztyvf-zPtTsBQDfhAQ_d3LRUbw",
        email: "estebanguio@glg.com",
        phone: "+13055551234",
        strikes: Math.floor(Math.random() * 3),
        linkedInConnectionCount: Math.floor(Math.random() * 4000) + 1000,
        surveyDuration: Math.floor(Math.random() * 30) + 30,
        tardyToCall: Math.random() < 0.1,
        absentFromCall: Math.random() < 0.05,
        probabilityOfAIScreeners: Math.random(),
        ableToSpeakToTopics: true,
        likelihoodOfReengagement: Math.floor(Math.random() * 100),
        questions: createSampleExpertQuestions(project, id),
        availabilities: createSampleAvailabilities(id),
        jobs: [...generateExperienceJobs(id), ...generateEducationJobs(id)],
        comments: [],
        screened: "Unscreened",
        firstSourced: true,
        creditCost: 800,
        actualCost: 800,
        checkedTime: null,
        enrichedLinkedIn: true,
        aiMatchCalculated: true,
        dateAddedExpert: new Date(),
        postInterviewRating: Math.floor(Math.random() * 5) + 1,
        postInterviewComments:
          "Demonstrated exceptional knowledge in data analytics and IT infrastructure. Provided valuable insights on system optimization and data-driven decision making. Strong communication skills and clear articulation of complex concepts.",
      };
      return expert;
    }

    // Original code for other experts
    const id = `exp${index + 1}`;
    const firstName = getRandomItem(sampleData.firstNames);
    const lastName = getRandomItem(sampleData.lastNames);
    const company = getRandomItem(sampleData.companies);
    const profession = getRandomItem(sampleData.professions);
    const geography = getRandomItem(sampleData.geographies);
    const profileTypeId = getRandomItem(sampleData.profileTypeIds);
    const rating = Math.floor(Math.random() * 2) + 4;
    const cost = Math.floor(Math.random() * 500) + 500;
    const postInterviewRating = Math.floor(Math.random() * 5) + 1;

    // Generate a random post-interview comment based on the rating
    const getPostInterviewComment = (rating: number): string => {
      const comments = {
        1: [
          "Limited knowledge of the subject matter. Struggled to provide concrete examples.",
          "Communication was unclear and responses lacked depth. Not recommended for future consultations.",
          "Did not meet expectations. Responses were too general and lacked specific insights.",
        ],
        2: [
          "Below average performance. Some relevant experience but limited practical insights.",
          "Showed basic understanding but couldn't dive deep into technical aspects.",
          "Responses were somewhat superficial. Could improve on specific industry knowledge.",
        ],
        3: [
          "Average performance. Provided some useful insights but could be more detailed.",
          "Demonstrated adequate knowledge. Room for improvement in specific areas.",
          "Met basic expectations. Could benefit from more practical experience.",
        ],
        4: [
          "Strong performance with good industry insights. Clear communication.",
          "Provided valuable perspectives and detailed examples from past experience.",
          "Very knowledgeable in their field. Good balance of strategic and practical insights.",
        ],
        5: [
          "Exceptional expert with deep industry knowledge. Highly recommended.",
          "Outstanding insights and excellent communication. Exceeded expectations.",
          "Demonstrated comprehensive expertise. Provided actionable recommendations.",
        ],
      };

      const ratingComments = comments[rating as keyof typeof comments];
      return ratingComments[Math.floor(Math.random() * ratingComments.length)];
    };

    const status =
      index < 21 ? "Dismissed" : index < 48 ? "Completed" : "Sourced";

    const expert: Expert = {
      id,
      name: `${firstName} ${lastName}`,
      organizationId: uuidv4(),
      projectId: project.id,
      favorite: Math.random() < 0.2,
      profession,
      company,
      description: `${profession} at ${company} with extensive experience in ${
        profileTypeId === sampleData.profileTypeIds[0]
          ? "financial analysis, due diligence, and M&A transactions"
          : "operational optimization, supply chain management, and process improvement"
      }. Specializes in ${
        profileTypeId === sampleData.profileTypeIds[0]
          ? "EBITDA analysis, revenue modeling, and financial risk assessment"
          : "cost synergies, operational efficiency, and business process optimization"
      }.`,
      geography,
      profileTypeId,
      metaExpertId: uuidv4(),
      status,
      internalStatus: "Pending Review",
      aiAssessment: Math.random() * 100,
      aiAnalysis: "Strong match for project requirements",
      expertNetworkName: company,
      cost,
      currency: "USD",
      rating,
      linkedInLink: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
      checked: true,
      callScheduled: false,
      dismissed: false,
      fraudFlag: false,
      profilePictureLink: `https://www.gravatar.com/avatar/${uuidv4()}?d=mp&f=y`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company
        .toLowerCase()
        .replace(/\s+/g, "")}.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      strikes: 0,
      linkedInConnectionCount: Math.floor(Math.random() * 4000) + 1000,
      surveyDuration: Math.floor(Math.random() * 30) + 30,
      tardyToCall: false,
      absentFromCall: false,
      probabilityOfAIScreeners: Math.random(),
      ableToSpeakToTopics: true,
      likelihoodOfReengagement: Math.floor(Math.random() * 100),
      questions: createSampleExpertQuestions(project, id),
      availabilities: createSampleAvailabilities(id),
      jobs: [...generateExperienceJobs(id), ...generateEducationJobs(id)],
      comments: [],
      screened: "Unscreened",
      firstSourced: true,
      creditCost: cost,
      actualCost: cost,
      checkedTime: null,
      enrichedLinkedIn: true,
      aiMatchCalculated: true,
      dateAddedExpert: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ), // Random date within last 30 days
      postInterviewRating,
      postInterviewComments: getPostInterviewComment(postInterviewRating),
    };

    return expert;
  });
};

// Create a default project for sample data
const defaultSampleProject: Project = {
  id: "sample-project-1",
  name: "Sample Due Diligence Project",
  organizationId: "sample-org-1",
  startDate: new Date(),
  status: "Active",
  scope: "Financial and Operational Due Diligence",
  type: "Due Diligence",
  estimatedCalls: 50,
  profileTypes: [],
  projectQuestions: [
    {
      id: "q1",
      projectId: "sample-project-1",
      profileTypeId: "550e8400-e29b-41d4-a716-446655440000",
      question: "What is your experience with financial due diligence?",
      label: "Financial Experience",
      displayOrder: 1,
    },
    {
      id: "q2",
      projectId: "sample-project-1",
      profileTypeId: "550e8400-e29b-41d4-a716-446655440000",
      question: "Describe your approach to EBITDA analysis and adjustments.",
      label: "EBITDA Analysis",
      displayOrder: 2,
    },
    {
      id: "q3",
      projectId: "sample-project-1",
      profileTypeId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      question: "What operational improvement projects have you led?",
      label: "Operational Experience",
      displayOrder: 3,
    },
    {
      id: "q4",
      projectId: "sample-project-1",
      profileTypeId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      question:
        "Describe your methodology for identifying operational synergies.",
      label: "Methodology",
      displayOrder: 4,
    },
  ],
};

export const sampleExperts = createSampleExperts(defaultSampleProject);
