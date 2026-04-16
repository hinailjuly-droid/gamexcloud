export interface Game {
  _id: string;
  githubId: number;
  name: string;
  slug: string;
  title: string;
  description: string;
  customDescription?: string;
  category: string;
  tags: string[];
  license: string;
  githubUrl: string;
  playUrl: string;
  hasLiveUrl: boolean;
  standalone: boolean;
  stars: number;
  forks: number;
  language: string;
  thumbnail: string;
  featured: boolean;
  verified: boolean;
  active: boolean;
  views: number;
  plays: number;
  lastUpdated: string;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev?: boolean;
}

export interface GamesResponse {
  games: Game[];
  pagination: Pagination;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

export interface AdminStats {
  totalGames: number;
  activeGames: number;
  featuredGames: number;
  verifiedGames: number;
  monthlyPlays: number;
  monthlyViews: number;
}

export interface DashboardData {
  stats: AdminStats;
  topGames: Partial<Game>[];
  recentGames: Partial<Game>[];
  categoryBreakdown: { _id: string; count: number }[];
}
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  readTime: string;
  publishedAt: string;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  posts: BlogPost[];
  pagination: Pagination;
}
