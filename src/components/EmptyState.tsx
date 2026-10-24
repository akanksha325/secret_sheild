import React from 'react';

interface EmptyStateProps {
  onSelectSample: () => void;
  onLoadDemoCredentials?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSelectSample,
  onLoadDemoCredentials,
}) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-10 text-center shadow-lg relative overflow-hidden">
      <div className="max-w-md mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-900/40 to-slate-900 border border-violet-800/50 flex items-center justify-center text-violet-400 mb-4 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-white mb-2 font-sans">
          Ready for Source Code Audit
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed font-sans">
          Paste your code above, click <span className="text-amber-400 font-mono">Demo Fake Credentials</span>, or select a sample project to trigger the air-gapped regex and Shannon entropy scanner.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left font-mono text-[11px] mb-6">
          <div className="bg-[#0B0F19] border border-slate-800/80 p-3 rounded-xl">
            <span className="text-violet-400 font-bold block mb-1">01 / Regex + AST</span>
            <span className="text-slate-400 text-[10px]">Stripe, AWS, GitHub, GCP, OpenAI, RSA keys</span>
          </div>
          <div className="bg-[#0B0F19] border border-slate-800/80 p-3 rounded-xl">
            <span className="text-violet-400 font-bold block mb-1">02 / Shannon Math</span>
            <span className="text-slate-400 text-[10px]">Catches high-entropy cryptographic strings</span>
          </div>
          <div className="bg-[#0B0F19] border border-slate-800/80 p-3 rounded-xl">
            <span className="text-violet-400 font-bold block mb-1">03 / Air-Gapped</span>
            <span className="text-slate-400 text-[10px]">Client-side zero leakage. Raw values masked.</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {onLoadDemoCredentials && (
            <button
              type="button"
              onClick={onLoadDemoCredentials}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs tracking-wide uppercase transition-all shadow-lg shadow-amber-950/40 flex items-center gap-2 cursor-pointer hover:scale-102"
            >
              <span>⚡</span>
              <span>Demo Fake Credentials</span>
            </button>
          )}
          <button
            type="button"
            onClick={onSelectSample}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs tracking-wide uppercase transition-all shadow-lg shadow-violet-950/60 cursor-pointer"
          >
            Load Payment Gateway Sample
          </button>
        </div>
      </div>
    </div>
  );
};
