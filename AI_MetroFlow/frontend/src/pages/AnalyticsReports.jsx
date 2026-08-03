import React, { useEffect, useState } from 'react';
import { reportService } from '../services/api';
import { FileText, Download, FileSpreadsheet, FileCode, CheckCircle2 } from 'lucide-react';

export default function AnalyticsReports() {
  const [trafficReport, setTrafficReport] = useState(null);
  const [frequencyReport, setFrequencyReport] = useState(null);

  useEffect(() => {
    reportService.getTrafficReport()
      .then(res => setTrafficReport(res.data))
      .catch(err => console.error(err));

    reportService.getFrequencyReport()
      .then(res => setFrequencyReport(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDownload = (format) => {
    const link = document.createElement('a');
    link.href = reportService.downloadReport(format);
    link.setAttribute('download', `AI_MetroFlow_Report.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Operations Reports & Data Export</h1>
        <p className="text-sm text-slate-400">Compile network congestion summaries and download PDF/CSV documents</p>
      </div>

      {/* Export Action Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold font-heading text-white flex items-center space-x-2">
          <Download className="w-5 h-5 text-indigo-400" />
          <span>Export Network Data Sheets</span>
        </h2>
        <p className="text-xs text-slate-400">Select desired file format to stream station occupancy logs, dispatch frequency reports, and crowd surge risk indexes.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <button
            onClick={() => handleDownload('csv')}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-xl flex items-center space-x-3 text-left transition group"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">CSV Data Export</div>
              <span className="text-xs text-slate-500">Raw station dataset (.csv)</span>
            </div>
          </button>

          <button
            onClick={() => handleDownload('pdf')}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-xl flex items-center space-x-3 text-left transition group"
          >
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-110 transition">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Executive PDF Report</div>
              <span className="text-xs text-slate-500">Compiled PDF document</span>
            </div>
          </button>

          <button
            onClick={() => handleDownload('xlsx')}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex items-center space-x-3 text-left transition group"
          >
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Excel Spreadsheet</div>
              <span className="text-xs text-slate-500">Structured Excel file (.xlsx)</span>
            </div>
          </button>
        </div>
      </div>

      {/* Report Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trafficReport && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold font-heading text-white">{trafficReport.report_title}</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 py-1.5">
                <span className="text-slate-400">Total Active Passengers:</span>
                <span className="font-bold text-white">{trafficReport.total_active_passengers?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 py-1.5">
                <span className="text-slate-400">Peak Interchange Line:</span>
                <span className="font-bold text-yellow-400">{trafficReport.peak_line}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 py-1.5">
                <span className="text-slate-400">Congested Stations:</span>
                <span className="font-bold text-rose-400">{trafficReport.congested_stations_count}</span>
              </div>
            </div>
          </div>
        )}

        {frequencyReport && (
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold font-heading text-white">{frequencyReport.report_title}</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 py-1.5">
                <span className="text-slate-400">Fleet Cars in Service:</span>
                <span className="font-bold text-white">{frequencyReport.total_active_fleet} ({frequencyReport.in_service_percent}%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 py-1.5">
                <span className="text-slate-400">Average Headway Dispatch:</span>
                <span className="font-bold text-cyan-400">{frequencyReport.avg_headway_minutes} minutes</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 py-1.5">
                <span className="text-slate-400">On-Time Dispatch Rate:</span>
                <span className="font-bold text-emerald-400">{frequencyReport.on_time_performance_rate}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
