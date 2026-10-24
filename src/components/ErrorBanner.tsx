import React from 'react';

interface ErrorBannerProps {
  errorMessage: string;
  errorDetails?: string;
  onRetry: () => void;
  onSelectFallback: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  errorMessage,
  errorDetails,
  onRetry,
  onSelectFallback,
}) => {
  return (
    <div className="bg-rose-950/30 border border-rose-900/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800/80 flex items-center justify-center text-rose-400 flex-shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-rose-200 font-sans">
              Scan Pipeline Execution Failed
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/80">
              ERR_ARCHIVE_PARSE_FAILURE
            </span>
          </div>

          <p className="text-xs text-rose-300/90 mb-3 font-sans">
            {errorMessage}
          </p>

          {errorDetails && (
            <div className="bg-[#0B0F19] border border-rose-950/80 rounded-xl p-3 font-mono text-[11px] text-rose-300/80 mb-4 overflow-x-auto">
              <code>{errorDetails}</code>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRetry}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Retry Scan</span>
            </button>

            <button
              onClick={onSelectFallback}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Load Clean Benchmark Sample
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
