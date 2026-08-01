export type BlogLiveCategory =
  | 'algorithms'
  | 'system-design'
  | 'genai'
  | 'blockchain'
  | 'careers'
  | 'contest';

export type BlogLivePost = {
  id: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  readMinutes: number;
  tags: string[];
  category: BlogLiveCategory;
  featured?: boolean;
  body: string[];
  source: 'mistral';
};

export type BlogHub = {
  generatedAt: string;
  source: 'mistral';
  headline: string;
  summary: string;
  posts: BlogLivePost[];
};
