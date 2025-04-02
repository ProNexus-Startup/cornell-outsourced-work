import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Highlight } from "@/models/highlight";
import { LucideIcon } from "lucide-react";

interface HighlightCardProps {
  highlight: Highlight;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ highlight }) => {
  return (
    <Card className="bg-white/5 hover:bg-white/10 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {typeof highlight.icon === "string" ? (
              <span className="text-2xl">{highlight.icon}</span>
            ) : (
              <highlight.icon className="w-6 h-6" />
            )}
            <h3 className="text-lg font-semibold">{highlight.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {highlight.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HighlightCard;
