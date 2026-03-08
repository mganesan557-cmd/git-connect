import { Topic } from "./pythonLessons";

export type CourseTrack = {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  topics: Topic[];
};

// Re-export types
export type { Topic, Lesson, Question } from "./pythonLessons";
