import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Question {
  id: string;
  projectId: string;
  question: string;
  answer: string;
  displayOrder?: number;
}

interface MetaProjectQuestionsProps {
  questions: Question[];
  projectNames: Record<string, string>;
}

const MetaProjectQuestions: React.FC<MetaProjectQuestionsProps> = ({
  questions,
  projectNames,
}) => {
  // Group questions by project ID
  const groupedQuestions = questions.reduce((acc, question) => {
    const projectId = question.projectId || "unknown";
    if (!acc[projectId]) {
      acc[projectId] = [];
    }
    acc[projectId].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  // Sort questions within each project by display order
  Object.values(groupedQuestions).forEach((projectQuestions) => {
    projectQuestions.sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );
  });

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center py-6">
            No past projects found
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-8">
          {Object.entries(groupedQuestions).map(
            ([projectId, projectQuestions], index) => (
              <div key={projectId}>
                {index > 0 && <Separator className="mb-8" />}
                <h3 className="text-lg font-semibold mb-6">
                  {projectNames[projectId] || `Project ${projectId}`}
                </h3>
                <div className="space-y-6">
                  {projectQuestions.map((question, qIndex) => (
                    <div key={question.id} className="space-y-2">
                      <div className="font-medium text-sm text-muted-foreground">
                        {question.question}
                      </div>
                      <div className="text-sm pl-4">
                        {question.answer.split("\n").map((line, i) => (
                          <p key={i} className="mt-1">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaProjectQuestions;
