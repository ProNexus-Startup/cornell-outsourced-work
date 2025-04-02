import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowLeft, Loader2, ChevronDown, Check } from "lucide-react";
import type MetaExpert from "@/models/meta_expert";
import type { Job } from "@/models/job";
import {
  MetaExpertFilter,
  FilterCategory,
  FilterTiming,
  createMetaExpertFilter,
  metaExpertFilterFromJson,
  metaExpertFilterToJson,
} from "@/models/meta_expert_filter";
import IndexedDBService from "@/utils/idb";
import MetaExpertCard from "@/components/MetaExpertCard";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { v4 as uuidv4 } from "uuid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MetaExpertDialog from "@/components/MetaExpertDialog";
import {
  generateSampleReviews,
  generateSampleQuestions,
} from "@/utils/sample_data/sampleMetaExpertReviewsData";
import {
  generateSampleJobs,
  generateSampleEducation,
} from "@/utils/sample_data/sampleJobsData";
import { CONVERSATION_TOPICS, TagCategory } from "@/models/tag";

// Helper function to generate conversation topics for experts that don't have any
const generateConversationTopics = (expertId: string) => {
  // Generate between 3-7 random conversation topics
  const numTopics = Math.floor(Math.random() * 5) + 3;
  const topicsArray = [...CONVERSATION_TOPICS];
  const selectedTopics = new Set<string>();

  // Randomly select topics without duplicates
  while (
    selectedTopics.size < numTopics &&
    selectedTopics.size < topicsArray.length
  ) {
    const randomIndex = Math.floor(Math.random() * topicsArray.length);
    selectedTopics.add(topicsArray[randomIndex]);
  }

  // Convert to ExpertTag objects
  return Array.from(selectedTopics).map((topic, index) => ({
    id: `${expertId}-topic-${index}`,
    category: "conversation_topic" as TagCategory,
    value: topic,
    startDate: null,
    endDate: null,
    yearlyFrequency: null,
    dateRecorded: new Date(),
    metaExpertId: expertId,
    organizationId: "",
  }));
};

interface FilterSectionProps {
  title: string;
  category: FilterCategory;
  filters: MetaExpertFilter[];
  onRemoveFilter: (filterId: string) => void;
  onAddFilter: (filter: Omit<MetaExpertFilter, "id">) => void;
  onUpdateFilter: (
    filterId: string,
    updates: Partial<MetaExpertFilter>
  ) => void;
  availableOptions: string[];
}

const FilterSection = ({
  title,
  category,
  filters,
  onRemoveFilter,
  onAddFilter,
  onUpdateFilter,
  availableOptions,
}: FilterSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Filter out options that are already selected
  const filteredOptions = availableOptions.filter(
    (option) => !filters.some((filter) => filter.value === option)
  );

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          {filters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => filters.forEach((f) => onRemoveFilter(f.id))}
              className="h-7 px-2 text-xs"
            >
              Clear
            </Button>
          )}
          <Popover open={isAdding} onOpenChange={setIsAdding}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-medium">Add {title} Filter</h4>
              </div>
              <div className="p-4 space-y-4">
                <div className="relative">
                  <input
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={`Search ${title.toLowerCase()}...`}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto -mx-1 px-1">
                  {filteredOptions
                    .filter((option) =>
                      option.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((option) => (
                      <div
                        key={option}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        onClick={() => {
                          onAddFilter({
                            category,
                            value: option,
                            logic: "may_have",
                          });
                          setIsAdding(false);
                          setSearchValue("");
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  {filteredOptions.filter((option) =>
                    option.toLowerCase().includes(searchValue.toLowerCase())
                  ).length === 0 && (
                    <div className="px-3 py-2 text-gray-500">
                      No options found.
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {filters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              {filter.value}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFilter(filter.id)}
                className="h-4 w-4 p-0 hover:bg-transparent"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<MetaExpertFilter[]>([]);
  const [experts, setExperts] = useState<MetaExpert[]>([]);
  const [sampleExperts, setSampleExperts] = useState<MetaExpert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<MetaExpert | null>(null);
  const [searchDescription, setSearchDescription] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [profilePicError, setProfilePicError] = useState(false);
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [isQuestionsOpen, setIsQuestionsOpen] = useState(false);
  const [isLoadingExperts, setIsLoadingExperts] = useState(false);
  const [relatedExperts, setRelatedExperts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [projectNames, setProjectNames] = useState<Record<string, string>>({});
  const [selectedExperts, setSelectedExperts] = useState<Set<string>>(
    new Set()
  );
  const [isAddingMultiple, setIsAddingMultiple] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [availableOptions, setAvailableOptions] = useState<{
    companies: string[];
    roles: string[];
    seniority: string[];
    locations: string[];
    industries: string[];
  }>({
    companies: [],
    roles: [],
    seniority: [],
    locations: [],
    industries: [],
  });

  // Helper function to serialize filters to URL
  const serializeFiltersToURL = (filtersToSerialize: MetaExpertFilter[]) => {
    const params: Record<string, string> = {};

    if (filtersToSerialize.length > 0) {
      params.filters = JSON.stringify(
        filtersToSerialize.map(metaExpertFilterToJson)
      );
    }

    if (searchDescription) {
      params.description = searchDescription;
    }

    navigate(
      {
        search: new URLSearchParams(params).toString(),
      },
      { replace: true }
    );
  };

  // Helper function to deserialize filters from URL
  const deserializeFiltersFromURL = () => {
    const filtersParam = searchParams.get("filters");
    const descriptionParam = searchParams.get("description");

    if (filtersParam) {
      try {
        const parsedFilters = JSON.parse(filtersParam).map(
          metaExpertFilterFromJson
        );
        setFilters(parsedFilters);

        // Force a recalculation after a short delay to ensure state updates have propagated
        setTimeout(() => {
          setForceUpdate((prev) => prev + 1);
        }, 50);
      } catch (e) {
        console.error("Failed to parse filters from URL", e);
      }
    }

    if (descriptionParam) {
      setSearchDescription(descriptionParam);
    }
  };

  // Load filters from URL or location state
  useEffect(() => {
    // First check if we have filters in the URL
    const filtersParam = searchParams.get("filters");

    if (filtersParam) {
      // If we have filters in the URL, use those
      deserializeFiltersFromURL();
    } else if (location.state) {
      // Otherwise, use filters from location state if available
      const { filters: stateFilters, description } = location.state;
      if (stateFilters && Array.isArray(stateFilters)) {
        setFilters(stateFilters);
        // Save these filters to the URL for persistence, but don't create a new history entry
        const params: Record<string, string> = {};
        params.filters = JSON.stringify(
          stateFilters.map(metaExpertFilterToJson)
        );
        if (description) {
          params.description = description;
        }
        navigate(
          {
            search: new URLSearchParams(params).toString(),
          },
          { replace: true } // Use replace to avoid creating a new history entry
        );

        // Force a recalculation after a short delay to ensure state updates have propagated
        setTimeout(() => {
          setForceUpdate((prev) => prev + 1);
        }, 50);
      }
      if (description) {
        setSearchDescription(description);
      }
    }
    // Only run this effect when the component mounts or location changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // Force a re-calculation of filtered experts when filters change
  useEffect(() => {
    // This empty effect will cause the component to re-render when filters change
    // This is necessary because the filters might be loaded asynchronously
    setForceUpdate((prev) => prev + 1);
  }, [filters]);

  // Update URL when searchDescription changes
  useEffect(() => {
    if (searchDescription) {
      serializeFiltersToURL(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDescription]);

  // Improve the extractUniqueJobValues function to ensure it properly extracts values
  const extractUniqueJobValues = (experts: MetaExpert[]) => {
    const values = {
      companies: new Set<string>(),
      roles: new Set<string>(),
      seniority: new Set<string>(),
      locations: new Set<string>(),
      industries: new Set<string>(),
      subIndustries: new Set<string>(),
    };

    // Count how many jobs we're processing
    let jobCount = 0;

    experts.forEach((expert) => {
      // Collect job-based values
      expert.jobs.forEach((job) => {
        jobCount++;
        if (job.company) values.companies.add(job.company);
        if (job.role) values.roles.add(job.role);
        if (job.seniorityLevel) values.seniority.add(job.seniorityLevel);
        if (job.location) values.locations.add(job.location);
        if (job.industry) values.industries.add(job.industry);
        if (job.subIndustry) values.subIndustries.add(job.subIndustry);
      });
    });

    // Create the result object with sorted arrays
    const result = {
      companies: Array.from(values.companies).filter(Boolean).sort(),
      roles: Array.from(values.roles).filter(Boolean).sort(),
      seniority: Array.from(values.seniority).filter(Boolean).sort(),
      locations: Array.from(values.locations).filter(Boolean).sort(),
      industries: Array.from(values.industries).filter(Boolean).sort(),
      subIndustries: Array.from(values.subIndustries).filter(Boolean).sort(),
    };

    return result;
  };

  // Load experts and calculate available options
  useEffect(() => {
    const loadExperts = async () => {
      setIsLoading(true);
      try {
        const isTableEmpty = await IndexedDBService.makeMetaExpertTable();

        let metaExperts = await IndexedDBService.getAllMetaExperts();

        // Ensure job dates are properly parsed and add sample data
        metaExperts = metaExperts.map((expert) => {
          // Parse dates
          const parsedExpert = {
            ...expert,
            jobs: expert.jobs.map((job) => ({
              ...job,
              startDate:
                job.startDate && !(job.startDate instanceof Date)
                  ? new Date(job.startDate)
                  : job.startDate,
              endDate:
                job.endDate && !(job.endDate instanceof Date)
                  ? new Date(job.endDate)
                  : job.endDate,
            })),
          };

          // Generate sample jobs if none exist or if all existing jobs are education
          const hasExperienceJobs = parsedExpert.jobs.some(
            (job) => !job.isEducation
          );
          if (
            !parsedExpert.jobs ||
            parsedExpert.jobs.length === 0 ||
            !hasExperienceJobs
          ) {
            const sampleJobs = generateSampleJobs(expert.id);
            parsedExpert.jobs = [...(parsedExpert.jobs || []), ...sampleJobs];
          }

          // Generate sample education if none exists or if all existing jobs are experience
          const hasEducationJobs = parsedExpert.jobs.some(
            (job) => job.isEducation
          );
          if (!hasEducationJobs) {
            const sampleEducation = generateSampleEducation(expert.id);
            parsedExpert.jobs = [...parsedExpert.jobs, ...sampleEducation];
          }

          // Generate sample data if not exists
          if (!parsedExpert.reviews || parsedExpert.reviews.length === 0) {
            parsedExpert.reviews = generateSampleReviews(expert.id);
          }
          if (!parsedExpert.questions || parsedExpert.questions.length === 0) {
            parsedExpert.questions = generateSampleQuestions(expert.id);
          }

          // Calculate rating from reviews if not set
          if (!parsedExpert.rating && parsedExpert.reviews.length > 0) {
            parsedExpert.rating =
              parsedExpert.reviews.reduce(
                (sum, review) => sum + (review.rating || 0),
                0
              ) / parsedExpert.reviews.length;
          }

          // Generate conversation topics if none exist
          if (
            !parsedExpert.tags ||
            !parsedExpert.tags.some(
              (tag) => tag.category === "conversation_topic"
            )
          ) {
            const conversationTopics = generateConversationTopics(expert.id);
            parsedExpert.tags = [
              ...(parsedExpert.tags || []),
              ...conversationTopics,
            ];
          }

          return parsedExpert;
        });

        setExperts(metaExperts);
        setAvailableOptions(extractUniqueJobValues(metaExperts));

        // Re-apply current filters to trigger a re-render with the loaded experts
        setFilters((currentFilters) => [...currentFilters]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExperts();
  }, []);

  const handleRemoveTag = (tagId: string) => {
    const updatedFilters = filters.filter((filter) => filter.id !== tagId);
    setFilters(updatedFilters);
    serializeFiltersToURL(updatedFilters);
  };

  const handleAddTag = (category: FilterCategory, value: string) => {
    const newFilter = createMetaExpertFilter(category, value);
    setFilters((prevFilters) => {
      const updatedFilters = [...prevFilters, newFilter];
      serializeFiltersToURL(updatedFilters);
      return updatedFilters;
    });
  };

  const handleUpdateFilter = (
    filterId: string,
    updates: Partial<MetaExpertFilter>
  ) => {
    setFilters((prev) => {
      const updatedFilters = prev.map((f) =>
        f.id === filterId ? { ...f, ...updates } : f
      );
      serializeFiltersToURL(updatedFilters);
      return updatedFilters;
    });
  };

  // HELPER: Determine how many years ago a Date occurred
  const yearsAgo = (endDate: Date) => {
    const now = new Date();
    return (now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  };

  // HELPER: Does a job match the chosen timing filter?
  const jobMatchesTiming = (job: Job, timing?: FilterTiming) => {
    if (!timing) return true; // no timing filter => match anything

    // if "current", then endDate is either null or in the future:
    if (timing === "current") {
      return !job.endDate || job.endDate >= new Date();
    }

    // If job has no end date, it can't fall into a past range
    if (!job.endDate) return false;

    const yrs = yearsAgo(job.endDate);

    switch (timing) {
      case "1_2_years":
        // ended more than 1 year ago but ≤ 2
        return yrs > 1 && yrs <= 2;
      case "2_3_years":
        return yrs > 2 && yrs <= 3;
      case "3_4_years":
        return yrs > 3 && yrs <= 4;
      case "4_plus_years":
        return yrs > 4;
      default:
        return true;
    }
  };

  // Returns whether this expert passes the job-based filters for a given category
  const matchesJobBasedCategory = (
    expert: MetaExpert,
    categoryFilters: MetaExpertFilter[]
  ) => {
    if (categoryFilters.length === 0) return true;

    // Separate them out by logic
    const mustHave = categoryFilters.filter((f) => f.logic === "must_have");
    const cantHave = categoryFilters.filter((f) => f.logic === "cant_have");
    const mayHave = categoryFilters.filter((f) => f.logic === "may_have");

    // For must_have: Expert must have at least one job that matches each must-have filter
    for (const f of mustHave) {
      const foundMatchingJob = expert.jobs.some((job) => {
        // Check if job's relevant field matches the filter value AND timing
        let jobValue = "";
        if (f.category === "company") jobValue = job.company || "";
        if (f.category === "role") jobValue = job.role || "";
        if (f.category === "seniority") jobValue = job.seniorityLevel || "";
        if (f.category === "location") jobValue = job.location || "";
        if (f.category === "industry") jobValue = job.industry || "";

        return jobValue === f.value && jobMatchesTiming(job, f.timing);
      });
      // If we never found a matching job, fail the must-have
      if (!foundMatchingJob) return false;
    }

    // For cant_have: Expert fails if we find any job that matches
    for (const f of cantHave) {
      const foundForbiddenJob = expert.jobs.some((job) => {
        let jobValue = "";
        if (f.category === "company") jobValue = job.company || "";
        if (f.category === "role") jobValue = job.role || "";
        if (f.category === "seniority") jobValue = job.seniorityLevel || "";
        if (f.category === "location") jobValue = job.location || "";
        if (f.category === "industry") jobValue = job.industry || "";

        return jobValue === f.value && jobMatchesTiming(job, f.timing);
      });
      // If we found a job that matches a "can't have," exclude
      if (foundForbiddenJob) return false;
    }

    // For may_have: If there are only may_have filters, include the expert if any job matches any filter
    if (mustHave.length === 0 && cantHave.length === 0 && mayHave.length > 0) {
      // If there are only may_have filters, at least one job should match at least one filter
      const hasMatchingJob = expert.jobs.some((job) => {
        return mayHave.some((f) => {
          let jobValue = "";
          if (f.category === "company") jobValue = job.company || "";
          if (f.category === "role") jobValue = job.role || "";
          if (f.category === "seniority") jobValue = job.seniorityLevel || "";
          if (f.category === "location") jobValue = job.location || "";
          if (f.category === "industry") jobValue = job.industry || "";

          return jobValue === f.value && jobMatchesTiming(job, f.timing);
        });
      });

      return mayHave.length === 0 || hasMatchingJob;
    }

    // If we pass all must-have & can't-have checks, we're good
    return true;
  };

  // Main filter logic using useMemo to recalculate when filters change
  const displayExperts = useMemo(() => {
    return (experts.length > 0 ? experts : sampleExperts).filter((expert) => {
      // Group the filters by category
      const companyFilters = filters.filter((f) => f.category === "company");
      const roleFilters = filters.filter((f) => f.category === "role");
      const seniorityFilters = filters.filter(
        (f) => f.category === "seniority"
      );
      const locationFilters = filters.filter((f) => f.category === "location");
      const industryFilters = filters.filter((f) => f.category === "industry");

      // If no filters are applied, show all experts
      if (filters.length === 0) {
        return true;
      }

      // Check job-based categories
      const passesCompany = matchesJobBasedCategory(expert, companyFilters);
      const passesRole = matchesJobBasedCategory(expert, roleFilters);
      const passesSeniority = matchesJobBasedCategory(expert, seniorityFilters);
      const passesLocation = matchesJobBasedCategory(expert, locationFilters);
      const passesIndustry = matchesJobBasedCategory(expert, industryFilters);

      return (
        passesCompany &&
        passesRole &&
        passesSeniority &&
        passesLocation &&
        passesIndustry
      );
    });
  }, [experts, sampleExperts, filters, forceUpdate]);

  const handleClearFilters = () => {
    setFilters([]);
    serializeFiltersToURL([]);
  };

  const handleExpertAdded = (expertId: string) => {
    // Remove the expert from both experts and sampleExperts
    setExperts(experts.filter((e) => e.id !== expertId));
    setSampleExperts(sampleExperts.filter((e) => e.id !== expertId));
  };

  // Add keyboard shortcut for back navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Alt+Left Arrow (browser back) or Backspace when not in an input
      if (
        (e.altKey && e.key === "ArrowLeft") ||
        (e.key === "Backspace" &&
          !(
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            e.target instanceof HTMLSelectElement
          ))
      ) {
        e.preventDefault();
        window.history.back();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleToggleExpertSelection = (expertId: string) => {
    setSelectedExperts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(expertId)) {
        newSet.delete(expertId);
      } else {
        newSet.add(expertId);
      }
      return newSet;
    });
  };

  const handleAddSelectedExpertsToProject = async () => {
    setIsAddingMultiple(true);
    try {

      // Get all selected experts
      const expertsToAdd = displayExperts.filter((expert) =>
        selectedExperts.has(expert.id)
      );

      for (const expertToAdd of expertsToAdd) {
        // Create an Expert object from the MetaExpert
        const newExpert = {
          id: uuidv4(),
          name: expertToAdd?.name,
          email: expertToAdd?.email || null,
          phone: expertToAdd?.phone || null,
          company: expertToAdd?.company || null,
          profession: expertToAdd?.profession || null,
          metaExpertId: expertToAdd?.id,
          geography: expertToAdd?.geography || null,
          description: expertToAdd?.description || null,
          linkedInLink: expertToAdd?.linkedInLink || null,
          profilePictureLink: expertToAdd?.profilePictureLink || null,
          //projectId: currentProject.id,
          profileTypeId: location.state?.profileTypeId || null,
          status: "Sourced",
          rating: expertToAdd?.rating || null,
          linkedInConnectionCount: expertToAdd?.linkedInConnectionCount || null,
          linkedInCreationDate: expertToAdd?.linkedInCreationDate
            ? new Date(expertToAdd.linkedInCreationDate)
            : null,
          favorite: false,
          callScheduled: false,
          dismissed: false,
          screened: "false",
          firstSourced: true,
          checked: true,
          showInExpertTable: true,
          questions: [],
          availabilities: [],
          jobs: expertToAdd?.jobs || [],
        };

        //await IndexedDBService.updateExpert(newExpert);
        handleExpertAdded(expertToAdd?.id || "");
      }

      // Clear selections after adding
      setSelectedExperts(new Set());
    } catch (error) {
      console.error("Error adding experts:", error);
    } finally {
      setIsAddingMultiple(false);
    }
  };

  const handleHideSelectedExperts = () => {
    // Remove selected experts from both experts and sampleExperts lists
    setExperts((prev) =>
      prev.filter((expert) => !selectedExperts.has(expert.id))
    );
    setSampleExperts((prev) =>
      prev.filter((expert) => !selectedExperts.has(expert.id))
    );
    setSelectedExperts(new Set());
  };

  const handleRequestScreening = () => {
    if (!selectedExpert?.email) return;
    const subject = encodeURIComponent(
      `Screening Questions - ${selectedExpert.name}`
    );
    const body = encodeURIComponent(
      `Hi ${selectedExpert.name},\n\nWe would like to request your responses to our screening questions.`
    );
    window.location.href = `mailto:${selectedExpert.email}?subject=${subject}&body=${body}`;
  };

  const handleRequestAvailability = () => {
    if (!selectedExpert?.email) return;
    const subject = encodeURIComponent(
      `Availability Request - ${selectedExpert.name}`
    );
    const body = encodeURIComponent(
      `Hi ${selectedExpert.name},\n\nWe would like to request your availability for a potential consultation.`
    );
    window.location.href = `mailto:${selectedExpert.email}?subject=${subject}&body=${body}`;
  };

  const handleExpertClick = (expert: MetaExpert) => {
    setSelectedExpert(expert);
  };

  const handleExpertDialogClose = () => {
    // Use setTimeout to ensure the animation completes before clearing the expert
    setTimeout(() => {
      setSelectedExpert(null);
    }, 100);
  };

  const handleAddToAvailableExperts = async () => {
    setIsAdding(true);
    try {

      // Create an Expert object from the MetaExpert
      const newExpert = {
        id: uuidv4(),
        name: selectedExpert?.name,
        email: selectedExpert?.email || null,
        phone: selectedExpert?.phone || null,
        company: selectedExpert?.company || null,
        profession: selectedExpert?.profession || null,
        metaExpertId: selectedExpert?.id,
        geography: selectedExpert?.geography || null,
        description: selectedExpert?.description || null,
        linkedInLink: selectedExpert?.linkedInLink || null,
        profilePictureLink: selectedExpert?.profilePictureLink || null,
        //projectId: currentProject.id,
        profileTypeId: location.state?.profileTypeId || null,
        status: "Sourced",
        rating: selectedExpert?.rating || null,
        linkedInConnectionCount:
          selectedExpert?.linkedInConnectionCount || null,
        linkedInCreationDate: selectedExpert?.linkedInCreationDate
          ? new Date(selectedExpert.linkedInCreationDate)
          : null,
        favorite: false,
        callScheduled: false,
        dismissed: false,
        screened: "false",
        firstSourced: true,
        checked: true,
        showInExpertTable: true,
        questions: [],
        availabilities: [],
        jobs: selectedExpert?.jobs || [],
      };

      //await IndexedDBService.updateExpert(newExpert);
      handleExpertAdded(selectedExpert?.id || "");
    } catch (error) {
      console.error("Error adding expert:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Side - Filters */}
      <div className="w-1/3 border-r border-gray-200 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Use the browser's history API to go back
                window.history.back();
              }}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold">Filters</h2>
          </div>
          {filters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        {searchDescription && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-semibold mb-1">Search Description</h3>
            <p className="text-sm text-gray-700">{searchDescription}</p>
          </div>
        )}

        {/* ===== JOB-BASED FILTER SECTIONS ===== */}
        <FilterSection
          title="Company"
          category="company"
          filters={filters.filter((f) => f.category === "company")}
          onRemoveFilter={handleRemoveTag}
          onAddFilter={(filter) => handleAddTag("company", filter.value)}
          onUpdateFilter={handleUpdateFilter}
          availableOptions={availableOptions.companies}
        />
        <FilterSection
          title="Role / Title"
          category="role"
          filters={filters.filter((f) => f.category === "role")}
          onRemoveFilter={handleRemoveTag}
          onAddFilter={(filter) => handleAddTag("role", filter.value)}
          onUpdateFilter={handleUpdateFilter}
          availableOptions={availableOptions.roles}
        />
        <FilterSection
          title="Seniority"
          category="seniority"
          filters={filters.filter((f) => f.category === "seniority")}
          onRemoveFilter={handleRemoveTag}
          onAddFilter={(filter) => handleAddTag("seniority", filter.value)}
          onUpdateFilter={handleUpdateFilter}
          availableOptions={availableOptions.seniority}
        />
        <FilterSection
          title="Location"
          category="location"
          filters={filters.filter((f) => f.category === "location")}
          onRemoveFilter={handleRemoveTag}
          onAddFilter={(filter) => handleAddTag("location", filter.value)}
          onUpdateFilter={handleUpdateFilter}
          availableOptions={availableOptions.locations}
        />
        <FilterSection
          title="Industry"
          category="industry"
          filters={filters.filter((f) => f.category === "industry")}
          onRemoveFilter={handleRemoveTag}
          onAddFilter={(filter) => handleAddTag("industry", filter.value)}
          onUpdateFilter={handleUpdateFilter}
          availableOptions={availableOptions.industries}
        />
      </div>

      {/* Right Side - Results */}
      <div className="w-2/3 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">
            Results ({displayExperts.length})
          </h2>
          <div className="flex items-center gap-2">
            {selectedExperts.size > 0 && (
              <>
                <div className="flex">
                  <Button
                    variant="default"
                    className="rounded-r-none"
                    disabled={isAddingMultiple}
                    onClick={handleAddSelectedExpertsToProject}
                  >
                    {isAddingMultiple ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add to Pipeline"
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default"
                        className="rounded-l-none border-l-0 px-2"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleRequestScreening}>
                        Request Screening (Sample)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleRequestAvailability}>
                        Request Availability (Sample)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : displayExperts.length > 0 ? (
          <div className="space-y-4">
            {displayExperts.map((expert) => (
              <div key={expert.id} className="flex items-start">
                <div className="pt-2 pr-2">
                  <div
                    className={`w-5 h-5 border rounded flex items-center justify-center cursor-pointer 
                      ${
                        selectedExperts.has(expert.id)
                          ? "bg-primary border-primary"
                          : "border-gray-300"
                      }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleExpertSelection(expert.id);
                    }}
                  >
                    {selectedExperts.has(expert.id) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <MetaExpertCard
                    expert={expert}
                    onProfileClick={() => handleExpertClick(expert)}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No experts match your filters
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your filter criteria or removing some filters
            </p>
          </div>
        )}
      </div>

      {/* Replace the old Sheet component with the new MetaExpertDialog */}
      <MetaExpertDialog
        expert={selectedExpert}
        onClose={handleExpertDialogClose}
        onAddToAvailableExperts={handleAddToAvailableExperts}
        onRequestScreening={handleRequestScreening}
        onRequestAvailability={handleRequestAvailability}
        isAddingExpert={isAdding}
        projectNames={projectNames}
        relatedExperts={relatedExperts}
        isLoadingExperts={isLoadingExperts}
        profileTypeId={location.state?.profileTypeId}
      />
    </div>
  );
};

export default FilterResultsPage;
