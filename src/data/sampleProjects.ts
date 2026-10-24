import { SampleProject } from '../types';

export const SAMPLE_PROJECTS: SampleProject[] = [
  {
    id: 'fintech-gateway',
    name: 'Fintech Payment Gateway',
    description: 'Node.js & TypeScript microservice handling card authorizations and billing webhooks.',
    icon: 'credit-card',
    filesCount: 1420,
    metrics: {
      totalFiles: 1420,
      scannedFiles: 1420,
      linesAnalyzed: 84320,
      durationMs: 1380,
      criticalCount: 3,
      highCount: 2,
      mediumCount: 1,
      lowCount: 1,
      securityScore: 38,
    },
    findings: [
      {
        id: 'SEC-8901',
        ruleId: 'SEC-RULE-STRIPE-001',
        secretType: 'Stripe Live Secret Key',
        provider: 'stripe',
        filePath: 'services/billing/stripeClient.ts',
        lineNumber: 14,
        commitHash: '7f9a20b',
        author: 'dev.marcus@fintechcorp.internal',
        maskedValue: 'sk_live_••••••••••••••••••••••••9eK7',
        confidence: 'HIGH',
        risk: 'CRITICAL',
        entropy: 5.86,
        detectedAt: '2026-10-24T10:14:22Z',
        codeSnippet: {
          beforeLines: [
            { line: 12, text: "import Stripe from 'stripe';" },
            { line: 13, text: '// Initialize billing client with production credentials' },
          ],
          targetLine: {
            line: 14,
            text: "const stripe = new Stripe('sk_live_••••••••••••••••••••••••9eK7', {",
            secretSubstring: "'sk_live_••••••••••••••••••••••••9eK7'",
          },
          afterLines: [
            { line: 15, text: "  apiVersion: '2024-06-20'," },
            { line: 16, text: '  typescript: true,' },
            { line: 17, text: '});' },
          ],
        },
        impact: 'Full administrative access to customer payment methods, refund processing, bank payouts, and PCI transaction logs.',
        remediation: {
          summary: 'Immediately roll over the live Stripe API key in the Stripe Dashboard and load credentials strictly via process.env.',
          rotationSteps: [
            'Log into your Stripe Dashboard at https://dashboard.stripe.com/apikeys.',
            'Under "Standard keys", click the three dots next to the exposed key and select "Roll key".',
            'Select expiration window (e.g. 12-24 hours) to avoid immediate downtime while redeploying.',
            'Deploy the rotated secret to your runtime vault or environment variables.',
          ],
          gitPurgeCommand: 'git filter-repo --invert-paths --path services/billing/stripeClient.ts --force',
          safeAlternativeCode: `// services/billing/stripeClient.ts
import Stripe from 'stripe';

const apiKey = process.env.STRIPE_SECRET_KEY;
if (!apiKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not defined.');
}

export const stripe = new Stripe(apiKey, {
  apiVersion: '2024-06-20',
  typescript: true,
});`,
          documentationUrl: 'https://docs.stripe.com/keys#rolling-keys',
        },
        status: 'active',
      },
      {
        id: 'SEC-8902',
        ruleId: 'SEC-RULE-AWS-004',
        secretType: 'AWS IAM Secret Access Key',
        provider: 'aws',
        filePath: 'infra/terraform/production.tfvars',
        lineNumber: 28,
        commitHash: '3a18e0d',
        author: 'infra.lead@fintechcorp.internal',
        maskedValue: 'wJalrXUtnFEMI/••••••••••••••••••••4M2Q',
        confidence: 'HIGH',
        risk: 'CRITICAL',
        entropy: 5.92,
        detectedAt: '2026-10-24T10:14:22Z',
        codeSnippet: {
          beforeLines: [
            { line: 26, text: '# Production deployment service principal' },
            { line: 27, text: 'aws_access_key_id     = "AKIA••••••••••••••••B38P"' },
          ],
          targetLine: {
            line: 28,
            text: 'aws_secret_access_key = "wJalrXUtnFEMI/••••••••••••••••••••4M2Q"',
            secretSubstring: '"wJalrXUtnFEMI/••••••••••••••••••••4M2Q"',
          },
          afterLines: [
            { line: 29, text: 'aws_region            = "us-east-1"' },
            { line: 30, text: 'environment           = "production"' },
          ],
        },
        impact: 'Unrestricted API privileges over production AWS infrastructure including EC2 instances, S3 storage buckets, and RDS databases.',
        remediation: {
          summary: 'Deactivate the exposed AWS IAM credentials immediately using the AWS CLI or IAM Console and migrate to IAM Roles / OIDC.',
          rotationSteps: [
            'Deactivate key: aws iam update-access-key --access-key-id AKIA... --status Inactive',
            'Audit CloudTrail logs for unusual activity tied to this Access Key ID within the last 30 days.',
            'Delete the key permanently: aws iam delete-access-key --access-key-id AKIA...',
            'Migrate infrastructure pipelines to AWS IAM Roles with GitHub Actions OIDC federation.',
          ],
          gitPurgeCommand: 'git filter-repo --replace-text <(echo "wJalrXUtnFEMI/...==>REDACTED_AWS_KEY")',
          safeAlternativeCode: `# infra/terraform/main.tf
provider "aws" {
  region = var.aws_region
  # Omit hardcoded credentials! Use AWS IAM Role assumption or default profile:
  assume_role {
    role_arn     = "arn:aws:iam::123456789012:role/TerraformDeployRole"
    session_name = "TerraformDeploymentSession"
  }
}`,
          documentationUrl: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html',
        },
        status: 'active',
      },
      {
        id: 'SEC-8903',
        ruleId: 'SEC-RULE-RSA-001',
        secretType: 'PKCS#8 RSA Private Key',
        provider: 'rsa',
        filePath: 'packages/auth/certs/jwt-signing.key',
        lineNumber: 1,
        commitHash: 'e410bc9',
        author: 'sec.alex@fintechcorp.internal',
        maskedValue: '-----BEGIN RSA PRIVATE KEY-----\\nMIIEowIBAAKCAQEA••••••••••••••\\n-----END RSA PRIVATE KEY-----',
        confidence: 'HIGH',
        risk: 'CRITICAL',
        entropy: 5.74,
        detectedAt: '2026-10-24T10:14:22Z',
        codeSnippet: {
          beforeLines: [
            { line: 1, text: '-----BEGIN RSA PRIVATE KEY-----' },
          ],
          targetLine: {
            line: 2,
            text: 'MIIEowIBAAKCAQEA••••••••••••••••••••••••••••••••••••••••••••••',
            secretSubstring: 'MIIEowIBAAKCAQEA••••••••••••••••••••••••••••••••••••••••••••••',
          },
          afterLines: [
            { line: 3, text: '4xJvK8z9w0Q2L1mP••••••••••••••••••••••••••••••••••••••••••••••' },
            { line: 4, text: '-----END RSA PRIVATE KEY-----' },
          ],
        },
        impact: 'Permits bad actors to forge cryptographic JWT user sessions, bypass OAuth2 authentication, and impersonate system administrators.',
        remediation: {
          summary: 'Generate a new RSA keypair, register the new public key on JWKS endpoints, and revoke previous tokens.',
          rotationSteps: [
            'Generate a new 2048-bit or 4096-bit RSA key pair in your secrets vault or KMS (e.g. AWS KMS or Vault Transit).',
            'Publish the new Public Key to the JWKS endpoint (/.well-known/jwks.json) with a new kid (key ID).',
            'Invalidate active user sessions or gracefully phase out signatures with the old kid.',
          ],
          gitPurgeCommand: 'git filter-repo --path packages/auth/certs/jwt-signing.key --invert-paths',
          safeAlternativeCode: `// packages/auth/jwt.ts
import { KMSClient, SignCommand } from "@aws-sdk/client-kms";

// Delegate JWT signing to KMS without exposing the private key material to code
const kms = new KMSClient({ region: "us-east-1" });
export async function signTokenPayload(payload: object) {
  // Signs payload securely within HSM boundary
  return kms.send(new SignCommand({ KeyId: process.env.KMS_KEY_ARN, ... }));
}`,
          documentationUrl: 'https://datatracker.ietf.org/doc/html/rfc7519',
        },
        status: 'active',
      },
      {
        id: 'SEC-8904',
        ruleId: 'SEC-RULE-POSTGRES-002',
        secretType: 'PostgreSQL Connection URI with Password',
        provider: 'database',
        filePath: 'backend/.env.production',
        lineNumber: 8,
        commitHash: '8b72df1',
        author: 'backend.dev@fintechcorp.internal',
        maskedValue: 'postgresql://dbadmin:••••••••••••@db-prod.fintechcorp.internal:5432/finance_db',
        confidence: 'HIGH',
        risk: 'HIGH',
        entropy: 5.41,
        detectedAt: '2026-10-24T10:14:22Z',
        codeSnippet: {
          beforeLines: [
            { line: 6, text: '# Production Database Config' },
            { line: 7, text: 'PORT=8080' },
          ],
          targetLine: {
            line: 8,
            text: 'DATABASE_URL=postgresql://dbadmin:••••••••••••@db-prod.fintechcorp.internal:5432/finance_db',
            secretSubstring: 'postgresql://dbadmin:••••••••••••@db-prod.fintechcorp.internal:5432/finance_db',
          },
          afterLines: [
            { line: 9, text: 'REDIS_HOST=cache-cluster.internal' },
            { line: 10, text: 'NODE_ENV=production' },
          ],
        },
        impact: 'Direct access to raw SQL database containing customer ledger data, card tokens, and internal audit logs.',
        remediation: {
          summary: 'Rotate PostgreSQL master user password, remove .env from git tracking, and add .env to .gitignore.',
          rotationSteps: [
            'Execute SQL password rotation: ALTER ROLE dbadmin WITH PASSWORD \'new_secure_generated_pass\';',
            'Verify no other services rely on the unrotated credentials before terminating active connections.',
            'Add ".env*" to .gitignore to prevent accidental repository check-ins.',
          ],
          gitPurgeCommand: 'git filter-repo --path backend/.env.production --invert-paths',
          safeAlternativeCode: `# .gitignore
.env
.env.local
.env.*.local
*.pem
*.key

# Read from secure cloud manager (e.g., Doppler, AWS Secrets Manager):
DATABASE_URL=$(aws secretsmanager get-secret-value --secret-id prod/db --query SecretString --output text)`,
          documentationUrl: 'https://www.postgresql.org/docs/current/sql-alterrole.html',
        },
        status: 'active',
      },
      {
        id: 'SEC-8905',
        ruleId: 'SEC-RULE-SLACK-001',
        secretType: 'Slack Incoming Webhook URL',
        provider: 'slack',
        filePath: 'scripts/alerts/deployNotifier.js',
        lineNumber: 19,
        commitHash: '1c4509e',
        author: 'ci.bot@fintechcorp.internal',
        maskedValue: 'https://hooks.slack.com/services/T00•••••••/B00•••••••/••••••••••••••••••••••••',
        confidence: 'HIGH',
        risk: 'HIGH',
        entropy: 5.12,
        detectedAt: '2026-10-24T10:14:22Z',
        codeSnippet: {
          beforeLines: [
            { line: 17, text: 'async function notifySlack(status, branch) {' },
            { line: 18, text: '  const payload = { text: `Deploy ${status} for ${branch}` };' },
          ],
          targetLine: {
            line: 19,
            text: "  const webhookUrl = 'https://hooks.slack.com/services/T00•••••••/B00•••••••/••••••••••••••••••••••••';",
            secretSubstring: "'https://hooks.slack.com/services/T00•••••••/B00•••••••/••••••••••••••••••••••••'",
          },
          afterLines: [
            { line: 20, text: '  await fetch(webhookUrl, { method: "POST", body: JSON.stringify(payload) });' },
            { line: 21, text: '}' },
          ],
        },
        impact: 'Permits spamming internal security/deployment channels and crafting phishing lures with spoofed bot identity.',
        remediation: {
          summary: 'Revoke the webhook integration in Slack API settings and inject the new webhook URL as a CI/CD secret.',
          rotationSteps: [
            'Visit api.slack.com/apps > Incoming Webhooks.',
            'Remove the compromised webhook URL.',
            'Generate a new webhook URL and store in GitHub Actions Secrets or GitLab CI variables.',
          ],
          gitPurgeCommand: 'git filter-repo --path scripts/alerts/deployNotifier.js --replace-text <(echo "https://hooks.slack.com/...==>REDACTED")',
          safeAlternativeCode: `// scripts/alerts/deployNotifier.js
const webhookUrl = process.env.SLACK_ALERT_WEBHOOK_URL;
if (!webhookUrl) {
  console.warn('SLACK_ALERT_WEBHOOK_URL not configured. Skipping notification.');
  return;
}`,
          documentationUrl: 'https://api.slack.com/messaging/webhooks',
        },
        status: 'in_review',
      },
      {
        id: 'SEC-8906',
        ruleId: 'SEC-RULE-ENTROPY-009',
        secretType: 'High-Entropy Secret Token',
        provider: 'generic',
        filePath: 'config/crypto.default.json',
        lineNumber: 4,
        commitHash: '91d5a71',
        author: 'crypto.team@fintechcorp.internal',
        maskedValue: '3d8a9f2b••••••••••••••••••••••••••••••••e109c',
        confidence: 'MEDIUM',
        risk: 'MEDIUM',
        entropy: 4.88,
        detectedAt: '2026-10-24T10:14:22Z',
        codeSnippet: {
          beforeLines: [
            { line: 2, text: '{' },
            { line: 3, text: '  "saltRounds": 12,' },
          ],
          targetLine: {
            line: 4,
            text: '  "hmacFallbackSeed": "3d8a9f2b••••••••••••••••••••••••••••••••e109c",',
            secretSubstring: '"3d8a9f2b••••••••••••••••••••••••••••••••e109c"',
          },
          afterLines: [
            { line: 5, text: '  "cacheTtlSeconds": 3600' },
            { line: 6, text: '}' },
          ],
        },
        impact: 'Potential use as fallback HMAC integrity key; exposure could enable verification forgery if fallback code path triggers.',
        remediation: {
          summary: 'Check if this token is a dummy test fixture or live fallback seed. If live, move to KMS or environment variable.',
          rotationSteps: [
            'Verify codebase usage of "hmacFallbackSeed".',
            'If used in production, invalidate current HMAC signatures or trigger key rollover.',
            'Replace static string with process.env.HMAC_SECRET_SEED.',
          ],
          gitPurgeCommand: 'git filter-repo --path config/crypto.default.json --invert-paths',
          safeAlternativeCode: `// Load from environment with fallback validation:
const hmacSeed = process.env.HMAC_SECRET_SEED;
if (process.env.NODE_ENV === 'production' && !hmacSeed) {
  throw new Error('Production requires HMAC_SECRET_SEED to be set.');
}`,
          documentationUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html',
        },
        status: 'in_review',
      },
      {
        id: 'SEC-8907',
        ruleId: 'SEC-RULE-GENERIC-003',
        secretType: 'Hardcoded Internal API Bearer Token',
        provider: 'generic',
        filePath: 'test/mocks/internalAuthMock.ts',
        lineNumber: 11,
        commitHash: '2f11c99',
        author: 'qa.dan@fintechcorp.internal',
        maskedValue: 'Bearer mock_int_••••••••••••••••••••831b',
        confidence: 'LOW',
        risk: 'LOW',
        entropy: 3.75,
        detectedAt: '2026-10-24T10:14:22Z',
        codeSnippet: {
          beforeLines: [
            { line: 9, text: 'export const mockAuthHeaders = {' },
            { line: 10, text: '  "Content-Type": "application/json",' },
          ],
          targetLine: {
            line: 11,
            text: '  "Authorization": "Bearer mock_int_••••••••••••••••••••831b"',
            secretSubstring: '"Bearer mock_int_••••••••••••••••••••831b"',
          },
          afterLines: [
            { line: 12, text: '};' },
          ],
        },
        impact: 'Low blast radius if strictly used in unit tests, but risks leakage if mock mirrors production token schemas.',
        remediation: {
          summary: 'Ensure test mocks use explicitly marked dummy prefixes (e.g. test_dummy_value) or mark as False Positive.',
          rotationSteps: [
            'Confirm token is non-functional against production/staging clusters.',
            'Rename token to "dummy_test_mock_token_do_not_rotate".',
            'Or add to .secretshieldignore test directory.',
          ],
          gitPurgeCommand: '# Not necessary if confirmed pure test fixture',
          safeAlternativeCode: `export const mockAuthHeaders = {
  "Authorization": "Bearer dummy_test_token_non_production_mock"
};`,
          documentationUrl: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html',
        },
        status: 'false_positive',
      },
    ],
  },
  {
    id: 'cloud-microservices',
    name: 'Cloud Microservices API',
    description: 'Go & Python microservices orchestration repository with Kubernetes manifests and CI workflows.',
    icon: 'server',
    filesCount: 960,
    metrics: {
      totalFiles: 960,
      scannedFiles: 960,
      linesAnalyzed: 51200,
      durationMs: 920,
      criticalCount: 1,
      highCount: 2,
      mediumCount: 1,
      lowCount: 0,
      securityScore: 54,
    },
    findings: [
      {
        id: 'SEC-7011',
        ruleId: 'SEC-RULE-GITHUB-002',
        secretType: 'GitHub Personal Access Token (classic)',
        provider: 'github',
        filePath: '.github/workflows/deploy.yml',
        lineNumber: 34,
        commitHash: '8e124c1',
        author: 'devops@cloudcorp.internal',
        maskedValue: 'ghp_••••••••••••••••••••••••••••••••3vP0',
        confidence: 'HIGH',
        risk: 'CRITICAL',
        entropy: 5.68,
        detectedAt: '2026-10-24T09:12:00Z',
        codeSnippet: {
          beforeLines: [
            { line: 32, text: '    - name: Push Container Image' },
            { line: 33, text: '      run: |' },
          ],
          targetLine: {
            line: 34,
            text: '        echo "ghp_••••••••••••••••••••••••••••••••3vP0" | docker login ghcr.io -u devops --password-stdin',
            secretSubstring: '"ghp_••••••••••••••••••••••••••••••••3vP0"',
          },
          afterLines: [
            { line: 35, text: '        docker push ghcr.io/cloudcorp/api:latest' },
          ],
        },
        impact: 'Grants read/write access to all private repositories and packages belonging to the token owner.',
        remediation: {
          summary: 'Revoke the GitHub Personal Access Token immediately via GitHub Developer Settings and adopt secrets.GITHUB_TOKEN.',
          rotationSteps: [
            'Go to github.com/settings/tokens.',
            'Locate the matching token and click "Delete".',
            'Replace workflow login step with the built-in ephemeral secrets.GITHUB_TOKEN.',
          ],
          gitPurgeCommand: 'git filter-repo --path .github/workflows/deploy.yml --invert-paths',
          safeAlternativeCode: `# .github/workflows/deploy.yml
- name: Push Container Image
  run: |
    echo "\${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u "\${{ github.actor }}" --password-stdin
    docker push ghcr.io/cloudcorp/api:\${{ github.sha }}`,
          documentationUrl: 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens',
        },
        status: 'active',
      },
      {
        id: 'SEC-7012',
        ruleId: 'SEC-RULE-OPENAI-001',
        secretType: 'OpenAI Secret API Key',
        provider: 'openai',
        filePath: 'services/agent/llm_router.py',
        lineNumber: 18,
        commitHash: '6d29ea4',
        author: 'ai.engineer@cloudcorp.internal',
        maskedValue: 'sk-proj-••••••••••••••••••••••••••••••••••••••••••••Z9k2',
        confidence: 'HIGH',
        risk: 'HIGH',
        entropy: 5.79,
        detectedAt: '2026-10-24T09:12:00Z',
        codeSnippet: {
          beforeLines: [
            { line: 16, text: 'from openai import OpenAI' },
            { line: 17, text: '' },
          ],
          targetLine: {
            line: 18,
            text: 'client = OpenAI(api_key="sk-proj-••••••••••••••••••••••••••••••••••••••••••••Z9k2")',
            secretSubstring: '"sk-proj-••••••••••••••••••••••••••••••••••••••••••••Z9k2"',
          },
          afterLines: [
            { line: 19, text: '' },
            { line: 20, text: 'def get_completion(prompt):' },
          ],
        },
        impact: 'Exposed billing account limits; attackers can deplete API credits or access fine-tuned model embeddings and prompts.',
        remediation: {
          summary: 'Revoke key in the OpenAI platform dashboard and read from standard OPENAI_API_KEY environment variable.',
          rotationSteps: [
            'Log into platform.openai.com/api-keys.',
            'Revoke the exposed key and note any spike in usage.',
            'Create a scoped key with project-level permissions.',
          ],
          gitPurgeCommand: 'git filter-repo --path services/agent/llm_router.py --replace-text <(echo "sk-proj-...==>REDACTED")',
          safeAlternativeCode: `# services/agent/llm_router.py
import os
from openai import OpenAI

# OpenAI automatically checks OPENAI_API_KEY if no argument is passed
client = OpenAI()`,
          documentationUrl: 'https://platform.openai.com/docs/quickstart',
        },
        status: 'active',
      },
      {
        id: 'SEC-7013',
        ruleId: 'SEC-RULE-GCP-003',
        secretType: 'Google Cloud Service Account Private Key',
        provider: 'gcp',
        filePath: 'deploy/k8s/secrets-temp.json',
        lineNumber: 5,
        commitHash: '5e0031a',
        author: 'devops@cloudcorp.internal',
        maskedValue: '-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG••••••••••••••••\\n-----END PRIVATE KEY-----',
        confidence: 'HIGH',
        risk: 'HIGH',
        entropy: 5.81,
        detectedAt: '2026-10-24T09:12:00Z',
        codeSnippet: {
          beforeLines: [
            { line: 3, text: '  "project_id": "production-cloud-fleet",' },
            { line: 4, text: '  "private_key_id": "b18f0a2938174efc",' },
          ],
          targetLine: {
            line: 5,
            text: '  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG••••••••••••••••\\n-----END PRIVATE KEY-----",',
            secretSubstring: '"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG••••••••••••••••\\n-----END PRIVATE KEY-----"',
          },
          afterLines: [
            { line: 6, text: '  "client_email": "k8s-sync@production-cloud-fleet.iam.gserviceaccount.com"' },
          ],
        },
        impact: 'Allows unauthorized access to GCP Compute Engine, Cloud Storage buckets, and BigQuery data resources.',
        remediation: {
          summary: 'Delete key in GCP Cloud Console IAM and replace with Workload Identity Federation.',
          rotationSteps: [
            'Navigate to GCP Console > IAM & Admin > Service Accounts.',
            'Select the service account and delete the compromised key ID.',
            'Migrate Kubernetes pods to Google Cloud Workload Identity.',
          ],
          gitPurgeCommand: 'git filter-repo --path deploy/k8s/secrets-temp.json --invert-paths',
          safeAlternativeCode: `# Enable GCP Workload Identity on Kubernetes ServiceAccount instead of static keys:
apiVersion: v1
kind: ServiceAccount
metadata:
  name: cloud-sync-sa
  annotations:
    iam.gke.io/gcp-service-account: k8s-sync@production-cloud-fleet.iam.gserviceaccount.com`,
          documentationUrl: 'https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity',
        },
        status: 'active',
      },
      {
        id: 'SEC-7014',
        ruleId: 'SEC-RULE-SENDGRID-001',
        secretType: 'SendGrid Email API Token',
        provider: 'generic',
        filePath: 'services/notification/mailer.go',
        lineNumber: 22,
        commitHash: '1a98072',
        author: 'backend.rob@cloudcorp.internal',
        maskedValue: 'SG.••••••••••••••••••••••••.••••••••••••••••••••••••••••••••••••••••••••••',
        confidence: 'MEDIUM',
        risk: 'MEDIUM',
        entropy: 5.34,
        detectedAt: '2026-10-24T09:12:00Z',
        codeSnippet: {
          beforeLines: [
            { line: 20, text: 'func InitEmailProvider() *sendgrid.Client {' },
            { line: 21, text: '    // TODO: move to env var before prod launch' },
          ],
          targetLine: {
            line: 22,
            text: '    apiKey := "SG.••••••••••••••••••••••••.••••••••••••••••••••••••••••••••••••••••••••••"',
            secretSubstring: '"SG.••••••••••••••••••••••••.••••••••••••••••••••••••••••••••••••••••••••••"',
          },
          afterLines: [
            { line: 23, text: '    return sendgrid.NewSendClient(apiKey)' },
            { line: 24, text: '}' },
          ],
        },
        impact: 'Attacker can send unauthorized phishing emails from verified corporate domain records (SPF/DKIM).',
        remediation: {
          summary: 'Revoke key in SendGrid dashboard and fetch from os.Getenv("SENDGRID_API_KEY").',
          rotationSteps: [
            'Log into SendGrid > Settings > API Keys.',
            'Delete the compromised key.',
            'Generate a new key with "Mail Send" minimal scope.',
          ],
          gitPurgeCommand: 'git filter-repo --path services/notification/mailer.go --replace-text <(echo "SG....==>REDACTED")',
          safeAlternativeCode: `// services/notification/mailer.go
apiKey := os.Getenv("SENDGRID_API_KEY")
if apiKey == "" {
    log.Fatal("SENDGRID_API_KEY environment variable required")
}
return sendgrid.NewSendClient(apiKey)`,
          documentationUrl: 'https://docs.sendgrid.com/for-developers/sending-email/api-getting-started',
        },
        status: 'active',
      },
    ],
  },
  {
    id: 'clean-hardened-repo',
    name: 'Zero-Secret Hardened Repo',
    description: 'Clean repository with zero exposed secrets, 100% compliant secret hygiene with externalized vaults.',
    icon: 'shield-check',
    filesCount: 2150,
    metrics: {
      totalFiles: 2150,
      scannedFiles: 2150,
      linesAnalyzed: 142800,
      durationMs: 1650,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      securityScore: 100,
    },
    findings: [],
  },
  {
    id: 'simulate-error',
    name: 'Corrupted Archive / Parse Error (Test State)',
    description: 'Simulates an encrypted or corrupted zip archive failure state to verify error handling.',
    icon: 'alert-triangle',
    filesCount: 0,
    metrics: {
      totalFiles: 0,
      scannedFiles: 0,
      linesAnalyzed: 0,
      durationMs: 410,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      securityScore: 0,
    },
    findings: [],
  },
];
