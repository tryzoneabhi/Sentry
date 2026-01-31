
export interface Teacher {
  id: string;
  name: string;
  channelId: string;
  subject: string;
  color: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  duration?: string;
}

export interface AISummary {
  summary: string;
  keyPoints: string[];
  formulas: string[];
  practiceQuestions: {
    question: string;
    options: string[];
    answer: string;
  }[];
}

export interface Bookmark {
  videoId: string;
  title: string;
  thumbnail: string;
}

export interface RevisionCard {
  id: string;
  title: string;
  content: string;
  category: 'Math' | 'Science' | 'Social' | 'English' | 'General';
}
