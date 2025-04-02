import ExpertTag, { expertTagFromJson } from "./expert_tag";
import { Job, jobFromJson } from "./job";
import { Review, reviewFromJson } from "./review";

interface MetaExpert {
  id: string;
  name: string;
  profession: string;
  company: string;
  description: string | null;
  geography: string;
  linkedInLink: string | null;
  fraudFlag: boolean;
  profilePictureLink: string | null;
  email: string | null;
  phone: string | null;
  strikes: number;
  linkedInCreationDate: Date | null;
  linkedInConnectionCount: number | null;
  rating: number;
  numRaters?: number;
  tags: ExpertTag[];
  jobs: Job[];
  favorite?: boolean;
  callScheduled?: boolean;
  dismissed?: boolean;
  questions?: any[];
  reviews: Review[];
}

export const metaExpertFromJson = (json: any): MetaExpert => {
  return {
    id: json.id || "",
    name: json.name || "",
    profession: json.profession || "",
    company: json.company || "",
    description: json.description || null,
    geography: json.geography || "",
    linkedInLink: json.linkedInLink || null,
    fraudFlag: json.fraudFlag || false,
    profilePictureLink: json.profilePictureLink || null,
    email: json.email || null,
    phone: json.phone || null,
    strikes: json.strikes || 0,
    linkedInCreationDate: json.linkedInCreationDate
      ? new Date(json.linkedInCreationDate)
      : null,
    linkedInConnectionCount: json.linkedInConnectionCount || null,
    rating: json.rating || 0,
    numRaters: json.numRaters || 0,
    tags: Array.isArray(json.tags)
      ? json.tags.map((tag: any) => expertTagFromJson(tag))
      : [],
    jobs: Array.isArray(json.jobs)
      ? json.jobs.map((job: any) => jobFromJson(job))
      : [],
    favorite: json.favorite || false,
    callScheduled: json.callScheduled || false,
    dismissed: json.dismissed || false,
    questions: json.questions || [],
    reviews: Array.isArray(json.reviews)
      ? json.reviews.map((review: any) => reviewFromJson(review))
      : [],
  };
};

export default MetaExpert;
