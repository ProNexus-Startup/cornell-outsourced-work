import { Job } from "@/models/job";
import { v4 as uuidv4 } from "uuid";

const companies = [
  "Google",
  "Meta",
  "Apple",
  "Amazon",
  "Microsoft",
  "Netflix",
  "Tesla",
  "Uber",
  "Airbnb",
  "Stripe",
];

const roles = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "Engineering Manager",
  "Technical Lead",
  "Senior Developer",
  "Full Stack Engineer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Frontend Developer",
];

const locations = [
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Los Angeles, CA",
  "Chicago, IL",
  "Denver, CO",
  "Portland, OR",
  "Miami, FL",
];

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "E-commerce",
  "Entertainment",
  "Automotive",
  "Education",
  "Energy",
  "Real Estate",
  "Consulting",
];

const universities = [
  "Stanford University",
  "MIT",
  "Harvard University",
  "UC Berkeley",
  "Carnegie Mellon University",
  "Georgia Tech",
  "University of Michigan",
  "University of Washington",
  "University of Illinois",
  "Caltech",
];

const degrees = [
  "Bachelor of Science in Computer Science",
  "Master of Science in Computer Science",
  "Bachelor of Engineering",
  "Master of Business Administration",
  "Bachelor of Science in Data Science",
  "Master of Engineering",
  "PhD in Computer Science",
  "Bachelor of Arts in Mathematics",
  "Master of Science in AI",
  "Bachelor of Science in Software Engineering",
];

export const generateSampleJobs = (
  expertId: string,
  count: number = 3
): Job[] => {
  const jobs: Job[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const endDate =
      i === 0 ? now : new Date(now.getFullYear() - i, now.getMonth(), 1);
    const startDate = new Date(now.getFullYear() - (i + 1), now.getMonth(), 1);

    jobs.push({
      id: uuidv4(),
      metaExpertId: expertId,
      company: companies[Math.floor(Math.random() * companies.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      industry: industries[Math.floor(Math.random() * industries.length)],
      startDate,
      endDate,
      seniorityLevel: i === 0 ? "Senior" : i === 1 ? "Mid-Level" : "Junior",
      isEducation: false,
      type: "experience",
      description: `Led key initiatives and projects in ${
        roles[Math.floor(Math.random() * roles.length)]
      } role.`,
    });
  }

  return jobs;
};

export const generateSampleEducation = (
  expertId: string,
  count: number = 2
): Job[] => {
  const education: Job[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const endDate = new Date(now.getFullYear() - (i * 2 + 2), 5, 1); // June 1st of graduation year
    const startDate = new Date(now.getFullYear() - (i * 2 + 6), 8, 1); // September 1st of start year

    education.push({
      id: uuidv4(),
      metaExpertId: expertId,
      company: universities[Math.floor(Math.random() * universities.length)],
      role: degrees[Math.floor(Math.random() * degrees.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      startDate,
      endDate,
      isEducation: true,
      type: "education",
      description: "Graduated with honors",
    });
  }

  return education;
};
