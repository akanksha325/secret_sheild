export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

export interface SecretFinding {
  id: string;
  ruleId: string;
  secretType: string;
  provider: 'aws' | 'stripe' | 'github' | 'openai' | 'slack' | 'rsa' | 'database' | 'gcp' | 'generic';
  filePath: string;
  lineNumber: number;
  commitHash?: string;
  author?: string;
  maskedValue: string; // Real secret is never stored or shown
  confidence: ConfidenceLevel;
  risk: RiskLevel;
  entropy: number;
  detectedAt: string;
  codeSnippet: {
    beforeLines: { line: number; text: string }[];
    targetLine: { line: number; text: string; secretSubstring: string };
    afterLines: { line: number; text: string }[];
  };
  impact: string;
  remediation: {
    summary: string;
    rotationSteps: string[];
    gitPurgeCommand: string;
    safeAlternativeCode: string;
    documentationUrl: string;
  };
  status: 'active' | 'resolved' | 'false_positive' | 'in_review';
}

export interface ScanMetrics {
  totalFiles: number;
  scannedFiles: number;
  linesAnalyzed: number;
  durationMs: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  securityScore: number; // 0 - 100
}

export interface SampleProject {
  id: string;
  name: string;
  description: string;
  icon: string;
  filesCount: number;
  findings: SecretFinding[];
  metrics: ScanMetrics;
}

export interface ScanOptions {
  deepEntropy: boolean;
  scanGitHistory: boolean;
  checkIgnoredFiles: boolean;
}
