import React, { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Star,
  StarHalf,
  Rocket,
  Building2,
  GraduationCap,
  X,
  Code,
  Database,
  Car,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  LineChart,
  GitBranch,
  ShieldCheck,
  Cpu,
  Zap,
  BookOpen,
  Clock,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { EditModeProvider } from "@/contexts/EditModeContext";
import MetaEmploymentHistory from "@/components/MetaEmploymentHistory";
import type MetaExpert from "@/models/meta_expert";
import type { Highlight } from "@/models/highlight";
import HighlightCard from "@/components/HighlightCard";
import linkedInIcon from "@/assets/icons/linkedin.png";
import { cn } from "@/lib/utils";
import MetaProjectQuestions from "@/components/MetaProjectQuestions";
import TopicTags from "@/components/TopicTags";
import AddExpertButton from "@/components/AddExpertButton";
import StarRating from "@/components/StarRating";

interface MetaExpertDialogProps {
  expert: MetaExpert | null;
  onClose: () => void;
  onAddToAvailableExperts: () => void;
  onRequestScreening: () => void;
  onRequestAvailability: () => void;
  isAddingExpert?: boolean;
  projectNames?: Record<string, string>;
  relatedExperts?: any[];
  isLoadingExperts?: boolean;
  profileTypeId?: string;
}

// Generate random highlights based on expert background
const getRandomHighlights = (expert: MetaExpert): Highlight[] => {
  // Group highlights by category to ensure mutual exclusivity
  const highlightCategories = {
    company: [
      {
        id: "1",
        icon: Building2,
        title: "Amazon Experience",
        description: "Worked at Amazon developing scalable solutions",
      },
      {
        id: "2",
        icon: Building2,
        title: "Airbnb Experience",
        description: "Contributed to Airbnb's core platform services",
      },
      {
        id: "3",
        icon: Building2,
        title: "Uber Experience",
        description: "Developed key systems at Uber's technology division",
      },
    ],
    education: [
      {
        id: "4",
        icon: GraduationCap,
        title: "Masters of Data Science",
        description: "Recently graduated from with a Masters of Data Science",
      },
      {
        id: "5",
        icon: GraduationCap,
        title: "University of Illinois",
        description:
          "Graduated from University of Illinois with technical degree",
      },
      {
        id: "6",
        icon: GraduationCap,
        title: "Computer Science Degree",
        description: "Holds a degree in Computer Science with honors",
      },
    ],
    role: [
      {
        id: "7",
        icon: Briefcase,
        title: "Data Science Expert",
        description: "Specializes in machine learning and predictive analytics",
      },
      {
        id: "8",
        icon: Code,
        title: "Software Engineering",
        description: "Strong background in full-stack development",
      },
      {
        id: "9",
        icon: Users,
        title: "Technical Leadership",
        description: "Led cross-functional engineering teams to success",
      },
    ],
    techExpertise: [
      {
        id: "10",
        icon: Database,
        title: "Big Data Experience",
        description: "Worked with petabyte-scale data systems",
      },
      {
        id: "11",
        icon: Car,
        title: "Automotive Tech",
        description: "Specialized in connected vehicle technologies",
      },
      {
        id: "12",
        icon: Cpu,
        title: "AI Implementation",
        description: "Deployed AI solutions in production environments",
      },
      {
        id: "13",
        icon: GitBranch,
        title: "DevOps Expertise",
        description: "Implemented CI/CD pipelines and cloud infrastructure",
      },
      {
        id: "14",
        icon: LineChart,
        title: "Analytics Systems",
        description: "Built data analytics platforms for business insights",
      },
      {
        id: "15",
        icon: ShieldCheck,
        title: "Security Background",
        description: "Implemented robust security protocols for tech products",
      },
      {
        id: "16",
        icon: Zap,
        title: "Performance Optimization",
        description: "Specialized in optimizing system performance",
      },
    ],
    experience: [
      {
        id: "17",
        icon: Rocket,
        title: "Early Stage Startup",
        description: "Experience at pre-Series A technology startups",
      },
      {
        id: "18",
        icon: TrendingUp,
        title: "Growth Stage Experience",
        description: "Scaled systems during hypergrowth phases",
      },
      {
        id: "19",
        icon: Clock,
        title: "Mid-Level Experience",
        description: "5+ years of specialized industry experience",
      },
      {
        id: "20",
        icon: Building2,
        title: "Tech & Auto Industries",
        description:
          "Experience spanning both technology and automotive sectors",
      },
    ],
    achievement: [
      {
        id: "21",
        icon: Award,
        title: "Industry Recognition",
        description: "Received awards for technical contributions",
      },
      {
        id: "22",
        icon: BookOpen,
        title: "Research Publications",
        description: "Published research in relevant technical fields",
      },
      {
        id: "23",
        icon: Users,
        title: "Cross-functional Teams",
        description:
          "Collaborated across engineering, product, and design teams",
      },
    ],
  };

  // Select one random highlight from each category
  const selectedHighlights: Highlight[] = [];

  // Get array of category keys
  const categories = Object.keys(highlightCategories);

  // Randomly select 3 categories
  const shuffledCategories = [...categories].sort(() => 0.5 - Math.random());
  const selectedCategories = shuffledCategories.slice(0, 3);

  // Select one random highlight from each selected category
  selectedCategories.forEach((category) => {
    const options =
      highlightCategories[category as keyof typeof highlightCategories];
    const randomIndex = Math.floor(Math.random() * options.length);
    selectedHighlights.push(options[randomIndex]);
  });

  return selectedHighlights;
};

const MetaExpertDialog: React.FC<MetaExpertDialogProps> = ({
  expert,
  onClose,
  onAddToAvailableExperts,
  onRequestScreening,
  onRequestAvailability,
  isAddingExpert = false,
  projectNames = {},
  relatedExperts = [],
  isLoadingExperts = false,
  profileTypeId,
}) => {
  const [profilePicError, setProfilePicError] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  // Use the reviews and questions directly from the expert object
  const reviews = expert?.reviews || [];
  const questions = expert?.questions || [];
  const rating = expert?.rating || 0;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (!expert) return null;

  // Use our random highlight generator instead of hardcoded highlights
  const highlights = getRandomHighlights(expert);

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "experiences", label: "Experiences" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Past Projects" },
    { id: "reviews", label: "Reviews" },
    { id: "topics", label: "Topics to Speak to" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = sectionsRef.current[sectionId];
    const container = contentRef.current;

    if (element && container) {
      const headerOffset = 80;
      const containerTop = container.getBoundingClientRect().top;
      const elementTop = element.getBoundingClientRect().top;
      const relativeElementTop = elementTop - containerTop;

      container.scrollTo({
        top: container.scrollTop + relativeElementTop - headerOffset,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
    }
  };

  // Update active section based on scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollTop + container.offsetHeight / 3;

    let currentSection = sections[0].id;
    for (const section of sections) {
      const element = sectionsRef.current[section.id];
      if (element) {
        const elementTop = element.offsetTop;
        if (scrollPosition >= elementTop) {
          currentSection = section.id;
        }
      }
    }

    if (currentSection !== activeSection) {
      setActiveSection(currentSection);
    }
  };

  return (
    <Sheet open={!!expert} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-4xl p-0 flex flex-col"
      >
        <EditModeProvider>
          {/* Accessibility title for screen readers */}
          <SheetTitle className="sr-only">
            Expert Profile: {expert.name}
          </SheetTitle>

          {/* Sticky Navigation */}
          <div className="sticky top-0 z-10 bg-background flex-none border-b">
            <div className="flex items-center justify-between px-6 py-2">
              <div className="flex space-x-4 overflow-x-auto">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                      activeSection === section.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
              <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>
          </div>

          {/* Scrollable Content */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto"
            onScroll={handleScroll}
          >
            <div className="space-y-8 p-6">
              {/* Expert Profile Section */}
              <div ref={(el) => (sectionsRef.current["overview"] = el)}>
                <Card className="p-6">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="relative w-24 h-24">
                      <img
                        src={
                          expert.profilePictureLink ||
                          "https://via.placeholder.com/96x96?text=No+Image"
                        }
                        alt={expert.name}
                        className={cn(
                          "w-24 h-24 rounded-full object-cover",
                          profilePicError && "hidden"
                        )}
                        onError={() => setProfilePicError(true)}
                      />
                      {profilePicError && (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">
                              {expert.name}
                            </h1>
                            {expert.linkedInLink && (
                              <a
                                href={expert.linkedInLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <img
                                  src={linkedInIcon}
                                  alt="LinkedIn"
                                  className="w-5 h-5"
                                />
                              </a>
                            )}
                          </div>
                          <StarRating
                            rating={rating}
                            numRaters={reviews.length}
                          />
                        </div>
                        <AddExpertButton
                          metaExpert={expert}
                          //profileTypeId={profileTypeId || ""}
                          //projectId={currentProject?.id || ""}
                        />
                      </div>
                      <p className="text-lg text-gray-600 mt-1">
                        {expert.profession}
                      </p>
                      <p className="text-gray-600">{expert.company}</p>
                      {expert.geography && (
                        <div className="flex items-center mt-2 text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{expert.geography}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-700">{expert.description}</p>
                  </div>
                </Card>

                {/* Highlights Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {highlights.map((highlight) => (
                    <HighlightCard key={highlight.id} highlight={highlight} />
                  ))}
                </div>
              </div>

              {/* Experiences Section */}
              <div ref={(el) => (sectionsRef.current["experiences"] = el)}>
                <h2 className="text-2xl font-semibold mb-4">Experiences</h2>
                <MetaEmploymentHistory expert={expert} type="experience" />
              </div>

              {/* Education Section */}
              <div ref={(el) => (sectionsRef.current["education"] = el)}>
                <h2 className="text-2xl font-semibold mb-4">Education</h2>
                <MetaEmploymentHistory expert={expert} type="education" />
              </div>

              {/* Projects Section */}
              <div ref={(el) => (sectionsRef.current["projects"] = el)}>
                <h2 className="text-2xl font-semibold mb-4">
                  Past Project Questions
                </h2>
                <MetaProjectQuestions
                  questions={questions}
                  projectNames={
                    questions.length > 0
                      ? Object.fromEntries(
                          questions.map((q) => [q.projectId, q.projectName])
                        )
                      : projectNames || {}
                  }
                />
              </div>

              {/* Reviews Section */}
              <div ref={(el) => (sectionsRef.current["reviews"] = el)}>
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <Card>
                  <CardContent className="p-6 space-y-4">
                    {reviews.map((review, index) => (
                      <div
                        key={review.id}
                        className={cn(
                          "pb-4",
                          index < reviews.length - 1 &&
                            "border-b border-gray-200"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <StarRating
                            rating={review.rating || 0}
                            showNumRaters={false}
                          />
                          <span className="text-sm text-gray-500">
                            {review.date?.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Topics Section */}
              <div ref={(el) => (sectionsRef.current["topics"] = el)}>
                <h2 className="text-2xl font-semibold mb-4">
                  Topics to Speak to
                </h2>
                <TopicTags tags={expert.tags} />
              </div>
            </div>
          </div>
        </EditModeProvider>
      </SheetContent>
    </Sheet>
  );
};

export default MetaExpertDialog;
