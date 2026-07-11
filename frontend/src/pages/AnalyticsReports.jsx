import React, { useState } from 'react';
import api from '../services/api';
import GlassmorphicCard from '../components/GlassmorphicCard';
import { FileSpreadsheet, FileText, Download, Calendar, Info } from 'lucide-react';

const AnalyticsReports = () => {
  const [reportType, setReportType] = useState('passenger');
  const [reportFormat, setReportFormat] = useState('csv');
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Direct Axios request with responseType arraybuffer/blob to download binary streams
      const response = await api.get('/reports/generate', {
        params: {
          type: reportType,
          format: reportFormat,
          start_date: startDate,
          end_date: endDate,
        },
        responseType: 'blob',
      });

      // Create download link
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      
      const fileExtensions = { csv: 'csv', xlsx: 'xlsx', pdf: 'pdf' };
      const extension = fileExtensions[reportFormat];
      link.download = `metroflow_${reportType}_report_${new Date().toISOString().split('T')[0]}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to generate report. Make sure backend libraries (openpyxl, reportlab) are installed.');
    } finally {
      setLoading(false);
    }
  };

  const reportDescriptions = {
    passenger: 'Hourly density logs, passenger counts, inflow vs outflow indices, and congestion level alerts history.',
    station: 'Directory list of metro stations, layout structure, platform counts, spatial coordinates, and line color associations.',
    occupancy: 'Train capacity tracking, average riders occupancy counts, standing capacity, and status operations.',
    delay: 'Breakdown log of delayed schedules, incident categories (signal, weather, tracks), and duration lists.',
    peak_hour: 'Hourly passenger density summaries, rush periods identification, and optimization recommendations.'
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="text-blue-500" />
          <span>Analytics Reports</span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Compile operational logs and download comprehensive CSV, Excel sheet, or PDF document reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* Form controls (Takes 2/3 width on desktop) */}
        <GlassmorphicCard className="md:col-span-2 space-y-4" hoverEffect={false}>
          <h3 className="font-bold text-base flex items-center gap-2 border-b pb-2">
            <span>Report Configuration</span>
          </h3>

          <form onSubmit={handleDownload} className="space-y-5 text-xs font-semibold">
            {/* Report Type */}
            <div className="space-y-1.5">
              <label className="text-slate-400 uppercase tracking-wider text-[10px]">Report Content Scope</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border cursor-pointer font-bold"
              >
                <option value="passenger">Passenger Density Flow Logs</option>
                <option value="station">Metro Stations Asset Directory</option>
                <option value="occupancy">Rolling Stock Capacity & Occupancy</option>
                <option value="delay">Operations Schedule Delays Log</option>
                <option value="peak_hour">Peak Hour Analysis Summary</option>
              </select>
            </div>

            {/* Date Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase tracking-wider text-[10px]">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border cursor-pointer font-bold"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400 uppercase tracking-wider text-[10px]">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border cursor-pointer font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Format Selector */}
            <div className="space-y-1.5">
              <label className="text-slate-400 uppercase tracking-wider text-[10px]">Export File Format</label>
              <div className="grid grid-cols-3 gap-3">
                {['csv', 'xlsx', 'pdf'].map((format) => (
                  <label
                    key={format}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 cursor-pointer text-center select-none transition-all ${
                      reportFormat === format
                        ? 'border-blue-500 bg-blue-500/10 text-blue-500 font-bold scale-[1.02]'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format}
                      checked={reportFormat === format}
                      onChange={() => setReportFormat(format)}
                      className="sr-only"
                    />
                    {format === 'pdf' ? (
                      <FileText size={18} />
                    ) : (
                      <FileSpreadsheet size={18} />
                    )}
                    <span className="uppercase text-[10px] tracking-wider">{format === 'xlsx' ? 'Excel' : format}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <Download size={16} />
                  <span>Generate & Export Report</span>
                </>
              )}
            </button>
          </form>
        </GlassmorphicCard>

        {/* Side Panel: Report Details */}
        <div className="space-y-6">
          <GlassmorphicCard className="space-y-4" hoverEffect={false}>
            <h3 className="font-bold text-base flex items-center gap-2">
              <Info size={16} className="text-blue-500" />
              <span>Report Scope Details</span>
            </h3>
            <div className="text-xs space-y-3 leading-relaxed">
              <p className="font-bold text-blue-500 uppercase tracking-wide text-[10px]">
                {reportType.replace('_', ' ')}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                {reportDescriptions[reportType]}
              </p>
              <div className="p-3 bg-slate-200/40 dark:bg-slate-800/40 border rounded-xl mt-4">
                <p className="font-bold mb-1">Standard inclusions:</p>
                <ul className="list-disc pl-4 space-y-1 opacity-75">
                  <li>Delhi Metro credentials</li>
                  <li>UTC timestamps</li>
                  <li>Admin signatures</li>
                </ul>
              </div>
            </div>
          </GlassmorphicCard>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsReports;
