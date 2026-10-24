import React, { useState, useMemo } from 'react';
import { SecretFinding, RiskLevel } from '../types';

interface FindingsTableProps {
  findings: SecretFinding[];
  selectedFindingId: string | null;
  onSelectFinding: (finding: SecretFinding) => void;
  activeRiskFilter: string;
  onRiskFilterChange: (risk: string) => void;
}

export const FindingsTable: React.FC<FindingsTableProps> = ({
  findings,
  selectedFindingId,
  onSelectFinding,
  activeRiskFilter,
  onRiskFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFindings = useMemo(() => {
    return findings.filter((item) => {
      // Risk filter
      if (activeRiskFilter !== 'ALL' && item.risk !== activeRiskFilter) {
        return false;
      }
      // Provider filter
      if (providerFilter !== 'ALL' && item.provider !== providerFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchPath = item.filePath.toLowerCase().includes(q);
        const matchType = item.secretType.toLowerCase().includes(q);
        const matchRule = item.ruleId.toLowerCase().includes(q);
        if (!matchPath && !matchType && !matchRule) return false;
      }
      return true;
    });
  }, [findings, activeRiskFilter, providerFilter, searchQuery]);

  const handleCopyMasked = (e: React.MouseEvent, finding: SecretFinding) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${finding.filePath}:${finding.lineNumber} -> ${finding.maskedValue}`);
    setCopiedId(finding.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-rose-950/70 text-rose-300 border border-rose-800/60 shadow-[0_0_10px_rgba(244,63,94,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-orange-950/70 text-orange-300 border border-orange-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-amber-950/70 text-amber-300 border border-amber-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-blue-950/70 text-blue-300 border border-blue-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            LOW
          </span>
        );
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const color =
      confidence === 'HIGH'
        ? 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50'
        : confidence === 'MEDIUM'
        ? 'text-amber-400 bg-amber-950/50 border-amber-800/50'
        : 'text-slate-400 bg-slate-900 border-slate-800';

    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-medium border ${color}`}>
        {confidence}
      </span>
    );
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-800/90 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#0E1526]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by file path, secret type, or rule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0F19] border border-slate-800 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-violet-500 font-mono transition-colors placeholder:text-slate-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Filter Pills */}
          <div className="flex items-center bg-[#0B0F19] p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => onRiskFilterChange(risk)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                  activeRiskFilter === risk
                    ? 'bg-violet-900/60 text-violet-200 border border-violet-700/60 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>

          {/* Provider Dropdown */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="bg-[#0B0F19] border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-violet-500 font-mono"
          >
            <option value="ALL">All Providers</option>
            <option value="stripe">Stripe</option>
            <option value="aws">AWS</option>
            <option value="github">GitHub</option>
            <option value="openai">OpenAI</option>
            <option value="database">Database</option>
            <option value="slack">Slack</option>
            <option value="rsa">Cert / RSA</option>
            <option value="gcp">Google Cloud</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0B0F19]/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">Risk</th>
              <th className="py-3 px-4">Secret Type & Rule</th>
              <th className="py-3 px-4">File Path & Line</th>
              <th className="py-3 px-4">Masked Signature</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
            {filteredFindings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 font-sans">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-8 h-8 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-slate-400">No findings matched your filter parameters.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        onRiskFilterChange('ALL');
                        setProviderFilter('ALL');
                      }}
                      className="mt-2 text-xs text-violet-400 hover:underline"
                    >
                      Clear active filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredFindings.map((finding) => {
                const isSelected = selectedFindingId === finding.id;

                return (
                  <tr
                    key={finding.id}
                    onClick={() => onSelectFinding(finding)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-violet-950/30 hover:bg-violet-950/40'
                        : 'hover:bg-slate-800/40 bg-[#111827]'
                    }`}
                  >
                    {/* Risk Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRiskBadge(finding.risk)}
                    </td>

                    {/* Secret Type & Rule */}
                    <td className="py-3.5 px-4">
                      <div className="font-sans font-medium text-slate-200 group-hover:text-violet-300 transition-colors">
                        {finding.secretType}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {finding.ruleId} · {finding.provider.toUpperCase()}
                      </div>
                    </td>

                    {/* File Path & Line */}
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div className="flex items-center gap-1.5 truncate max-w-xs md:max-w-sm">
                        <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="truncate text-slate-300 group-hover:text-white" title={finding.filePath}>
                          {finding.filePath}
                        </span>
                        <span className="text-violet-400 font-bold px-1 py-0.2 rounded bg-violet-950/60 border border-violet-800/40 text-[10px]">
                          :{finding.lineNumber}
                        </span>
                      </div>
                    </td>

                    {/* Masked Value */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 bg-[#0B0F19] px-2 py-1 rounded border border-slate-800 truncate max-w-[200px] text-[11px]">
                          {finding.maskedValue}
                        </span>
                        <button
                          onClick={(e) => handleCopyMasked(e, finding)}
                          title="Copy masked reference"
                          className="text-slate-500 hover:text-violet-300 p-1 rounded hover:bg-slate-800 transition-colors"
                        >
                          {copiedId === finding.id ? (
                            <span className="text-emerald-400 text-[10px]">Copied!</span>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Confidence */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {getConfidenceBadge(finding.confidence)}
                        <span className="text-[10px] text-slate-500">
                          {finding.entropy.toFixed(1)}H
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFinding(finding);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-violet-950/70 hover:bg-violet-900 border border-violet-700/60 text-violet-200 transition-colors"
                      >
                        <span>Remediate</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-3.5 bg-[#0B0F19]/90 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span>Showing {filteredFindings.length} of {findings.length} findings</span>
          {activeRiskFilter !== 'ALL' && (
            <span className="text-violet-400">· Filtered by {activeRiskFilter}</span>
          )}
        </div>
        <div className="text-slate-500">
          Tip: Click any row to view safe rotation &amp; git-purge commands
        </div>
      </div>
    </div>
  );
};
