import React from 'react';
import { ScanMetrics, SecretFinding } from '../types';

interface SummaryCardsProps {
  metrics: ScanMetrics;
  findings: SecretFinding[];
  onFilterByRisk?: (risk: string) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  metrics,
  findings,
  onFilterByRisk,
}) => {
  const criticalAndHigh = metrics.criticalCount + metrics.highCount;
  const reviewItems = findings.filter(
    (f) => f.status === 'in_review' || f.risk === 'MEDIUM' || f.risk === 'LOW'
  ).length;

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Grade A · Excellent', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' };
    if (score >= 70) return { label: 'Grade B · Moderate', color: 'text-blue-400 bg-blue-950/60 border-blue-800/60' };
    if (score >= 40) return { label: 'Grade C · Elevated Risk', color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' };
    return { label: 'Grade F · Severe Exposure', color: 'text-rose-400 bg-rose-950/60 border-rose-800/60' };
  };

  const scoreBadge = getScoreBadge(metrics.securityScore);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Findings */}
      <div
        onClick={() => onFilterByRisk && onFilterByRisk('ALL')}
        className="bg-[#111827] border border-slate-800 hover:border-violet-600/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400 font-mono tracking-wider uppercase">
            Total Findings
          </span>
          <div className="w-8 h-8 rounded-lg bg-violet-950/60 border border-violet-800/40 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono tracking-tight text-white">
            {findings.length}
          </span>
          <span className="text-xs text-slate-400">
            in {metrics.scannedFiles.toLocaleString()} files
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Lines: {metrics.linesAnalyzed.toLocaleString()}</span>
          <span className="text-violet-400 group-hover:translate-x-0.5 transition-transform">
            View all →
          </span>
        </div>
      </div>

      {/* 2. High & Critical Risk Findings */}
      <div
        onClick={() => onFilterByRisk && onFilterByRisk('CRITICAL')}
        className={`bg-[#111827] border rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all cursor-pointer group ${
          criticalAndHigh > 0
            ? 'border-rose-900/60 hover:border-rose-600/70 bg-gradient-to-b from-[#111827] to-rose-950/10'
            : 'border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-rose-300/90 font-mono tracking-wider uppercase flex items-center gap-1.5">
            {criticalAndHigh > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
            High-Risk & Critical
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono tracking-tight text-rose-400">
            {criticalAndHigh}
          </span>
          <span className="text-xs text-rose-300/70">
            {metrics.criticalCount} crit / {metrics.highCount} high
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-rose-300/80">
          <span>Immediate key rotation</span>
          <span className="group-hover:translate-x-0.5 transition-transform">Filter →</span>
        </div>
      </div>

      {/* 3. Items Needing Review */}
      <div
        onClick={() => onFilterByRisk && onFilterByRisk('MEDIUM')}
        className="bg-[#111827] border border-slate-800 hover:border-amber-600/50 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400 font-mono tracking-wider uppercase">
            Items Needing Review
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono tracking-tight text-amber-300">
            {reviewItems}
          </span>
          <span className="text-xs text-slate-400">
            triaged or medium risk
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Entropy / Mock heuristics</span>
          <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">Inspect →</span>
        </div>
      </div>

      {/* 4. Security Posture Score */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400 font-mono tracking-wider uppercase">
            Security Hygiene
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center text-slate-300">
            <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold font-mono tracking-tight text-white">
            {metrics.securityScore}
          </span>
          <span className="text-xs text-slate-400">/ 100</span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
          <span className={`px-2 py-0.5 rounded-full border ${scoreBadge.color}`}>
            {scoreBadge.label}
          </span>
        </div>
      </div>
    </div>
  );
};
