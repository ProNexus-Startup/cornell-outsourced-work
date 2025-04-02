import React, { useState } from "react";
import { MapPin, Building2, Star, StarHalf } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type MetaExpert from "@/models/meta_expert";
import { Badge } from "@/components/ui/badge";
import AddExpertButton from "./AddExpertButton";
import { v4 as uuidv4 } from "uuid";
import linkedInIcon from "@/assets/icons/linkedin.png";
import StarRating from "@/components/StarRating";
interface MetaExpertCardProps {
  expert: MetaExpert;
  onSelect?: () => void;
  onProfileClick?: () => void;
  onExpertAdded?: (expertId: string) => void;
  profileTypeId?: string;
}

const MetaExpertCard = ({
  expert,
  onSelect,
  onProfileClick,
  onExpertAdded,
  profileTypeId,
}: MetaExpertCardProps) => {
  const [isAdding, setIsAdding] = useState(false);

  // Calculate rating using the same logic as MetaExpertDialog
  const rating =
    expert.rating ||
    (expert.reviews?.length
      ? expert.reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        expert.reviews.length
      : 0);

  const handleAddToAvailableExperts = async () => {
    setIsAdding(true);
    try {



      // Create an Expert object from the MetaExpert
      const newExpert = {
        id: uuidv4(),
        name: expert.name,
        email: expert.email || null,
        phone: expert.phone || null,
        company: expert.company || null,
        profession: expert.profession || null,
        metaExpertId: expert.id,
        geography: expert.geography || null,
        description: expert.description || null,
        linkedInLink: expert.linkedInLink || null,
        profilePictureLink: expert.profilePictureLink || null,
        //projectId: currentProject.id,
        //profileTypeId: profileTypeId || null,
        status: "Sourced",
        rating: expert.rating || null,
        linkedInConnectionCount: expert.linkedInConnectionCount || null,
        linkedInCreationDate: expert.linkedInCreationDate
          ? new Date(expert.linkedInCreationDate)
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
        jobs: expert.jobs || [],
      };

      //await IndexedDBService.updateExpert(newExpert);
      onExpertAdded?.(expert.id);
    } catch (error) {
      console.error("Error adding expert:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRequestScreening = () => {
    const subject = encodeURIComponent(`Screening Questions - ${expert.name}`);
    const body = encodeURIComponent(
      `Hi ${expert.name},\n\nWe would like to request your responses to our screening questions.`
    );
    window.location.href = `mailto:${expert.email}?subject=${subject}&body=${body}`;
  };

  const handleRequestAvailability = () => {
    const subject = encodeURIComponent(`Availability Request - ${expert.name}`);
    const body = encodeURIComponent(
      `Hi ${expert.name},\n\nWe would like to request your availability for a potential consultation.`
    );
    window.location.href = `mailto:${expert.email}?subject=${subject}&body=${body}`;
  };

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={onProfileClick}
    >
      <div className="absolute top-4 right-4">
        <AddExpertButton
          metaExpert={expert}
          //profileTypeId={profileTypeId || ""}
          //projectId={currentProject?.id || ""}
        />
      </div>
      <div className="flex items-start gap-4">
        {/* Left side - Checkbox and Image */}
        <div className="flex-shrink-0">
          {onSelect && (
            <Checkbox
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            />
          )}
        </div>
        {expert.profilePictureLink && (
          <img
            src={expert.profilePictureLink}
            alt={"expert.name"}
            className="w-12 h-12 rounded-full object-cover"
          />
        )}

        {/* Middle - Main Content */}
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{expert.name}</h3>
            {expert.linkedInLink && (
              <a
                href={expert.linkedInLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={linkedInIcon} alt="LinkedIn" className="w-4 h-4" />
              </a>
            )}
          </div>
          <StarRating rating={rating} numRaters={expert.reviews?.length || 0} />
          <p className="text-gray-600">{expert.profession}</p>

          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            {expert.company && (
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{expert.company}</span>
              </div>
            )}
            {expert.geography && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{expert.geography}</span>
              </div>
            )}
          </div>
          {expert.tags && expert.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {expert.tags.slice(0, 3).map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.value}
                </Badge>
              ))}
              {expert.tags.length > 3 && (
                <Badge variant="secondary">+{expert.tags.length - 3}</Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MetaExpertCard;
