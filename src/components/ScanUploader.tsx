import React, { useState } from 'react';
import { SampleProject, ScanOptions } from '../types';
import { SAMPLE_PROJECTS } from '../data/sampleProjects';
import { DEFAULT_DEMO_CODE } from '../utils/localScanner';

interface ScanUploaderProps {
  onSelectSample: (sample: SampleProject) => void;
  onUploadCustomFile: (file: File, options: ScanOptions, fileContent?: string) => void;
  onTriggerScan: () => void;
  selectedSampleId: string;
  isScanning: boolean;
  scanOptions: ScanOptions;
  onChangeOptions: (options: ScanOptions) => void;
  pastedCode: string;
  onChangePastedCode: (code: string) => void;
  onLoadDemoCredentials: () => void;
  inputMode: 'paste' | 'upload';
  onChangeInputMode: (mode: 'paste' | 'upload') => void;
}

export const ScanUploader: React.FC<ScanUploaderProps> = ({
  onSelectSample,
  onUploadCustomFile,
  onTriggerScan,
  selectedSampleId,
  isScanning,
  scanOptions,
  onChangeOptions,
  pastedCode,
  onChangePastedCode,
  onLoadDemoCredentials,
  inputMode,
  onChangeInputMode,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDemoLoaded, setIsDemoLoaded] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleLoadDemo = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // 1. Switch to paste editor mode
    onChangeInputMode('paste');
    // 2. Immediately populate code in input buffer
    onChangePastedCode(DEFAULT_DEMO_CODE);
    // 3. Notify parent app state
    onLoadDemoCredentials();
    // 4. Trigger visual confirmation badge
    setIsDemoLoaded(true);
    setTimeout(() => setIsDemoLoaded(false), 2200);
  };

  const processFile = async (file: File) => {
    setUploadedFileName(file.name);
    try {
      const text = await file.text();
      onUploadCustomFile(file, scanOptions, text);
    } catch {
      onUploadCustomFile(file, scanOptions);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 lg:p-6 shadow-xl relative overflow-hidden">
      {/* Subtle violet ambient glow on corner */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Left Input Area: Paste Code or Upload File */}
        <div className="flex-1 flex flex-col">
          {/* Header Controls: Mode Selector & Demo Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center p-1 bg-[#0B0F19] rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onChangeInputMode('paste')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  inputMode === 'paste'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Paste Code / Secrets</span>
              </button>
              <button
                type="button"
                onClick={() => onChangeInputMode('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  inputMode === 'upload'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Archive / File</span>
              </button>
            </div>

            {/* Prominent Demo Credentials Button */}
            <button
              type="button"
              id="demo-fake-credentials-btn"
              onClick={handleLoadDemo}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                isDemoLoaded
                  ? 'bg-emerald-600 text-white border border-emerald-400 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                  : 'text-amber-300 bg-amber-950/70 hover:bg-amber-900/90 border border-amber-600/60 hover:border-amber-400 hover:scale-102 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              }`}
              title="Populate input with fake AWS keys, GitHub tokens, Stripe secrets, and passwords"
            >
              <span className={isDemoLoaded ? 'text-white' : 'text-amber-400 font-bold'}>
                {isDemoLoaded ? '✓' : '⚡'}
              </span>
              <span>{isDemoLoaded ? 'Fake Credentials Loaded!' : 'Demo Fake Credentials'}</span>
            </button>
          </div>

          {/* Conditional View: Paste Code vs Dropzone */}
          {inputMode === 'paste' ? (
            <div className="flex-1 flex flex-col min-h-[220px] bg-[#0B0F19]/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-inner focus-within:border-violet-500/80 focus-within:ring-1 focus-within:ring-violet-500/40 relative">
              <div className="bg-slate-900/90 px-3.5 py-1.5 border-b border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">Live Client-Side Scanner Buffer</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>{pastedCode ? `${pastedCode.split('\n').length} lines` : '0 lines'}</span>
                  {pastedCode ? (
                    <button
                      type="button"
                      onClick={() => onChangePastedCode('')}
                      className="text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLoadDemo}
                      className="text-amber-400 hover:text-amber-300 text-[11px] font-mono underline cursor-pointer"
                    >
                      Insert demo credentials
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={pastedCode}
                onChange={(e) => onChangePastedCode(e.target.value)}
                placeholder="// Paste source code, config file, .env or API credentials here...&#10;// Or click '⚡ Demo Fake Credentials' above to instantly test detection of AWS, GitHub, Stripe, and Database secrets."
                className="w-full flex-1 min-h-[170px] p-3.5 bg-transparent text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none placeholder-slate-500"
                spellCheck={false}
              />

              {!pastedCode && (
                <div className="absolute inset-x-0 bottom-12 flex justify-center pointer-events-none">
                  <button
                    type="button"
                    onClick={handleLoadDemo}
                    className="pointer-events-auto px-4 py-2 rounded-xl bg-amber-950/90 hover:bg-amber-900 text-amber-300 border border-amber-600/70 text-xs font-mono font-medium shadow-xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>⚡</span>
                    <span>Click here to fill with Fake Demo Credentials</span>
                  </button>
                </div>
              )}

              <div className="px-3.5 py-1.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <svg className="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Air-Gapped: Scanned locally in browser (never transmitted to external services)
                </span>
                <span>Regex & Shannon Entropy</span>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex-1 min-h-[220px] border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative group ${
                isDragOver
                  ? 'border-violet-500 bg-violet-950/20 shadow-[0_0_25px_rgba(139,92,246,0.2)]'
                  : 'border-slate-700/80 hover:border-violet-600/60 bg-[#0B0F19]/60 hover:bg-[#0E1526]'
              }`}
              onClick={() => document.getElementById('file-upload-input')?.click()}
            >
              <input
                id="file-upload-input"
                type="file"
                className="hidden"
                accept=".zip,.tar,.gz,.json,.yml,.yaml,.env,.ts,.js,.py,.go"
                onChange={handleFileInputChange}
              />

              <div className="w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-800/60 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform mb-3 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>

              <h3 className="text-sm font-semibold text-white mb-1">
                {uploadedFileName ? (
                  <span className="text-violet-300 font-mono flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-400 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {uploadedFileName}
                  </span>
                ) : (
                  'Upload repository or source archive'
                )}
              </h3>

              <p className="text-xs text-slate-400 max-w-sm">
                Drag & drop <span className="font-mono text-slate-300">.zip</span>, source bundle, or individual files for client-side AST inspection.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Air-gapped safety: Raw secret values are never transmitted</span>
              </div>
            </div>
          )}
        </div>

        {/* Preset Sample Projects */}
        <div className="w-full lg:w-96 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Or Select Preset Project
              </span>
              <span className="text-[11px] text-slate-400">Instant realistic audit</span>
            </div>

            <div className="space-y-2">
              {SAMPLE_PROJECTS.map((sample) => {
                const isSelected = selectedSampleId === sample.id;
                const isErrorSimulation = sample.id === 'simulate-error';
                const isClean = sample.id === 'clean-hardened-repo';

                return (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setUploadedFileName(null);
                      onSelectSample(sample);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-violet-950/40 border-violet-500/80 ring-1 ring-violet-500/30'
                        : 'bg-[#0B0F19]/50 border-slate-800/90 hover:border-slate-700 hover:bg-[#0E1526]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono ${
                          isErrorSimulation
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                            : isClean
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-violet-950/60 text-violet-300 border border-violet-800/40'
                        }`}
                      >
                        {isErrorSimulation ? '!' : isClean ? '✓' : '⚡'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-200 truncate flex items-center gap-1.5">
                          <span>{sample.name}</span>
                          {isClean && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-mono">
                              0 leaks
                            </span>
                          )}
                          {isErrorSimulation && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800/40 font-mono">
                              error test
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {sample.description}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        {sample.filesCount > 0 ? `${sample.filesCount} files` : 'invalid'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scan Options and Primary Action */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={scanOptions.deepEntropy}
              onChange={(e) =>
                onChangeOptions({ ...scanOptions, deepEntropy: e.target.checked })
              }
              className="rounded bg-slate-900 border-slate-700 text-violet-600 focus:ring-violet-500 focus:ring-offset-slate-900 w-4 h-4"
            />
            <span>Deep Shannon Entropy (&gt;4.5 bits)</span>
          </label>

          <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={scanOptions.scanGitHistory}
              onChange={(e) =>
                onChangeOptions({ ...scanOptions, scanGitHistory: e.target.checked })
              }
              className="rounded bg-slate-900 border-slate-700 text-violet-600 focus:ring-violet-500 focus:ring-offset-slate-900 w-4 h-4"
            />
            <span>Token Boundary Verification</span>
          </label>
        </div>

        <button
          onClick={onTriggerScan}
          disabled={isScanning}
          className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
            isScanning
              ? 'bg-violet-950 text-violet-400 cursor-wait border border-violet-800'
              : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-950/60 hover:shadow-violet-900/40 border border-violet-400/30'
          }`}
        >
          {isScanning ? (
            <>
              <svg className="w-4 h-4 animate-spin text-violet-300" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Scanning Code Locally...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 text-violet-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Start Security Scan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
