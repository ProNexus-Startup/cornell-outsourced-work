import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import type ExpertTag from "@/models/expert_tag";

interface TopicTagsProps {
  tags: ExpertTag[];
}

const TopicTags: React.FC<TopicTagsProps> = ({ tags }) => {
  const formatDate = (date: Date | null) => {
    if (!date) return null;
    return format(new Date(date), "MMM d, yyyy");
  };

  if (tags.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center py-6">
            No topics found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            {tags.map((tag) => (
              <Tooltip key={tag.id}>
                <TooltipTrigger asChild>
                  <div>
                    <Badge variant="secondary" className="cursor-help">
                      {tag.value}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1 text-sm">
                    {(tag.startDate || tag.endDate) && (
                      <p>
                        Period: {formatDate(tag.startDate)} -{" "}
                        {formatDate(tag.endDate)}
                      </p>
                    )}
                    {tag.yearlyFrequency && (
                      <p>Yearly Frequency: {tag.yearlyFrequency}</p>
                    )}
                    {tag.dateRecorded && (
                      <p>Last Updated: {formatDate(tag.dateRecorded)}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicTags;
