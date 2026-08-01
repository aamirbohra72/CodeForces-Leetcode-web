export type ProjectTrackId = 'featured' | 'colosseum' | 'genai' | 'agentic';

export type ProjectDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProjectResource {
  title: string;
  url: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  difficulty: ProjectDifficulty;
  shortDesc: string;
  track: ProjectTrackId;
  hackathon: string;
  domains: string[];
  technologies: string[];
  prizeAngle: string;
  mvpFeatures: string[];
  stretchGoals: string[];
  whyUnique: string[];
  resources?: ProjectResource[];
}

export interface ProjectTrackMeta {
  id: ProjectTrackId;
  title: string;
  blurb: string;
  accent: string;
}

export interface ProjectsHub {
  generatedAt: string;
  source: 'mistral';
  headline: string;
  summary: string;
  tracks: ProjectTrackMeta[];
  projects: ProjectIdea[];
}
