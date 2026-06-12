export interface ContentPageData {
  slug: string;
  title: string;
  content: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  author: string;
  date: string;
  mediaSrc: string;
  content: string[];
}

export interface ProgramModule {
  title: string;
  description: string;
}

export interface EducationItem {
  id: string;
  slug: string;
  type: "image" | "video";
  mediaSrc: string;
  poster?: string;
  title: string;
  startDate: string;
  format: string;
  price: string;
  level: string;
  goal: string;
  description: string;
  levelLabel: string;
  goalLabel: string;
  formatLabel: string;
  program: ProgramModule[];
}