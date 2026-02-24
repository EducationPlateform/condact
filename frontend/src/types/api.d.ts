export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  profileImage?: string;
  createdAt: string;
}

export interface Group {
  id: string;
  teacherId: User;
  name: string;
  description?: string;
  students: User[];
  studentIds?: string[];
  schedule: string[];
  createdAt: string;
}

export interface Lecture {
  id: string;
  groupId: string | Group;
  title: string;
  description?: string;
  videoId?: string | Video;
  pdfFiles: string[];
  scheduledDate?: string;
  isPublished: boolean;
  order: number;
  grade: string;
  createdAt: string;
}

export interface Video {
  id: string;
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
  image?: string;
  points: number;
}

export interface Homework {
  id: string;
  lectureId: string;
  title: string;
  description?: string;
  questions: Question[];
  maxScore: number;
  dueDate?: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  lectureId: string;
  title: string;
  description?: string;
  questions: Question[];
  maxScore: number;
  timeLimit: number;
  isActive: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
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
  id: string;
  studentId: string | User;
  lectureId: string | Lecture;
  lectureTitle?: string;
  homeworkScore?: number;
  examScore?: number;
  totalScore: number;
  updatedAt: string;
}

export interface StudentAccess {
  id: string;
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

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  isActive?: boolean;
  createdAt: string;
  expiresAt?: string;
  createdBy?: string;
}
