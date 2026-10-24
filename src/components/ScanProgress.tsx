import React from 'react';

interface ScanProgressProps {
  progress: number; // 0 - 100
  currentPhase: string;
  filesProcessed: number;
  totalFiles: number;
  findingsFoundSoFar: number;
  onCancelScan: () => void;
}

export const ScanProgress: React.FC<ScanProgressProps> = ({
  progress,
  currentPhase,
  filesProcessed,
  totalFiles,
  findingsFoundSoFar,
  onCancelScan,
}) => {
  return (
    <div className="bg-[#111827] border border-violet-900/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Background scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/5 to-transparent pointer-events-none animate-pulse" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-950/80 border border-violet-700/60 flex items-center justify-center text-violet-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>High-Sensitivity AST Scan In Progress</span>
              <span className="text-[11px] font-mono text-violet-400 bg-violet-950/80 px-2 py-0.5 rounded border border-violet-800">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
              <span>{currentPhase}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onCancelScan}
          className="text-xs font-mono text-slate-400 hover:text-rose-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-rose-900/60 bg-slate-900/80 hover:bg-rose-950/20 transition-colors"
        >
          Cancel Scan
        </button>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 mb-4">
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-violet-400 to-indigo-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Telemetry Stream */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="bg-[#0B0F19]/80 border border-slate-800/80 rounded-xl p-3">
          <div className="text-slate-400 text-[11px]">Files Processed</div>
          <div className="text-slate-100 font-semibold mt-1">
            {filesProcessed.toLocaleString()} / {totalFiles.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#0B0F19]/80 border border-slate-800/80 rounded-xl p-3">
          <div className="text-slate-400 text-[11px]">Active Rule Checks</div>
          <div className="text-violet-300 font-semibold mt-1">
            84 Signatures
          </div>
        </div>

        <div className="bg-[#0B0F19]/80 border border-slate-800/80 rounded-xl p-3">
          <div className="text-slate-400 text-[11px]">Candidate Leaks</div>
          <div className="text-amber-400 font-semibold mt-1">
            {findingsFoundSoFar} flagged
          </div>
        </div>

        <div className="bg-[#0B0F19]/80 border border-slate-800/80 rounded-xl p-3">
          <div className="text-slate-400 text-[11px]">Shannon Threshold</div>
          <div className="text-emerald-400 font-semibold mt-1">
            &gt; 4.50 bits/char
          </div>
        </div>
      </div>
    </div>
  );
};
