import React, { useState } from 'react';
import { SecretFinding, ScanMetrics } from '../types';
import {
  generateMarkdownReport,
  generateCSVReport,
  generateSARIFReport,
  triggerDownload,
} from '../utils/exportReports';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  metrics: ScanMetrics;
  findings: SecretFinding[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  projectName,
  metrics,
  findings,
}) => {
  const [activeTab, setActiveTab] = useState<'markdown' | 'sarif' | 'csv'>('markdown');
  const [copyFeedback, setCopyFeedback] = useState(false);

  if (!isOpen) return null;

  const mdReport = generateMarkdownReport(projectName, metrics, findings);
  const csvReport = generateCSVReport(projectName, findings);
  const sarifReport = generateSARIFReport(projectName, findings);

  const getActiveContent = () => {
    switch (activeTab) {
      case 'markdown':
        return mdReport;
      case 'sarif':
        return sarifReport;
      case 'csv':
        return csvReport;
    }
  };

  const handleDownload = (format: 'markdown' | 'sarif' | 'csv') => {
    const timestamp = new Date().toISOString().split('T')[0];
    const sanitizedName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (format === 'markdown') {
      triggerDownload(mdReport, `secretshield-${sanitizedName}-${timestamp}.md`, 'text/markdown');
    } else if (format === 'sarif') {
      triggerDownload(sarifReport, `secretshield-${sanitizedName}-${timestamp}.sarif.json`, 'application/json');
    } else if (format === 'csv') {
      triggerDownload(csvReport, `secretshield-${sanitizedName}-${timestamp}.csv`, 'text/csv');
    }
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(getActiveContent());
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0B0F19] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-950/80 border border-violet-700/60 flex items-center justify-center text-violet-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-sans">
                Security Audit Report Center
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Repository: {projectName} · {findings.length} total finding{findings.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Download Action Cards */}
        <div className="p-5 bg-[#0B0F19]/40 border-b border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Markdown Advisory */}
          <button
            onClick={() => handleDownload('markdown')}
            className="p-3.5 rounded-xl border border-slate-800 hover:border-violet-600/70 bg-[#111827] hover:bg-[#151D33] text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-white group-hover:text-violet-300">
                Markdown Advisory
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/50">
                .md
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Formatted for GitHub Security Advisories, pull request summaries, or team documentation.
            </p>
            <div className="text-[11px] font-mono text-violet-400 font-medium flex items-center gap-1">
              <span>Download .md</span>
              <span className="group-hover:translate-x-0.5 transition-transform">↓</span>
            </div>
          </button>

          {/* 2. SARIF v2.1.0 */}
          <button
            onClick={() => handleDownload('sarif')}
            className="p-3.5 rounded-xl border border-slate-800 hover:border-violet-600/70 bg-[#111827] hover:bg-[#151D33] text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-white group-hover:text-violet-300">
                OASIS SARIF 2.1.0
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/50">
                .json
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Standard format for CI/CD pipelines, GitHub Advanced Security tabs, and DefectDojo.
            </p>
            <div className="text-[11px] font-mono text-violet-400 font-medium flex items-center gap-1">
              <span>Download SARIF</span>
              <span className="group-hover:translate-x-0.5 transition-transform">↓</span>
            </div>
          </button>

          {/* 3. CSV Spreadsheet */}
          <button
            onClick={() => handleDownload('csv')}
            className="p-3.5 rounded-xl border border-slate-800 hover:border-violet-600/70 bg-[#111827] hover:bg-[#151D33] text-left transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold text-white group-hover:text-violet-300">
                CSV Auditor Export
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800/50">
                .csv
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Structured spreadsheet format for SOC2, ISO 27001, and external auditor verification.
            </p>
            <div className="text-[11px] font-mono text-violet-400 font-medium flex items-center gap-1">
              <span>Download CSV</span>
              <span className="group-hover:translate-x-0.5 transition-transform">↓</span>
            </div>
          </button>
        </div>

        {/* Live Report Preview */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0B0F19]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                activeTab === 'markdown'
                  ? 'bg-violet-950 text-violet-200 border border-violet-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Markdown Preview
            </button>
            <button
              onClick={() => setActiveTab('sarif')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                activeTab === 'sarif'
                  ? 'bg-violet-950 text-violet-200 border border-violet-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SARIF Preview
            </button>
            <button
              onClick={() => setActiveTab('csv')}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-colors ${
                activeTab === 'csv'
                  ? 'bg-violet-950 text-violet-200 border border-violet-700/60'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CSV Raw
            </button>
          </div>

          <button
            onClick={handleCopyClipboard}
            className="px-3 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            {copyFeedback ? (
              <span className="text-emerald-400 font-semibold">Copied to Clipboard ✓</span>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Current View</span>
              </>
            )}
          </button>
        </div>

        {/* Preview Code View */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#080C14]">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
            {getActiveContent()}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B0F19] flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Redaction Active: Plaintext keys omitted from all exports</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
