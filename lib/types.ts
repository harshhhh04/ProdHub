export type SystemMode = 'placement' | 'builder';

export type Priority = 'P0' | 'P1' | 'P2' | 'P3';

export type MissionStatus = 'backlog' | 'in_progress' | 'completed';

export interface MissionSubtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  status: MissionStatus;
  deadline: string; // ISO date string
  estimatedHours: number;
  actualHours: number;
  definitionOfDone: MissionSubtask[];
  notes?: string;
  projectId?: string;
  createdAt: string;
}

export interface DailyBigThree {
  id: string;
  date: string; // YYYY-MM-DD
  task1: string;
  task2: string;
  task3: string;
  completed1: boolean;
  completed2: boolean;
  completed3: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  targetDate?: string;
}

export interface ProjectResource {
  id: string;
  title: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  overview: string;
  status: 'active' | 'paused' | 'completed';
  goals: string[];
  milestones: ProjectMilestone[];
  resources: ProjectResource[];
  notes: string;
  progress: number;
  category: 'core' | 'internship' | 'freelance' | 'portfolio';
}

export interface KnowledgeNote {
  id: string;
  title: string;
  category: string;
  content: string; // Markdown
  tags: string[];
  backlinks: string[];
  updatedAt: string;
}

export interface DeepWorkSession {
  id: string;
  missionId?: string;
  missionTitle?: string;
  durationMinutes: number;
  accomplishments: string;
  interruptions: number;
  timestamp: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  progressPercent: number;
  totalPages: number;
  readPages: number;
  status: 'reading' | 'completed' | 'queued';
  keyIdeas: string[];
  quotes: string[];
  actionableLessons: string[];
  relatedProjectId?: string;
}

export interface HealthLog {
  id: string;
  date: string; // YYYY-MM-DD
  workoutDone: boolean;
  workoutNotes: string;
  meditationMinutes: number;
  sleepHours: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  waterLiters: number;
  walkingSteps: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  category: 'Embedded C' | 'RTOS' | 'BLE' | 'Protocols' | 'Firmware Debugging' | 'Battery & Power' | 'Company Specific';
  company?: string;
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  lastReviewed?: string;
}

export interface PlacementApplication {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected';
  deadline?: string;
  oaDate?: string;
  interviewDate?: string;
  notes: string;
  salaryLocation?: string;
  link?: string;
}

export interface WeeklyReview {
  id: string;
  weekStartDate: string;
  deepWorkHours: number;
  missionsCompletedPct: number;
  wins: string;
  bottlenecks: string;
  learnings: string;
  changesNextWeek: string;
  createdAt: string;
}
