
export interface User {
  username: string;
  trustedContacts: TrustedContact[];
  scores: SafetyScores;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

export interface SafetyScores {
  emotionalAwareness: number;
  scamResistance: number;
  decisionStability: number;
}

export interface AnalysisResult {
  sentence: string;
  pressureLevel: 'Low' | 'Medium' | 'High';
  urgencyScore: number;
  manipulationPattern: string;
  riskExplanation: string;
  protectiveAction: string;
  scamType: string;
}

export interface WeeklyData {
  day: string;
  score: number;
}
