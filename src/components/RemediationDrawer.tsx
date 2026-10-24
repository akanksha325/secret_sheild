import React, { useState } from 'react';
import { SecretFinding } from '../types';

interface RemediationDrawerProps {
  finding: SecretFinding | null;
  onClose: () => void;
  onUpdateStatus: (findingId: string, status: 'resolved' | 'false_positive' | 'active') => void;
}

export const RemediationDrawer: React.FC<RemediationDrawerProps> = ({
  finding,
  onClose,
  onUpdateStatus,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!finding) return null;

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div
        className="w-full max-w-2xl bg-[#0F172A] border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0B0F19] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono border ${
                finding.risk === 'CRITICAL'
                  ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                  : finding.risk === 'HIGH'
                  ? 'bg-orange-950/80 text-orange-300 border-orange-800/80'
                  : 'bg-amber-950/80 text-amber-300 border-amber-800/80'
              }`}
            >
              {finding.risk[0]}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white font-sans">
                  {finding.secretType}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {finding.ruleId}
                </span>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{finding.filePath}:{finding.lineNumber}</span>
                {finding.commitHash && (
                  <span className="text-violet-400 font-mono">
                    commit {finding.commitHash}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close details"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-300">
          {/* Blast Radius / Impact Banner */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 text-rose-200">
            <div className="flex items-center gap-2 font-semibold mb-1 text-rose-300 font-sans text-xs">
              <svg className="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Potential Blast Radius &amp; Threat Context</span>
            </div>
            <p className="leading-relaxed text-[11px] text-rose-200/90 font-sans">
              {finding.impact}
            </p>
          </div>

          {/* Code Inspection Snippet with Line Numbers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Contextual Code Inspection
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Entropy: {finding.entropy} bits
              </span>
            </div>

            <div className="bg-[#0B0F19] border border-slate-800 rounded-xl overflow-hidden font-mono text-[11px]">
              <div className="px-3 py-1.5 bg-slate-900/80 border-b border-slate-800 text-slate-400 flex items-center justify-between text-[10px]">
                <span>{finding.filePath}</span>
                <span className="text-violet-400">Strictly Masked</span>
              </div>
              <div className="p-3 divide-y divide-transparent">
                {/* Before lines */}
                {finding.codeSnippet.beforeLines.map((line) => (
                  <div key={line.line} className="flex gap-4 py-0.5 text-slate-500">
                    <span className="w-8 text-right select-none opacity-40">{line.line}</span>
                    <span className="text-slate-400">{line.text}</span>
                  </div>
                ))}

                {/* Target line with highlighted masked secret */}
                <div className="flex gap-4 py-1 bg-rose-950/30 text-rose-200 border-y border-rose-900/50 -mx-3 px-3">
                  <span className="w-8 text-right select-none font-bold text-rose-400">
                    {finding.codeSnippet.targetLine.line}
                  </span>
                  <span className="font-semibold break-all text-slate-200">
                    {finding.codeSnippet.targetLine.text}
                  </span>
                </div>

                {/* After lines */}
                {finding.codeSnippet.afterLines.map((line) => (
                  <div key={line.line} className="flex gap-4 py-0.5 text-slate-500">
                    <span className="w-8 text-right select-none opacity-40">{line.line}</span>
                    <span className="text-slate-400">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remediation Procedure Section */}
          <div className="space-y-4">
            <h3 className="font-sans font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-400" />
              Safe Remediation Workflow
            </h3>

            {/* Step 1: Invalidate & Rotate */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white font-mono text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-900/80 text-violet-300 flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Invalidate &amp; Rotate Active Secret
                </span>
                <a
                  href={finding.remediation.documentationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-violet-400 hover:text-violet-300 font-mono flex items-center gap-1"
                >
                  Provider Docs ↗
                </a>
              </div>
              <p className="text-slate-400 text-xs mb-3 font-sans">
                {finding.remediation.summary}
              </p>
              <ul className="space-y-1.5 font-sans text-xs">
                {finding.remediation.rotationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-violet-400 font-mono mt-0.5">›</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step 2: Git History Purge Command */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white font-mono text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-900/80 text-violet-300 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Purge from Git History
                </span>
                <button
                  onClick={() => handleCopy(finding.remediation.gitPurgeCommand, 'git')}
                  className="text-[11px] text-violet-400 hover:text-violet-300 font-mono flex items-center gap-1 hover:underline"
                >
                  {copiedSection === 'git' ? 'Copied ✓' : 'Copy Command'}
                </button>
              </div>
              <p className="text-slate-400 text-xs mb-2.5 font-sans">
                Committing a fix does not delete earlier commits. Use <code className="text-violet-300 font-mono">git-filter-repo</code> to rewrite commit history:
              </p>
              <div className="bg-[#0B0F19] border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-slate-200 overflow-x-auto">
                <code>{finding.remediation.gitPurgeCommand}</code>
              </div>
            </div>

            {/* Step 3: Safe Architectural Fix */}
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white font-mono text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-violet-900/80 text-violet-300 flex items-center justify-center text-[10px]">
                    3
                  </span>
                  Safe Architectural Implementation
                </span>
                <button
                  onClick={() => handleCopy(finding.remediation.safeAlternativeCode, 'code')}
                  className="text-[11px] text-violet-400 hover:text-violet-300 font-mono flex items-center gap-1 hover:underline"
                >
                  {copiedSection === 'code' ? 'Copied ✓' : 'Copy Code'}
                </button>
              </div>
              <p className="text-slate-400 text-xs mb-2.5 font-sans">
                Replace hardcoded strings with standard environment variable injection or KMS:
              </p>
              <pre className="bg-[#0B0F19] border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                <code>{finding.remediation.safeAlternativeCode}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F19] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onUpdateStatus(finding.id, 'false_positive');
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Mark False Positive
            </button>

            <button
              onClick={() => {
                onUpdateStatus(finding.id, 'resolved');
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Mark as Remediated</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
