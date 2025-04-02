import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Loader2 } from "lucide-react";
import { Expert } from "@/models/expert";
import MetaExpert from "@/models/meta_expert";
import { v4 as uuidv4 } from "uuid";
interface AddExpertButtonProps {
  metaExpert: MetaExpert;
  //profileTypeId: string;
  //projectId: string;
  className?: string;
}

const AddExpertButton = ({
  metaExpert,
  //profileTypeId,
  //projectId,
  className = "",
}: AddExpertButtonProps) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddExpert = async () => {
    setIsAdding(true);
    try {
      // Debug: Check if token exists
      const tokenAvailable = !!localStorage.getItem("token");

      const newExpert: Expert = {
        id: uuidv4(),
        name: metaExpert?.name,
        profession: metaExpert?.profession || "",
        company: metaExpert?.company || "",
        description: metaExpert?.description,
        geography: metaExpert?.geography,
        //profileTypeId: profileTypeId,
        //projectId: projectId ?? uuidv4(),
        status: "Uncontacted",
        internalStatus: "Not Reviewed",
        linkedInLink: metaExpert?.linkedInLink,
        fraudFlag: metaExpert?.fraudFlag,
        profilePictureLink: metaExpert?.profilePictureLink,
        email: metaExpert?.email,
        phone: metaExpert?.phone,
        strikes: metaExpert?.strikes,
        linkedInCreationDate: metaExpert?.linkedInCreationDate,
        linkedInConnectionCount: metaExpert?.linkedInConnectionCount,
        rating: metaExpert?.rating,
        metaExpertId: metaExpert?.id || uuidv4(),
        favorite: false,
        callScheduled: false,
        dismissed: false,
        questions: [],
        availabilities: [],
        jobs: metaExpert?.jobs,
        screened: "Pipeline",
        firstSourced: true,
        checked: true,
        expertNetworkName: "Self-Sourced",
        percentEssential: 0,
        percentTotal: 0,
      };

      //await IndexedDBService.addExpert(newExpert);
    } catch (error) {
      console.error("Exception adding expert:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRequestScreening = () => {
    const [firstName, ...lastNameParts] = metaExpert?.name?.split(" ") || [];
    const email = `${firstName.charAt(0)}${lastNameParts.join(
      ""
    )}@gmail.com`.toLowerCase();

    //openMailtoLink({
    //  to: [email],
    //  subject: "Request for Screening Questions",
    //  body: `Dear ${metaExpert.name},\n\nI hope this email finds you well. We would like to learn more about your expertise and experience. Could you please take a moment to answer our screening questions?\n\nBest regards,`,
    //});
  };

  const handleRequestAvailability = () => {
    const [firstName, ...lastNameParts] = metaExpert?.name?.split(" ") || [];
    const email = `${firstName.charAt(0)}${lastNameParts.join(
      ""
    )}@gmail.com`.toLowerCase();

    //openMailtoLink({
    //  to: [email],
    //  subject: "Availability Request",
    //  body: `Dear ${metaExpert.name},\n\nI hope this email finds you well. We would like to schedule a consultation with you. Could you please share your availability for the upcoming week?\n\nBest regards,`,
    //});
  };

  return (
    <div className={`flex ${className}`}>
      <Button
        variant="default"
        className="rounded-r-none"
        disabled={isAdding}
        onClick={handleAddExpert}
      >
        {isAdding ? (
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
          <Button variant="default" className="rounded-l-none border-l-0 px-2">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleRequestScreening}>
            Request Screening
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleRequestAvailability}>
            Request Availability
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AddExpertButton;
