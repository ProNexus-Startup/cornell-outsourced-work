import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type MetaExpert from "@/models/meta_expert";
import IndexedDBService from "@/utils/idb";

const SelfSourcePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProfileType, setSelectedProfileType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [placeholderText, setPlaceholderText] = useState<string>(
    "Describe the type of expert you're looking for..."
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDbInitializing, setIsDbInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<MetaExpert | null>(null);
  const [isExpertDialogOpen, setIsExpertDialogOpen] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await IndexedDBService.initializeDatabase();
      } catch (error) {
        console.error("Error initializing database:", error);
      } finally {
        setIsDbInitializing(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const loadProject = async () => {
      try {

        // Check if we have state from navigation
        if (location.state) {
          const {
            description: savedDescription,
            profileTypeId: savedProfileTypeId,
          } = location.state;
          if (savedDescription) setDescription(savedDescription);
          if (savedProfileTypeId) {
            setSelectedProfileType(savedProfileTypeId);
          }
        }
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [location]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Sleep function to simulate waiting
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

      // Simulate API call delay
      await sleep(1500);

      // Mock filters instead of API call
      const filters = [
        // Company filters
        { id: "1", category: "company", value: "Amazon", logic: "OR" },
        { id: "2", category: "company", value: "Airbnb", logic: "OR" },

        { id: "4", category: "company", value: "Uber", logic: "OR" },

        // Role/Title filters
        { id: "5", category: "role", value: "Data Scientist", logic: "OR" },
        { id: "6", category: "role", value: "Software Engineer", logic: "OR" },
        { id: "7", category: "role", value: "Senior Developer", logic: "OR" },
        { id: "8", category: "role", value: "Technical Lead", logic: "OR" },

        // Seniority filters
        { id: "9", category: "seniority", value: "Mid-Level", logic: "OR" },

        // Location filters
        { id: "10", category: "location", value: "Chicago, IL", logic: "OR" },
        { id: "11", category: "location", value: "Denver, CO", logic: "OR" },
        { id: "12", category: "location", value: "New York, NY", logic: "OR" },

        // Industry filters
        { id: "13", category: "industry", value: "Technology", logic: "OR" },
        { id: "14", category: "industry", value: "Automotive", logic: "OR" },
      ];

      // Navigate to the filter results page with the filters
      navigate("/self-source/results", {
        state: {
          filters: filters,
          description: description,
          profileTypeId: selectedProfileType,
        },
      });
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate("/self-source/results", {
      state: {
        filters: [],
        description: "",
        profileTypeId: "",
      },
    });
  };

  const handleExpertSelected = (expert: MetaExpert) => {
    setSelectedExpert(expert);
    setIsExpertDialogOpen(true);
  };

  const handleExpertAdded = (expertId: string) => {
    // Close the dialog
    setIsExpertDialogOpen(false);
  };

  if (isDbInitializing || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Search Internal Database</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Type</label>
          <Select
            value={selectedProfileType}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select a profile type" />
            </SelectTrigger>
            <SelectContent>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Expert Description</label>
          <Textarea
            placeholder={placeholderText}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px] bg-white"
          />
          <p className="text-sm text-gray-500">
            Describe the expert you're looking for, including details like
            industry experience, roles, companies, locations, or seniority
            levels.
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedProfileType || !description || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Find Experts"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelfSourcePage;
