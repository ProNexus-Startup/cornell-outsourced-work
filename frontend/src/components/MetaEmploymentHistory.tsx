import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, MapPin, GraduationCap } from "lucide-react";
import type MetaExpert from "@/models/meta_expert";
import type { Job } from "@/models/job";

interface MetaEmploymentHistoryProps {
  expert: MetaExpert;
  type: "experience" | "education";
}

const MetaEmploymentHistory: React.FC<MetaEmploymentHistoryProps> = ({
  expert,
  type,
}) => {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Present";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const calculateDuration = (
    startDate: Date | string | null | undefined,
    endDate: Date | string | null | undefined
  ) => {
    if (!startDate) return "";

    const start =
      typeof startDate === "string" ? new Date(startDate) : startDate;
    const end = endDate
      ? typeof endDate === "string"
        ? new Date(endDate)
        : endDate
      : new Date();

    const diffInMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    const years = Math.floor(diffInMonths / 12);
    const months = diffInMonths % 12;

    if (years === 0) {
      return `${months} mo${months !== 1 ? "s" : ""}`;
    } else if (months === 0) {
      return `${years} yr${years !== 1 ? "s" : ""}`;
    } else {
      return `${years} yr${years !== 1 ? "s" : ""} ${months} mo${
        months !== 1 ? "s" : ""
      }`;
    }
  };

  // Filter jobs based on type and sort by date
  const filteredJobs = (expert.jobs || [])
    .filter((job) => job.type === type)
    .sort((a, b) => {
      const dateA = a.endDate ? new Date(a.endDate) : new Date();
      const dateB = b.endDate ? new Date(b.endDate) : new Date();
      return dateB.getTime() - dateA.getTime();
    });

  return (
    <Card>
      <CardContent className="p-6">
        {filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((job: Job) => (
              <div key={job.id} className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {type === "education" ? (
                      <GraduationCap className="w-6 h-6 text-gray-600" />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{job.role}</h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {formatDate(job.startDate)} -{" "}
                          {formatDate(job.endDate)} ·{" "}
                          {calculateDuration(job.startDate, job.endDate)}
                        </span>
                      </div>
                      {job.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                      )}
                    </div>
                    {type === "experience" && (
                      <div className="mt-2 space-x-2">
                        {job.industry && (
                          <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                            {job.industry}
                          </span>
                        )}
                        {job.subIndustry && (
                          <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                            {job.subIndustry}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">
            No {type} history available
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MetaEmploymentHistory;
