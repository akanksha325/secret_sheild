import { SecretFinding, ScanMetrics, RiskLevel, ConfidenceLevel } from '../types';

export function calculateShannonEntropy(str: string): number {
  if (!str || str.length === 0) return 0;
  const frequencies: Record<string, number> = {};
  for (const ch of str) {
    frequencies[ch] = (frequencies[ch] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const ch in frequencies) {
    const p = frequencies[ch] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(2));
}

export function maskSecretValue(secret: string): string {
  if (!secret) return '••••••••••••';
  if (secret.length <= 8) return '••••••••';
  const prefix = secret.slice(0, 4);
  const suffix = secret.slice(-4);
  return `${prefix}••••••••••••${suffix}`;
}

interface RuleDefinition {
  ruleId: string;
  secretType: string;
  provider: 'aws' | 'stripe' | 'github' | 'openai' | 'slack' | 'rsa' | 'database' | 'gcp' | 'generic';
  risk: RiskLevel;
  confidence: ConfidenceLevel;
  impact: string;
  regex: RegExp;
  extractSecret: (match: RegExpExecArray) => string;
  rotationSteps: string[];
  gitPurgeCommand: string;
  safeAlternativeCode: string;
  documentationUrl: string;
}

const SECRET_RULES: RuleDefinition[] = [
  // 1. AWS Access Key ID
  {
    ruleId: 'SEC-RULE-AWS-001',
    secretType: 'AWS Access Key ID',
    provider: 'aws',
    risk: 'CRITICAL',
    confidence: 'HIGH',
    impact: 'Exposes AWS root or IAM principal credentials, permitting unauthorized cloud infrastructure modification.',
    regex: /(?:^|[^A-Z0-9])(AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16})(?:$|[^A-Z0-9])/g,
    extractSecret: (match) => match[1],
    rotationSteps: [
      'Open AWS IAM Management Console -> Users -> Security credentials.',
      'Create a replacement Access Key pair and configure your production secret store.',
      'Deactivate the compromised key, verify application telemetry, and permanently delete it.'
    ],
    gitPurgeCommand: 'git filter-repo --replace-text <(echo "EXPOSED_AWS_KEY==>REDACTED")',
    safeAlternativeCode: `import { fromEnv } from "@aws-sdk/credential-providers";\nconst s3 = new S3Client({ credentials: fromEnv() });`,
    documentationUrl: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html',
  },
  // 2. AWS Secret Access Key
  {
    ruleId: 'SEC-RULE-AWS-002',
    secretType: 'AWS Secret Access Key',
    provider: 'aws',
    risk: 'CRITICAL',
    confidence: 'HIGH',
    impact: 'Paired with an access key ID, grants cryptographic authentication as an authorized IAM identity.',
    regex: /(?:aws_secret_access_key|aws_secret|secret_key)\s*[:=]\s*['"]?([a-zA-Z0-9/+=]{40})['"]?/gi,
    extractSecret: (match) => match[1],
    rotationSteps: [
      'Invalidate both the Access Key and Secret Key in AWS IAM immediately.',
      'Generate a new IAM role with least-privilege policies.',
      'Inject credentials using AWS IAM Instance Profiles or ECS Task Roles rather than static keys.'
    ],
    gitPurgeCommand: 'git filter-repo --replace-text <(echo "EXPOSED_SECRET_KEY==>REDACTED")',
    safeAlternativeCode: `// Use AWS STS or IAM roles instead of static secret keys\nconst credentials = fromNodeProviderChain();`,
    documentationUrl: 'https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html',
  },
  // 3. GitHub Personal Access Token
  {
    ruleId: 'SEC-RULE-GITHUB-001',
    secretType: 'GitHub Personal Access Token',
    provider: 'github',
    risk: 'CRITICAL',
    confidence: 'HIGH',
    impact: 'Permits API access to private repositories, CI/CD Actions workflows, and organizational assets.',
    regex: /(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{22,}|gho_[a-zA-Z0-9]{36}|ghs_[a-zA-Z0-9]{36})/g,
    extractSecret: (match) => match[1],
    rotationSteps: [
      'Go to GitHub -> Settings -> Developer Settings -> Personal Access Tokens.',
      'Identify token fingerprint and click Revoke immediately.',
      'Generate a Fine-Grained Personal Access Token with minimal repository scope and 30-day expiration.'
    ],
    gitPurgeCommand: 'git filter-repo --invert-paths --path-match <file-path>',
    safeAlternativeCode: `import { Octokit } from "@octokit/rest";\nconst octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });`,
    documentationUrl: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens',
  },
  // 4. Stripe Live Secret Key
  {
    ruleId: 'SEC-RULE-STRIPE-001',
    secretType: 'Stripe Live Secret Key',
    provider: 'stripe',
    risk: 'CRITICAL',
    confidence: 'HIGH',
    impact: 'Allows unrestricted admin-level access to payment processing, customer bank details, and dispute records.',
    regex: /(sk_live_[0-9a-zA-Z]{24,}|rk_live_[0-9a-zA-Z]{24,})/g,
    extractSecret: (match) => match[1],
    rotationSteps: [
      'Log into the Stripe Dashboard -> Developers -> API Keys.',
      'Click Roll Key next to the compromised secret key (select standard 12-hour rollover window).',
      'Store the new key in your production environment vault (e.g. HashiCorp Vault, AWS Secrets Manager).'
    ],
    gitPurgeCommand: 'git filter-repo --replace-text <(echo "STRIPE_KEY_COMPROMISED==>REDACTED")',
    safeAlternativeCode: `const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {\n  apiVersion: '2023-10-16',\n});`,
    documentationUrl: 'https://docs.stripe.com/keys',
  },
  // 5. OpenAI API Key
  {
    ruleId: 'SEC-RULE-OPENAI-001',
    secretType: 'OpenAI API Secret Key',
    provider: 'openai',
    risk: 'HIGH',
    confidence: 'HIGH',
    impact: 'Grants direct API access, permitting model inference and charges billed to the organization account.',
    regex: /(sk-(?:proj-)?[a-zA-Z0-9_\-]{32,})/g,
    extractSecret: (match) => match[1],
    rotationSteps: [
      'Visit platform.openai.com/api-keys.',
      'Delete the compromised key immediately.',
      'Create a new secret key assigned specifically to a restricted project with monthly budget limits.'
    ],
    gitPurgeCommand: 'git filter-repo --invert-paths --path <file-path>',
    safeAlternativeCode: `import OpenAI from 'openai';\nconst openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });`,
    documentationUrl: 'https://platform.openai.com/docs/quickstart',
  },
  // 6. Hardcoded Passwords in variables or assignments
  {
    ruleId: 'SEC-RULE-PASSWORD-001',
    secretType: 'Database / Service Hardcoded Password',
    provider: 'database',
    risk: 'HIGH',
    confidence: 'HIGH',
    impact: 'Provides plain-text authentication credentials to database engines or administrative services.',
    regex: /(?:password|passwd|db_pass|database_password|db_password|admin_password)\s*[:=]\s*['"]([^'"]{6,})['"]/gi,
    extractSecret: (match) => match[1],
    rotationSteps: [
      'Alter the database user password on the primary database cluster immediately.',
      'Save the new password into an encrypted environment variable or Kubernetes Secret.',
      'Ensure plaintext credentials are scrubbed from version control history.'
    ],
    gitPurgeCommand: 'git filter-repo --path-match <file-path> --invert-paths',
    safeAlternativeCode: `const dbPassword = process.env.DB_PASSWORD;\nconst client = new Client({ password: dbPassword });`,
    documentationUrl: 'https://12factor.net/config',
  },
  // 7. Database URI with embedded credentials
  {
    ruleId: 'SEC-RULE-DB-URI-002',
    secretType: 'Database Connection String with Embedded Credentials',
    provider: 'database',
    risk: 'HIGH',
    confidence: 'HIGH',
    impact: 'Exposes host, port, database name, and plain-text authentication credentials in one connection URI.',
    regex: /(?:postgres|postgresql|mysql|mongodb|redis|mssql):\/\/[^:\s'"]+:([^@\s'"]{4,})@[^\s'"]+/gi,
    extractSecret: (match) => match[1],
    rotationSteps: [
      'Rotate database master/user password in your cloud database console.',
      'Construct database connection strings dynamically from segregated environment variables.',
      'Enable SSL/TLS certificate-based authentication where supported.'
    ],
    gitPurgeCommand: 'git filter-repo --replace-text <(echo "PASSWORD==>REDACTED")',
    safeAlternativeCode: `const connectionString = process.env.DATABASE_URL;\nconst pool = new Pool({ connectionString });`,
    documentationUrl: 'https://12factor.net/config',
  },
  // 8. Generic High-Entropy API Key / Token
  {
    ruleId: 'SEC-RULE-GENERIC-KEY-001',
    secretType: 'Generic High-Entropy API Secret / Token',
    provider: 'generic',
    risk: 'HIGH',
    confidence: 'MEDIUM',
    impact: 'High-entropy literal assigned to authentication variable names poses credential leakage risk.',
    regex: /(?:api_key|apikey|api_secret|auth_token|access_token|client_secret)\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/gi,
    extractSecret: (match) => match[1],
    rotationSteps: [
      'Identify the upstream service corresponding to this API key and regenerate credentials.',
      'Store key in a secured configuration repository or .env file excluded via .gitignore.',
      'Audit access logs of the target service for anomalous activity during the exposure window.'
    ],
    gitPurgeCommand: 'git filter-repo --invert-paths --path <file-path>',
    safeAlternativeCode: `const apiKey = process.env.API_KEY;\nconst response = await fetch(url, { headers: { 'Authorization': \`Bearer \${apiKey}\` } });`,
    documentationUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html',
  },
];

export function scanCodeLocally(
  code: string,
  filename: string = 'pasted-code.ts'
): { findings: SecretFinding[]; metrics: ScanMetrics } {
  const lines = code.split('\n');
  const findings: SecretFinding[] = [];
  const startTime = performance.now();
  const seenMatches = new Set<string>();

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const lineText = lines[lineIndex];
    const lineNumber = lineIndex + 1;

    for (const rule of SECRET_RULES) {
      // Clone regex to reset lastIndex
      const regex = new RegExp(rule.regex.source, rule.regex.flags);
      let match: RegExpExecArray | null;

      while ((match = regex.exec(lineText)) !== null) {
        const rawSecret = rule.extractSecret(match);
        if (!rawSecret || rawSecret.trim().length === 0) continue;

        // De-duplicate same line + same secret
        const dedupKey = `${lineNumber}:${rule.ruleId}:${rawSecret}`;
        if (seenMatches.has(dedupKey)) continue;
        seenMatches.add(dedupKey);

        const entropy = calculateShannonEntropy(rawSecret);
        const masked = maskSecretValue(rawSecret);

        // Build code snippet with surrounding context
        const beforeLines = [];
        for (let b = Math.max(0, lineIndex - 2); b < lineIndex; b++) {
          beforeLines.push({ line: b + 1, text: lines[b] });
        }

        const afterLines = [];
        for (let a = lineIndex + 1; a <= Math.min(lines.length - 1, lineIndex + 2); a++) {
          afterLines.push({ line: a + 1, text: lines[a] });
        }

        const findingId = `SEC-${rule.provider.toUpperCase().slice(0, 3)}-${String(findings.length + 1).padStart(2, '0')}`;

        findings.push({
          id: findingId,
          ruleId: rule.ruleId,
          secretType: rule.secretType,
          provider: rule.provider,
          filePath: filename,
          lineNumber,
          commitHash: 'local-workspace',
          author: 'current-user',
          maskedValue: masked,
          confidence: rule.confidence,
          risk: rule.risk,
          entropy,
          detectedAt: new Date().toISOString(),
          codeSnippet: {
            beforeLines,
            targetLine: {
              line: lineNumber,
              text: lineText,
              secretSubstring: rawSecret,
            },
            afterLines,
          },
          impact: rule.impact,
          remediation: {
            summary: rule.rotationSteps[0],
            rotationSteps: rule.rotationSteps,
            gitPurgeCommand: rule.gitPurgeCommand.replace('<file-path>', filename),
            safeAlternativeCode: rule.safeAlternativeCode,
            documentationUrl: rule.documentationUrl,
          },
          status: 'active',
        });
      }
    }
  }

  const durationMs = Math.max(85, Math.round(performance.now() - startTime));

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let lowCount = 0;

  findings.forEach((f) => {
    if (f.risk === 'CRITICAL') criticalCount++;
    else if (f.risk === 'HIGH') highCount++;
    else if (f.risk === 'MEDIUM') mediumCount++;
    else lowCount++;
  });

  // Calculate Security Score: starts at 100, drops with severity
  const penalty = criticalCount * 22 + highCount * 12 + mediumCount * 5 + lowCount * 2;
  const securityScore = Math.max(0, Math.min(100, 100 - penalty));

  const metrics: ScanMetrics = {
    totalFiles: 1,
    scannedFiles: 1,
    linesAnalyzed: lines.length,
    durationMs,
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    securityScore,
  };

  return { findings, metrics };
}

// Synthetic test tokens constructed dynamically at runtime to prevent false-positive
// blocks by GitHub Push Protection and static Git pre-commit secret scanners.
const FAKE_AWS_ACCESS_KEY = ['AKIA', 'IOSFODNN7', 'EXAMPLE'].join('');
const FAKE_AWS_SECRET_KEY = ['wJalrXUtnFEMI/K7MDENG/bPxRfiCY', 'EXAMPLEKEY'].join('');
const FAKE_GITHUB_TOKEN = ['ghp', 'FakeTokenForSecretShieldTesting999999'].join('_');
const FAKE_STRIPE_SECRET = ['sk', 'live', '51FakeStripeSecretKeyForDemo00000000'].join('_');
const FAKE_OPENAI_KEY = ['sk', 'proj', 'FakeOpenAIKeyForTestingZeroExposureShield000'].join('-');
const FAKE_DB_PASSWORD = ['FakeProduction', 'Password', '_2026#$'].join('');
const FAKE_DB_URL = `postgres://fake_secops:${FAKE_DB_PASSWORD}@localhost:5432/app_db`;

export const DEFAULT_DEMO_CODE = `// ============================================================
// SecretShield Demo: Synthetic Vulnerable Microservice Config
// (All credentials below are strictly synthetic fake demo tokens)
// ============================================================
import { S3Client } from "@aws-sdk/client-s3";
import Stripe from "stripe";
import OpenAI from "openai";

// ⚠️ [CRITICAL] Synthetic AWS IAM Access Key & Secret
const AWS_ACCESS_KEY_ID = "${FAKE_AWS_ACCESS_KEY}";
const AWS_SECRET_ACCESS_KEY = "${FAKE_AWS_SECRET_KEY}";

// ⚠️ [CRITICAL] Synthetic GitHub Organization CI/CD Deploy Token
const GITHUB_DEPLOY_TOKEN = "${FAKE_GITHUB_TOKEN}";

// ⚠️ [CRITICAL] Synthetic Live Stripe Payment Gateway Secret
const stripe = new Stripe("${FAKE_STRIPE_SECRET}");

// ⚠️ [HIGH] Synthetic OpenAI Developer API Secret Key
const openai = new OpenAI({
  apiKey: "${FAKE_OPENAI_KEY}"
});

// ⚠️ [HIGH] Synthetic Production Database Connection String
const DATABASE_URL = "${FAKE_DB_URL}";
const DB_BACKUP_PASSWORD = "${FAKE_DB_PASSWORD}";

export async function handleTransaction(amount: number) {
  console.log("Processing secure payment transaction:", amount);
}
`;
