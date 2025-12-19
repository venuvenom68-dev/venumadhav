
export interface Movie {
  title: string;
  year: string;
  genre: string[];
  rating: number;
  description: string;
  posterUrl: string;
  reasoning: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface RecommendationResponse {
  movies: Movie[];
  intro: string;
  groundingChunks?: GroundingChunk[];
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
