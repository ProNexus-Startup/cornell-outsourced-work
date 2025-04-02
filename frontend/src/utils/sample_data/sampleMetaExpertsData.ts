import type MetaExpert from "@/models/meta_expert";
import type { Job } from "@/models/job";
import { CONVERSATION_TOPICS, TagCategory } from "@/models/tag";
import type ExpertTag from "@/models/expert_tag";
import {
  generateSampleReviews,
  generateSampleQuestions,
} from "./sampleMetaExpertReviewsData";

// Sample data pools
const sampleData = {
  firstNames: [
    "James",
    "Emma",
    "Michael",
    "Olivia",
    "William",
    "Sophia",
    "Alexander",
    "Isabella",
    "Daniel",
    "Ava",
    "David",
    "Mia",
    "Joseph",
    "Charlotte",
    "Matthew",
    "Amelia",
    "Andrew",
    "Harper",
    "Benjamin",
    "Evelyn",
    "Samuel",
    "Abigail",
    "Christopher",
    "Emily",
    "John",
    "Elizabeth",
    "Lucas",
    "Sofia",
    "Henry",
    "Avery",
    "Sebastian",
    "Ella",
    "Jack",
    "Scarlett",
    "Owen",
    "Victoria",
    "Dylan",
    "Madison",
    "Luke",
    "Luna",
    "Gabriel",
    "Grace",
    "Anthony",
    "Chloe",
    "Isaac",
    "Penelope",
    "Julian",
    "Layla",
    "Levi",
    "Riley",
    "Aaron",
    "Zoey",
    "Oliver",
    "Nora",
    "Thomas",
    "Lily",
    "Ryan",
    "Eleanor",
    "Nathan",
    "Hannah",
    "Charles",
    "Lillian",
    "Caleb",
    "Addison",
    "Austin",
    "Aubrey",
    "Adam",
    "Ellie",
    "Ian",
    "Stella",
    "Jonathan",
    "Natalie",
    "Christopher",
    "Zoe",
    "Connor",
    "Leah",
    "Joshua",
    "Hazel",
    "Justin",
    "Violet",
    "Robert",
    "Aurora",
    "Nicholas",
    "Savannah",
    "Jordan",
    "Audrey",
    "Brandon",
    "Brooklyn",
    "Christian",
    "Bella",
    "Kevin",
    "Claire",
    "Brian",
    "Lucy",
    "Jose",
    "Anna",
    "Jason",
    "Caroline",
    "Timothy",
    "Nova",
    "Sean",
    "Genesis",
    "Nathan",
    "Kennedy",
    "Eric",
    "Sarah",
    "Stephen",
    "Aaliyah",
    "Tyler",
    "Alice",
    "Jeffrey",
    "Madelyn",
    "Marcus",
    "Eva",
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
    "Rodriguez",
    "Martinez",
    "Hernandez",
    "Lopez",
    "Gonzalez",
    "Wilson",
    "Anderson",
    "Thomas",
    "Taylor",
    "Moore",
    "Jackson",
    "Martin",
    "Lee",
    "Perez",
    "Thompson",
    "White",
    "Harris",
    "Sanchez",
    "Clark",
    "Ramirez",
    "Lewis",
    "Robinson",
    "Walker",
    "Young",
    "Allen",
    "King",
    "Wright",
    "Scott",
    "Torres",
    "Nguyen",
    "Hill",
    "Flores",
    "Green",
    "Adams",
    "Nelson",
    "Baker",
    "Hall",
    "Rivera",
    "Campbell",
    "Mitchell",
    "Carter",
    "Roberts",
    "Chen",
    "Phillips",
    "Evans",
    "Turner",
    "Diaz",
    "Parker",
    "Cruz",
    "Edwards",
    "Collins",
    "Stewart",
    "Morris",
    "Morales",
    "Murphy",
    "Cook",
    "Rogers",
    "Ortiz",
    "Morgan",
    "Cooper",
    "Peterson",
    "Bailey",
    "Reed",
    "Kelly",
    "Howard",
    "Ramos",
    "Kim",
    "Cox",
    "Ward",
    "Richardson",
    "Watson",
    "Brooks",
    "Chavez",
    "Wood",
    "James",
    "Bennett",
    "Gray",
    "Mendoza",
    "Ruiz",
    "Hughes",
    "Price",
    "Alvarez",
    "Castillo",
    "Sanders",
    "Patel",
    "Myers",
    "Long",
    "Ross",
    "Foster",
    "Jimenez",
    "Powell",
    "Jenkins",
  ],
  companies: ["McKinsey", "BCG", "Bain", "Deloitte", "KPMG"],
  primaryIndustries: [
    "Technology",
    "Healthcare",
    "Financial Services",
    "Manufacturing",
    "Energy",
  ],
  subIndustries: [
    "Software",
    "Medical Devices",
    "Investment Banking",
    "Automotive",
    "Renewable Energy",
  ],
  certifications: [
    "CFA",
    "PMP",
    "Six Sigma Black Belt",
    "AWS Certified Solutions Architect",
    "CISSP",
  ],
  functionalExpertise: [
    "Strategy",
    "Operations",
    "Digital Transformation",
    "Finance",
    "Supply Chain",
  ],
  technicalSkills: [
    "Data Analytics",
    "Machine Learning",
    "Cloud Architecture",
    "Process Optimization",
    "Risk Management",
  ],
  seniority: [
    "Senior",
    "Principal",
    "Director",
    "Partner",
    "Managing Director",
  ],
  notableMilestones: [
    "Led $500M merger integration",
    "Achieved 30% cost reduction",
    "Launched digital transformation program",
    "Developed new market strategy",
    "Implemented enterprise-wide ERP system",
  ],
  degrees: [
    "MBA",
    "MS Computer Science",
    "BS Engineering",
    "PhD Economics",
    "BS Business Administration",
  ],
  education: [
    "Harvard Business School",
    "Stanford University",
    "MIT",
    "University of Pennsylvania",
    "Columbia University",
  ],
  locations: ["New York", "San Francisco", "London", "Chicago", "Boston"],
  languages: ["English", "Spanish", "Mandarin", "French", "German"],
  vendorTools: ["SAP", "Salesforce", "Oracle", "Tableau", "Power BI"],
  reviewComments: [
    "Excellent expertise in the field. Very insightful analysis.",
    "Great communication skills and deep industry knowledge.",
    "Provided valuable strategic insights and practical recommendations.",
    "Very professional and thorough in their analysis.",
    "Outstanding understanding of market dynamics.",
    "Brought unique perspectives to our discussion.",
    "Highly knowledgeable and articulate in explaining complex concepts.",
    "Demonstrated exceptional expertise in their domain.",
    "Very helpful in providing actionable insights.",
    "Clear communication and strong analytical skills.",
  ],
  conversationTopics: CONVERSATION_TOPICS,
};

const getRandomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const generateJobs = (expertId: string, numJobs: number = 3): Job[] => {
  const jobs: Job[] = [];
  let currentYear = new Date().getFullYear();

  // Add more job fields for filtering
  const locations = [
    "New York",
    "San Francisco",
    "London",
    "Tokyo",
    "Berlin",
    "Singapore",
    "Sydney",
  ];
  const industries = [
    "Technology",
    "Healthcare",
    "Financial Services",
    "Manufacturing",
    "Energy",
    "Retail",
    "Media",
  ];
  const subIndustries = [
    "Software",
    "Medical Devices",
    "Investment Banking",
    "Automotive",
    "Renewable Energy",
    "E-commerce",
    "Digital Media",
  ];

  // Generate work experience
  for (let i = 0; i < numJobs; i++) {
    const duration = Math.floor(Math.random() * 4) + 1;
    const endDate =
      i === 0
        ? new Date()
        : new Date(currentYear, Math.floor(Math.random() * 12), 1);
    const startDate = new Date(
      currentYear - duration,
      Math.floor(Math.random() * 12),
      1
    );

    const seniority = getRandomItem(sampleData.seniority);
    const expertise = getRandomItem(sampleData.functionalExpertise);
    const role = `${seniority} ${expertise}`;
    const industry = getRandomItem(industries);
    const subIndustry = getRandomItem(subIndustries);
    const location = getRandomItem(locations);

    jobs.push({
      id: `job-${expertId}-${i}`,
      expertId: expertId,
      role: role,
      company: getRandomItem(sampleData.companies),
      startDate: startDate,
      endDate: i === 0 ? null : endDate,
      organizationId: `org-${Math.random().toString(36).substr(2, 9)}`,
      isHighlighted: i === 0,
      industry: industry,
      subIndustry: subIndustry,
      location: location,
      seniorityLevel: seniority,
      type: "experience",
    });

    currentYear -= duration;
  }

  return jobs;
};

const generateEducation = (expertId: string): Job[] => {
  const education: Job[] = [];
  let currentYear = new Date().getFullYear() - 10; // Start education 10 years ago

  // Generate 1-3 education entries
  const numEducation = Math.floor(Math.random() * 2) + 1; // 1-2 degrees

  for (let i = 0; i < numEducation; i++) {
    const duration = i === 0 ? 2 : 4; // MBA = 2 years, Bachelors = 4 years
    const endDate = new Date(currentYear, Math.floor(Math.random() * 12), 1);
    const startDate = new Date(
      currentYear - duration,
      Math.floor(Math.random() * 12),
      1
    );

    const school = getRandomItem(sampleData.education);
    const degree = i === 0 ? "MBA" : getRandomItem(sampleData.degrees);
    const major = getRandomItem([
      "Business Administration",
      "Computer Science",
      "Engineering",
      "Economics",
      "Finance",
      "Data Science",
    ]);

    education.push({
      id: `edu-${expertId}-${i}`,
      expertId: expertId,
      role: `${degree} in ${major}`,
      company: school,
      startDate: startDate,
      endDate: endDate,
      organizationId: `org-${Math.random().toString(36).substr(2, 9)}`,
      isHighlighted: i === 0,
      type: "education",
      location: getRandomItem(sampleData.locations),
    });

    currentYear -= duration + Math.floor(Math.random() * 2); // Add some gap between degrees
  }

  return education;
};

export const createSampleExperts = (): MetaExpert[] => {
  const sampleExperts: MetaExpert[] = Array.from(
    { length: 100 },
    (_, index) => {
      const id = `sample${index + 1}`;

      // Generate sample reviews and questions
      const reviews = generateSampleReviews(id);
      const questions = generateSampleQuestions(id);

      // Calculate average rating from reviews
      const averageRating =
        reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        reviews.length;

      // Generate work experience and education
      const workExperience = generateJobs(
        id,
        Math.floor(Math.random() * 3) + 2
      );
      const educationHistory = generateEducation(id);
      const allJobs = [...workExperience, ...educationHistory];

      // Use current job's company
      const currentJob = workExperience[0];
      const company = currentJob.company;

      // Generate random selections for new categories
      const primaryIndustry = getRandomItem(sampleData.primaryIndustries);
      const subIndustry = getRandomItem(sampleData.subIndustries);
      const certifications = Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => getRandomItem(sampleData.certifications)
      );
      const functionalExpertise = Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => getRandomItem(sampleData.functionalExpertise)
      );
      const technicalSkills = Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => getRandomItem(sampleData.technicalSkills)
      );
      const seniority = getRandomItem(sampleData.seniority);
      const notableMilestones = Array.from(
        { length: Math.floor(Math.random() * 2) + 1 },
        () => getRandomItem(sampleData.notableMilestones)
      );
      const degrees = Array.from(
        { length: Math.floor(Math.random() * 2) + 1 },
        () => getRandomItem(sampleData.degrees)
      );
      const education = Array.from(
        { length: Math.floor(Math.random() * 2) + 1 },
        () => getRandomItem(sampleData.education)
      );
      const location = getRandomItem(sampleData.locations);
      const languages = Array.from(
        { length: Math.floor(Math.random() * 2) + 2 },
        () => getRandomItem(sampleData.languages)
      );
      const vendorTools = Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => getRandomItem(sampleData.vendorTools)
      );

      // Generate full name
      const firstName = getRandomItem(sampleData.firstNames);
      const lastName = getRandomItem(sampleData.lastNames);
      const fullName = `${firstName} ${lastName}`;

      // Create comprehensive tags for each expert
      const expertTags: ExpertTag[] = [
        // Company tags - ALL companies from job history
        ...workExperience.map((job, jIndex) => ({
          id: `${id}-company-${jIndex}`,
          value: job.company as string,
          metaExpertId: id,
          category: "company" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        })),
        // Primary Industry tag
        {
          id: `${id}-primary-industry`,
          value: primaryIndustry,
          metaExpertId: id,
          category: "primary_industry" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        },
        // Sub-Industry tag
        {
          id: `${id}-sub-industry`,
          value: subIndustry,
          metaExpertId: id,
          category: "sub_industry" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        },
        // Certifications tags
        ...certifications.map((cert, index) => ({
          id: `${id}-cert-${index}`,
          value: cert,
          metaExpertId: id,
          category: "certifications" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        })),
        // Functional Expertise tags
        ...functionalExpertise.map((expertise, index) => ({
          id: `${id}-expertise-${index}`,
          value: expertise,
          metaExpertId: id,
          category: "functional_expertise" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        })),
        // Technical Skills tags
        ...technicalSkills.map((skill, index) => ({
          id: `${id}-skill-${index}`,
          value: skill,
          metaExpertId: id,
          category: "technical_skills" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        })),
        // Seniority tag
        {
          id: `${id}-seniority`,
          value: seniority,
          metaExpertId: id,
          category: "seniority" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        },
        // Notable Milestones tags
        ...notableMilestones.map((milestone, index) => ({
          id: `${id}-milestone-${index}`,
          value: milestone,
          metaExpertId: id,
          category: "notable_milestones" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        })),
        // Degrees tags
        ...degrees.map((degree, index) => ({
          id: `${id}-degree-${index}`,
          value: degree,
          metaExpertId: id,
          category: "degrees" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        })),
        // Education tags
        ...education.map((edu, index) => ({
          id: `${id}-education-${index}`,
          value: edu,
          metaExpertId: id,
          category: "education" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        })),
        // Location tag
        {
          id: `${id}-location`,
          value: location,
          metaExpertId: id,
          category: "location" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        },
        // Language Proficiency tags
        ...languages.map((lang, index) => ({
          id: `${id}-language-${index}`,
          value: lang,
          metaExpertId: id,
          category: "language_proficiency" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        })),
        // Vendor/Tool Usage tags
        ...vendorTools.map((tool, index) => ({
          id: `${id}-tool-${index}`,
          value: tool,
          metaExpertId: id,
          category: "vendor_tools" as TagCategory,
          startDate: null,
          endDate: null,
          yearlyFrequency: null,
          dateRecorded: null,
          organizationId: "",
        })),
        // Conversation topics - randomly select 3-5 topics
        ...Array.from(
          { length: Math.floor(Math.random() * 3) + 3 },
          (_, index) => {
            const topic = [...CONVERSATION_TOPICS][
              Math.floor(Math.random() * CONVERSATION_TOPICS.length)
            ];
            return {
              id: `${id}-topic-${index}`,
              value: topic,
              metaExpertId: id,
              category: "conversation_topic" as TagCategory,
              startDate: null,
              endDate: null,
              yearlyFrequency: null,
              dateRecorded: null,
              organizationId: "",
            };
          }
        ),
      ];

      return {
        id: id,
        name: fullName,
        profession: seniority,
        company: company,
        description: `${seniority} professional with expertise in ${primaryIndustry} (${subIndustry}). Currently at ${company} focusing on ${functionalExpertise[0]} and ${technicalSkills[0]}.`,
        geography: location,
        linkedInLink: "https://linkedin.com",
        fraudFlag: false,
        profilePictureLink:
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `+1${String(index + 1).padStart(10, "0")}`,
        strikes: 0,
        linkedInCreationDate: new Date(2010 + Math.floor(index / 10), 0, 1),
        linkedInConnectionCount: 3000 + Math.floor(Math.random() * 4000),
        rating: Number(averageRating.toFixed(1)),
        jobs: allJobs,
        tags: expertTags.filter((tag) => tag.value !== undefined),
        favorite: false,
        callScheduled: false,
        dismissed: false,
        questions: questions,
        reviews: reviews,
      };
    }
  );

  return sampleExperts;
};

// Function to extract unique values from expert tags by category
const extractUniqueTagValues = (
  experts: MetaExpert[],
  category: TagCategory
): string[] => {
  const uniqueValues = new Set<string>();
  experts.forEach((expert) => {
    expert.tags
      .filter((tag) => tag.category === category)
      .forEach((tag) => uniqueValues.add(tag.value));
  });
  return Array.from(uniqueValues).sort();
};

// Create sample experts and derive filter options from them
const sampleExpertsList = createSampleExperts();

// Export available options for filters derived from actual expert data
export const availableFilterOptions = {
  companies: extractUniqueTagValues(sampleExpertsList, "company"),
  functionalExpertise: extractUniqueTagValues(
    sampleExpertsList,
    "functional_expertise"
  ),
  seniority: extractUniqueTagValues(sampleExpertsList, "seniority"),
  location: extractUniqueTagValues(sampleExpertsList, "location"),
  primaryIndustry: extractUniqueTagValues(
    sampleExpertsList,
    "primary_industry"
  ),
};
