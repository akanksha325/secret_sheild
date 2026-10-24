import React from 'react';

interface HeaderProps {
  onOpenReportModal: () => void;
  onResetScan: () => void;
  hasScanData: boolean;
  findingsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenReportModal,
  onResetScan,
  hasScanData,
  findingsCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-30 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-violet-950 border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
            <svg
              className="w-5 h-5 text-violet-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0B0F19]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-sans">
                Secret<span className="text-violet-400">Shield</span>
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-950/80 border border-violet-700/50 text-violet-300 font-semibold">
                v2.4.0
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Zero-Exposure Secret Detection & Remediation Engine
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Bar */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>84 Rules Active</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">AST + Entropy 4.5+</span>
          </div>

          {hasScanData && (
            <>
              <button
                onClick={onResetScan}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                title="Clear current scan and start fresh"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>New Scan</span>
              </button>

              <button
                onClick={onOpenReportModal}
                className="px-3.5 py-1.5 text-xs font-semibold text-violet-200 bg-violet-950/70 hover:bg-violet-900/80 border border-violet-700/70 rounded-lg shadow-sm transition-all hover:border-violet-500 flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Security Report</span>
                {findingsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {findingsCount}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
