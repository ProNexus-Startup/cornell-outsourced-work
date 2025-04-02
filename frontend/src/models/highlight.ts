import { LucideIcon } from "lucide-react";

export interface Highlight {
  id: string;
  icon: LucideIcon | string;
  title: string;
  description: string;
}

export default class HighlightModel implements Highlight {
  id: string;
  icon: LucideIcon | string;
  title: string;
  description: string;

  constructor(data: Partial<Highlight> = {}) {
    this.id = data.id || crypto.randomUUID();
    this.icon = data.icon || "";
    this.title = data.title || "";
    this.description = data.description || "";
  }

  static fromJSON(json: any): HighlightModel {
    return new HighlightModel({
      id: json.id,
      icon: json.icon,
      title: json.title,
      description: json.description,
    });
  }

  toJSON(): Highlight {
    return {
      id: this.id,
      icon: this.icon,
      title: this.title,
      description: this.description,
    };
  }
}
