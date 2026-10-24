import React, { useState, useEffect, useRef } from 'react';
import {
  SampleProject,
  SecretFinding,
  ScanMetrics,
  ScanStatus,
  ScanOptions,
} from './types';
import { SAMPLE_PROJECTS } from './data/sampleProjects';
import { Header } from './components/Header';
import { ScanUploader } from './components/ScanUploader';
import { ScanProgress } from './components/ScanProgress';
import { SummaryCards } from './components/SummaryCards';
import { FindingsTable } from './components/FindingsTable';
import { RemediationDrawer } from './components/RemediationDrawer';
import { ReportModal } from './components/ReportModal';
import { EmptyState } from './components/EmptyState';
import { ErrorBanner } from './components/ErrorBanner';
import { scanCodeLocally, DEFAULT_DEMO_CODE } from './utils/localScanner';

export const App: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<SampleProject>(SAMPLE_PROJECTS[0]);
  const [projectName, setProjectName] = useState<string>('demo-credentials-microservice.ts');
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanOptions, setScanOptions] = useState<ScanOptions>({
    deepEntropy: true,
    scanGitHistory: true,
    checkIgnoredFiles: false,
  });

  // Client-side paste & local file states
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [pastedCode, setPastedCode] = useState<string>('');
  const [uploadedFileContent, setUploadedFileContent] = useState<string | null>(null);

  // Telemetry during scanning
  const [scanProgress, setScanProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('Initializing AST parser...');
  const [filesProcessed, setFilesProcessed] = useState(0);
  const [findingsFoundSoFar, setFindingsFoundSoFar] = useState(0);

  // Active findings and metrics
  const [findings, setFindings] = useState<SecretFinding[]>([]);
  const [metrics, setMetrics] = useState<ScanMetrics>({
    totalFiles: 0,
    scannedFiles: 0,
    linesAnalyzed: 0,
    durationMs: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    securityScore: 100,
  });

  // UI modal / drawer state
  const [selectedFinding, setSelectedFinding] = useState<SecretFinding | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeRiskFilter, setActiveRiskFilter] = useState('ALL');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  const handleSelectSample = (sample: SampleProject) => {
    setSelectedSample(sample);
    setProjectName(sample.name);
    setErrorMessage(null);
    setErrorDetails(null);
  };

  const handleLoadDemoCredentials = () => {
    setInputMode('paste');
    setPastedCode(DEFAULT_DEMO_CODE);
    setProjectName('demo-credentials-microservice.ts');
    setScanStatus('idle');
    setFindings([]);
    setSelectedFinding(null);
    setErrorMessage(null);
    setErrorDetails(null);
  };

  const handleUploadCustomFile = (file: File, _options: ScanOptions, fileContent?: string) => {
    const isMockError = file.name.includes('corrupted') || file.name.endsWith('.bin');
    setInputMode('upload');
    setUploadedFileContent(fileContent || null);
    setProjectName(file.name);
    setErrorMessage(null);
    setErrorDetails(null);

    if (isMockError) {
      setSelectedSample(SAMPLE_PROJECTS.find((p) => p.id === 'simulate-error')!);
      return;
    }

    if (fileContent) {
      const local = scanCodeLocally(fileContent, file.name);
      const customProject: SampleProject = {
        id: 'uploaded-' + Date.now(),
        name: file.name,
        description: `Uploaded local file (${(file.size / 1024).toFixed(1)} KB)`,
        icon: 'file-code',
        filesCount: 1,
        metrics: local.metrics,
        findings: local.findings,
      };
      setSelectedSample(customProject);
    }
  };

  const startScan = () => {
    // 1. Error simulation check
    if (inputMode === 'upload' && selectedSample.id === 'simulate-error') {
      setScanStatus('scanning');
      setScanProgress(15);
      setCurrentPhase('Attempting decompression of archive headers...');
      setTimeout(() => {
        setScanStatus('error');
        setErrorMessage('Failed to parse archive: Central Directory record not found or compressed with unsupported cipher.');
        setErrorDetails('ZipBombProtectorException: Header magic 0x4B500102 mismatch at byte 1048. Possible encrypted archive or corrupted multi-part bundle.');
      }, 1100);
      return;
    }

    // Determine target code and file name
    let codeToScan = '';
    let targetFileName = projectName;

    if (inputMode === 'paste') {
      codeToScan = pastedCode.trim().length > 0 ? pastedCode : DEFAULT_DEMO_CODE;
      if (!pastedCode.trim()) {
        setPastedCode(DEFAULT_DEMO_CODE);
      }
      targetFileName = 'live-snippet.ts';
    } else if (inputMode === 'upload' && uploadedFileContent) {
      codeToScan = uploadedFileContent;
      targetFileName = projectName;
    }

    // If scanning local code (paste or uploaded text)
    if (codeToScan) {
      const localResult = scanCodeLocally(codeToScan, targetFileName);

      setScanStatus('scanning');
      setScanProgress(0);
      setFilesProcessed(0);
      setFindingsFoundSoFar(0);
      setErrorMessage(null);
      setErrorDetails(null);

      const phases = [
        'Parsing AST tokens & string literals...',
        'Running pattern engines (AWS IAM, GitHub PAT, Stripe, OpenAI, Passwords)...',
        'Calculating Shannon entropy distribution across token entropy gates...',
        'Validating token structure, risk scores, and line boundaries...',
        'Compiling contextual remediation guides and safe alternatives...',
      ];

      let currentStep = 0;
      const targetFindingsCount = localResult.findings.length;

      scanIntervalRef.current = setInterval(() => {
        currentStep++;
        const progressPercent = Math.min(100, currentStep * 20);
        setScanProgress(progressPercent);

        const phaseIdx = Math.min(phases.length - 1, Math.floor(currentStep - 1));
        setCurrentPhase(phases[phaseIdx]);

        setFilesProcessed(1);
        const simulatedFindings = Math.floor((progressPercent / 100) * targetFindingsCount);
        setFindingsFoundSoFar(simulatedFindings);

        if (progressPercent >= 100) {
          if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
          setTimeout(() => {
            setScanStatus('success');
            setFindings(localResult.findings);
            setMetrics(localResult.metrics);
          }, 200);
        }
      }, 200);
      return;
    }

    // 2. Preset sample project scan
    setScanStatus('scanning');
    setScanProgress(0);
    setFilesProcessed(0);
    setFindingsFoundSoFar(0);
    setErrorMessage(null);
    setErrorDetails(null);

    const phases = [
      'Indexing file tree and parsing AST tokens...',
      'Running regex signatures (Stripe, AWS, GitHub, GCP, OpenAI, RSA)...',
      'Calculating Shannon entropy distribution across string literals...',
      'Checking git commit history and diff blobs...',
      'Compiling contextual remediation guides...',
    ];

    let currentStep = 0;
    const totalFilesTarget = selectedSample.filesCount;
    const targetFindings = selectedSample.findings.length;

    scanIntervalRef.current = setInterval(() => {
      currentStep++;
      const progressPercent = Math.min(100, currentStep * 20);
      setScanProgress(progressPercent);

      const phaseIdx = Math.min(phases.length - 1, Math.floor(currentStep - 1));
      setCurrentPhase(phases[phaseIdx]);

      const simulatedFiles = Math.floor((progressPercent / 100) * totalFilesTarget);
      setFilesProcessed(simulatedFiles);

      const simulatedFindings = Math.floor((progressPercent / 100) * targetFindings);
      setFindingsFoundSoFar(simulatedFindings);

      if (progressPercent >= 100) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setTimeout(() => {
          setScanStatus('success');
          setFindings(selectedSample.findings);
          setMetrics(selectedSample.metrics);
        }, 250);
      }
    }, 220);
  };

  const handleCancelScan = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    setScanStatus('idle');
    setScanProgress(0);
  };

  const handleResetScan = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    setScanStatus('idle');
    setFindings([]);
    setSelectedFinding(null);
    setErrorMessage(null);
    setErrorDetails(null);
  };

  const handleUpdateFindingStatus = (findingId: string, status: 'resolved' | 'false_positive' | 'active') => {
    setFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, status } : f))
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-violet-600/30 selection:text-violet-200">
      {/* Top Header */}
      <Header
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onResetScan={handleResetScan}
        hasScanData={scanStatus === 'success'}
        findingsCount={findings.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Scanning & Upload Section */}
        <ScanUploader
          onSelectSample={handleSelectSample}
          onUploadCustomFile={handleUploadCustomFile}
          onTriggerScan={startScan}
          selectedSampleId={selectedSample.id}
          isScanning={scanStatus === 'scanning'}
          scanOptions={scanOptions}
          onChangeOptions={setScanOptions}
          pastedCode={pastedCode}
          onChangePastedCode={setPastedCode}
          onLoadDemoCredentials={handleLoadDemoCredentials}
          inputMode={inputMode}
          onChangeInputMode={setInputMode}
        />

        {/* Dynamic State Rendering */}

        {/* 1. Loading / Scanning State */}
        {scanStatus === 'scanning' && (
          <ScanProgress
            progress={scanProgress}
            currentPhase={currentPhase}
            filesProcessed={filesProcessed}
            totalFiles={inputMode === 'paste' ? 1 : selectedSample.filesCount}
            findingsFoundSoFar={findingsFoundSoFar}
            onCancelScan={handleCancelScan}
          />
        )}

        {/* 2. Error State */}
        {scanStatus === 'error' && (
          <ErrorBanner
            errorMessage={errorMessage || 'An unexpected scanner error occurred.'}
            errorDetails={errorDetails || undefined}
            onRetry={startScan}
            onSelectFallback={() => {
              handleSelectSample(SAMPLE_PROJECTS[0]);
              setScanStatus('idle');
            }}
          />
        )}

        {/* 3. Empty State (Initial) */}
        {scanStatus === 'idle' && (
          <EmptyState
            onSelectSample={() => {
              handleSelectSample(SAMPLE_PROJECTS[0]);
              startScan();
            }}
            onLoadDemoCredentials={handleLoadDemoCredentials}
          />
        )}

        {/* 4. Success State (Clean Repo with 0 Findings) */}
        {scanStatus === 'success' && findings.length === 0 && (
          <div className="bg-[#111827] border border-emerald-900/40 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400 mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Zero Exposed Secrets Detected
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-5 font-sans">
              Scanned {metrics.scannedFiles.toLocaleString()} files and {metrics.linesAnalyzed.toLocaleString()} lines of code across all commits. All pattern signatures passed with zero leaked keys or passwords.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-xs font-mono text-emerald-300">
              <span>Security Posture: 100/100 (Grade A·Clean)</span>
            </div>
          </div>
        )}

        {/* 5. Success State with Findings */}
        {scanStatus === 'success' && findings.length > 0 && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <SummaryCards
              metrics={metrics}
              findings={findings}
              onFilterByRisk={setActiveRiskFilter}
            />

            {/* Findings Table */}
            <FindingsTable
              findings={findings}
              selectedFindingId={selectedFinding ? selectedFinding.id : null}
              onSelectFinding={(f) => setSelectedFinding(f)}
              activeRiskFilter={activeRiskFilter}
              onRiskFilterChange={setActiveRiskFilter}
            />
          </div>
        )}
      </main>

      {/* Slide-out Remediation Drawer */}
      <RemediationDrawer
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
        onUpdateStatus={handleUpdateFindingStatus}
      />

      {/* Security Report Download Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        projectName={projectName}
        metrics={metrics}
        findings={findings}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080C14] py-4 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SecretShield Enterprise Scanner · Zero-Exposure Policy Enforced</span>
          <span className="text-slate-600">All displayed secrets are synthetic dummy tokens with cryptographic masking</span>
        </div>
      </footer>
    </div>
  );
};
export default App;
