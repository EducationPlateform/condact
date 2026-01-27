export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  profileImage?: string;
  createdAt: string;
}

export interface Group {
  _id: string;
  teacherId: User;
  name: string;
  description?: string;
  students: User[];
  schedule: string[];
  createdAt: string;
}

export interface Lecture {
  _id: string;
  groupId: string | Group;
  title: string;
  description?: string;
  videoId?: string | Video;
  pdfFiles: string[];
  scheduledDate?: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
}

export interface Video {
  _id: string;
  lectureId: string;
  fileUrl: string;
  fileName: string;
  duration?: number;
  uploadDate: string;
  streamingUrl?: string;
  securityConfig?: {
    drmEnabled: boolean;
    watermarkEnabled: boolean;
  };
}

export interface Question {
  question: string;
  type: 'multiple-choice' | 'text' | 'true-false';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
}

export interface Homework {
  _id: string;
  lectureId: string;
  title: string;
  description?: string;
  questions: Question[];
  maxScore: number;
  dueDate?: string;
  createdAt: string;
}

export interface Exam {
  _id: string;
  lectureId: string;
  title: string;
  description?: string;
  questions: Question[];
  maxScore: number;
  timeLimit: number;
  isActive: boolean;
  createdAt: string;
}

export interface Submission {
  _id: string;
  studentId: string | User;
  homeworkId?: string | Homework;
  examId?: string | Exam;
  type: 'homework' | 'exam';
  answers: Record<string, any>;
  score?: number;
  submittedAt: string;
  attempts: number;
}

export interface Score {
  _id: string;
  studentId: string | User;
  lectureId: string | Lecture;
  homeworkScore?: number;
  examScore?: number;
  totalScore: number;
  updatedAt: string;
}

export interface StudentAccess {
  _id: string;
  studentId: string;
  lectureId: string;
  maxViews: number;
  currentViews: number;
  remainingViews: number;
  lastViewedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
