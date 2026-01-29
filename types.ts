export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface CareerOption {
  roleName: string;
  fitReason: string;
  requiredSkills: string[];
  timeToEntry: string;
  incomePotential: 'Low' | 'Medium' | 'High';
  riskLevel: string;
  aiImpact: 'Safe' | 'Enhanced' | 'At Risk';
}

export interface LifePath {
  name: string;
  description: string;
  lifestyle: string;
  incomeRange: string;
  stressLevel: string;
  longTermSatisfaction: string;
}

export interface DashboardData {
  coreProfile: {
    archetype: string;
    decisionStyle: string;
    strengthDrivers: string[];
    weaknessPatterns: string[];
    hiddenPotential: string;
    psychologicalPraise: string; // New: Intelligent validation/praise
  };
  careerPaths: {
    syncPath: CareerOption[]; // Optimized version of current path
    pivotPath: CareerOption[]; // Radical/True calling path
  };
  educationStrategy: { // Renamed from higherStudies
    recommended: boolean;
    globalOptions: string[]; // Focus on foreign/global
    avantGardeAlternatives: string[]; // Non-traditional/Modern
    duration: string;
    roiRealityCheck: string;
  };
  knowledgeAwareness: { // New: High-level knowledge gaps
    topic: string;
    insight: string;
  }[];
  aiIntegration: {
    multiplierStrategy: string;
    toolsToUse: string[];
    skillsToLearn: string[];
    careerImpact: string;
    workflowExample: string;
  };
  improvements: {
    skillGaps: string[];
    mindsetFlaws: string[];
    habitsToBreak: string[];
    consequenceOfInaction: string;
    sixMonthFocus: string;
  };
  lifePaths: {
    safe: LifePath;
    growth: LifePath;
    purpose: LifePath;
  };
  actionPlan: {
    first30Days: string[];
    next90Days: string[];
    sixMonths: string[];
    twelveMonths: string[];
  };
  finalVerdict: {
    trajectory: string;
    hardTruth: string;
    coreAdvantage: string;
    nonNegotiableAction: string;
  };
}