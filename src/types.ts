export interface DeviceSession {
  id: string;
  deviceName: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrent?: boolean;
}

export interface DrawingItem {
  id: string;
  title: string;
  date?: string;
  createdAt?: string;
  dataUrl: string;
}

export interface StudentProgress {
  userId?: string;
  hindiProgress: number;
  englishProgress: number;
  mathProgress: number;
  drawingCount: number;
  quizzesCompleted: number;
  quizAccuracy: number;
  studyTimeMinutes: number;
  streakDays: number;
  badges: string[];
  savedDrawings: DrawingItem[];
  classGrade: string;
  // Progress tracking convenience properties
  hindiLettersLearned: string[];
  englishLettersLearned: string[];
  mathCompleted: boolean;
  drawingsCount: number;
  badgesUnlocked: string[];
  quizTotalQuestions: number;
  quizCorrectAnswers: number;
  lastActive: string;
}

export interface UserProfile {
  id?: string;
  uniqueId: string; // e.g. IOIS10RK01
  name: string;
  email: string;
  mobile: string;
  planId: string;
  planName: string;
  planPrice: number;
  classGrade?: string;
  referralCode?: string;
  sponsorId?: string;
  city?: string;
  designation?: string;
  utrNumber?: string;
  payoutUpi?: string;
  paymentStatus?: "pending" | "approved" | "verified";
  photoUrl?: string;
  referralEarnings: number;
  twoFactorEnabled: boolean;
  registeredAt?: string;
  devices: DeviceSession[];
  progress?: StudentProgress;
}

export interface VarnamalaItem {
  letter: string;
  devanagari: string;
  type: "swar" | "vyanjan";
  transliteration: string;
  example1: {
    word: string;
    english: string;
    emoji: string;
  };
  example2?: {
    word: string;
    english: string;
    emoji: string;
  };
}

export interface EnglishAlphabetItem {
  letter: string;
  lowercase: string;
  upper?: string;
  lower?: string;
  example1: {
    word: string;
    emoji: string;
    hindi?: string;
  };
  example2: {
    word: string;
    emoji: string;
    hindi?: string;
  };
  phonics: string;
}

export interface FlashcardItem {
  id: string;
  englishName: string;
  hindiName: string;
  category:
    | "vegetables"
    | "fruits"
    | "birds"
    | "flowers"
    | "domestic_animals"
    | "wild_animals"
    | "water_animals"
    | "vehicles"
    | "body_parts"
    | "colours"
    | "shapes"
    | "opposites"
    | "actions"
    | "games";
  emoji: string;
  fact?: string;
  colorCode?: string;
}

export interface QuizQuestion {
  id: string;
  subject: "hindi" | "english" | "math" | "gk";
  classGrade: string;
  questionHi: string;
  questionEn: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DigitalBadge {
  id: string;
  nameHi: string;
  nameEn: string;
  icon: string;
  description: string;
  color: string;
}

export type BadgeItem = DigitalBadge;

export interface IOISPlan {
  id: string;
  name: string;
  price: number;
  badge: string;
  features: string[];
  referralRate: string;
  referralAmount: string;
  commissionPercent: number;
  directPayout: number;
  color: string;
}

export interface PlatformService {
  id: string;
  titleHi: string;
  titleEn: string;
  category: "gov" | "education" | "utilities" | "entertainment" | "income";
  description: string;
  icon: string;
  link: string;
  badge?: string;
  active: boolean;
}

export interface AdminOverview {
  success?: boolean;
  stats?: {
    totalStudents: number;
    totalEarnings: number;
    totalQuizzes: number;
    totalDrawings: number;
    planStats: Record<string, number>;
  };
  totalUsers?: number;
  activeSessionsCount?: number;
  totalRevenue?: number;
  settings?: {
    officialUpiId: string;
    officialPayeeName: string;
    officialWhatsapp: string;
    sponsorDefaultId: string;
    systemNotice?: string;
  };
  services?: PlatformService[];
  users: Array<{
    id?: string;
    uniqueId: string;
    name: string;
    email: string;
    mobile: string;
    planId?: string;
    planName: string;
    planPrice: number;
    classGrade?: string;
    referralCode?: string;
    sponsorId?: string;
    city?: string;
    designation?: string;
    utrNumber?: string;
    payoutUpi?: string;
    paymentStatus?: "pending" | "approved" | "verified";
    referralEarnings?: number;
    twoFactorEnabled: boolean;
    registeredAt?: string;
    createdAt?: string;
    deviceCount?: number;
    devices?: DeviceSession[];
    progress?: StudentProgress;
  }>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
