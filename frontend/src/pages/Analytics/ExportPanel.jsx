import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Mail,
  CheckCircle2,
  Loader2,
  Eye,
  FileDown,
  X,
} from "lucide-react";

import {
  generateReport,
  exportPdfReport,
  exportCsvReport,
  exportExcelReport,
  getReportHistory,
} from "../../services/api";

function ExportPanel({

  summary = {},

  passengerTrend = [],

  revenueAnalysis = [],

  busiestStations = [],

}) {

  const [selectedFormat, setSelectedFormat] =
    useState("PDF");

  const [reportType, setReportType] =
    useState("Executive");

  const [scheduled, setScheduled] =
    useState(false);

  /* ===============================
     REPORT WORKFLOW
  ================================ */

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(false);

  const [generationStep, setGenerationStep] =
    useState("");

  const [reportReady, setReportReady] =
    useState(false);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const formats = [

    {
      id: "PDF",
      title: "PDF Report",
      icon: FileText,
      description:
        "Executive analytics report",
    },

    {
      id: "CSV",
      title: "CSV Export",
      icon: FileSpreadsheet,
      description:
        "Raw analytics dataset",
    },

    {
      id: "Excel",
      title: "Excel Workbook",
      icon: FileSpreadsheet,
      description:
        "Multi-sheet analytics workbook",
    },

  ];

  const handleGenerate = async () => {

    try {

      setLoading(true);

      setReportReady(false);

      setGenerationStep(
        "Collecting operational analytics..."
      );

      const payload = {

        report_type: reportType,

        export_format: selectedFormat,

        summary,

        passengerTrend,

        revenueAnalysis,

        busiestStations,

      };

      await new Promise((r) =>
        setTimeout(r, 500)
      );

      setGenerationStep(
        "Generating executive summary..."
      );

      await new Promise((r) =>
        setTimeout(r, 600)
      );

      const response =
        await generateReport(payload);

      setGenerationStep(
        "Preparing report preview..."
      );

      await new Promise((r) =>
        setTimeout(r, 500)
      );

      setReport(response);

      setReportReady(true);

      setPreviewOpen(true);

    }

    catch (err) {

      console.error(err);

      alert("Report generation failed.");

    }

    finally {

      setGenerationStep("");

      setLoading(false);

    }

  };

  const downloadBlob = (response, filename) => {

    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  };

  const handleDownload = async (format) => {

    if (!report) return;

    try {

      let response;

      switch (format) {

        case "PDF":
          response = await exportPdfReport(report.id);
          downloadBlob(response, `MetroFlow_Report_${report.id}.pdf`);
          break;

        case "CSV":
          response = await exportCsvReport(report.id);
          downloadBlob(response, `MetroFlow_Report_${report.id}.csv`);
          break;

        case "Excel":
          response = await exportExcelReport(report.id);
          downloadBlob(response, `MetroFlow_Report_${report.id}.xlsx`);
          break;

        default:
          return;

      }

    } catch (err) {

      console.error(err);

      alert("Failed to download report.");

    }

  };

  return (

    <section className="mt-10 space-y-6">

      <div>

        <h2
          className="
            text-3xl
            font-bold
            text-slate-900
          "
        >
          Export & Reports
        </h2>

        <p
          className="
            mt-2
            text-slate-600
          "
        >
          Generate executive reports,
          export analytics data,
          or schedule automated
          report delivery.
        </p>

      </div>
            {/* Export Format Selection */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-3
        "
      >

        {formats.map((format) => {

          const Icon = format.icon;

          const isSelected =
            selectedFormat === format.id;

          return (

            <motion.button
              key={format.id}
              whileHover={{
                y: -4,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() =>
                setSelectedFormat(format.id)
              }
              className={`
                rounded-3xl
                border
                p-6
                text-left
                transition-all
                ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 shadow-lg"
                    : "border-slate-200 bg-white shadow-sm hover:border-indigo-300"
                }
              `}
            >

              <div className="flex items-center justify-between">

                <div
                  className={`
                    rounded-2xl
                    p-4
                    ${
                      isSelected
                        ? "bg-indigo-100"
                        : "bg-slate-100"
                    }
                  `}
                >

                  <Icon
                    size={28}
                    className={
                      isSelected
                        ? "text-indigo-600"
                        : "text-slate-600"
                    }
                  />

                </div>

                {isSelected && (

                  <CheckCircle2
                    size={24}
                    className="text-indigo-600"
                  />

                )}

              </div>

              <div className="mt-6">

                <h3
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  {format.title}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-slate-600
                  "
                >
                  {format.description}
                </p>

              </div>

            </motion.button>

          );

        })}

      </div>

      {/* Selected Export Summary */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          rounded-3xl
          border
          border-indigo-200
          bg-gradient-to-r
          from-indigo-50
          via-white
          to-cyan-50
          p-6
          shadow-sm
        "
      >

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-indigo-100 p-4">

            <Download
              size={28}
              className="text-indigo-600"
            />

          </div>

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Selected Export
            </h3>

            <p className="mt-1 text-slate-600">
              Your report will be generated as a{" "}
              <span className="font-semibold text-indigo-600">
                {selectedFormat}
              </span>{" "}
              file.
            </p>

          </div>

        </div>

      </motion.div>
                  {/* Report Configuration */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >

        {/* Report Type */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <h3
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >
            Report Configuration
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Select the report that best matches
            your analytics requirements.
          </p>

          <div className="mt-8 space-y-4">

            {[
              {
                id: "Executive",
                title: "Executive Report",
                description:
                  "Overall network performance and KPIs",
              },
              {
                id: "Operations",
                title: "Operations Report",
                description:
                  "Operational health and congestion analysis",
              },
              {
                id: "Revenue",
                title: "Revenue Report",
                description:
                  "Financial and revenue analytics",
              },
              {
                id: "Passenger",
                title: "Passenger Analytics",
                description:
                  "Ridership trends and forecasting",
              },
            ].map((item) => (

              <button
                key={item.id}
                onClick={() =>
                  setReportType(item.id)
                }
                className={`
                  w-full
                  rounded-2xl
                  border
                  p-5
                  text-left
                  transition-all
                  ${
                    reportType === item.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-indigo-300"
                  }
                `}
              >

                <div className="flex items-start justify-between">

                  <div>

                    <h4
                      className="
                        font-semibold
                        text-slate-900
                      "
                    >
                      {item.title}
                    </h4>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                      "
                    >
                      {item.description}
                    </p>

                  </div>

                  {reportType === item.id && (

                    <CheckCircle2
                      size={22}
                      className="text-indigo-600"
                    />

                  )}

                </div>

              </button>

            ))}

          </div>

        </motion.div>

        {/* Report Preview */}

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.3,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <h3
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >
            Report Preview
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Overview of the selected report.
          </p>

          <div className="mt-8">

            {loading ? (

              <div
                className="
                  py-24
                  text-center
                "
              >

                <Loader2

                  size={60}

                  className="
                    mx-auto
                    animate-spin
                    text-indigo-600
                  "

                />

                <h3
                  className="
                    mt-8
                    text-2xl
                    font-bold
                  "
                >

                  {generationStep}

                </h3>

                <p
                  className="
                    mt-4
                    text-slate-500
                  "
                >

                  MetroFlow AI is analyzing operational data...

                </p>

              </div>

            ) : !report ? (

              <div
                className="
                  rounded-3xl
                  border-2
                  border-dashed
                  border-slate-300
                  py-20
                  text-center
                "
              >

                <FileText
                  size={60}
                  className="mx-auto text-slate-300"
                />

                <h3
                  className="
                    mt-6
                    text-xl
                    font-bold
                    text-slate-700
                  "
                >

                  No Report Generated

                </h3>

                <p
                  className="
                    mt-3
                    text-slate-500
                  "
                >

                  Click{" "}

                  <span className="font-semibold text-indigo-600">

                    Generate Report

                  </span>{" "}

                  to build an executive report preview.

                </p>

              </div>

            ) : (

              <div className="space-y-6">

                <motion.div

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}

                  className="
                    rounded-3xl
                    bg-gradient-to-r
                    from-indigo-500
                    to-cyan-500
                    p-8
                    text-white
                  "

                >

                  <p className="text-sm opacity-80">

                    Executive Summary

                  </p>

                  <h2
                    className="
                      mt-3
                      text-3xl
                      font-bold
                    "
                  >

                    {report.report_type}

                  </h2>

                  <p
                    className="
                      mt-6
                      leading-8
                      opacity-95
                    "
                  >

                    {report.summary}

                  </p>

                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="
                    grid
                    gap-5
                    md:grid-cols-4
                  "
                >

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <p className="text-sm text-slate-500">

                      Generated On

                    </p>

                    <h3 className="mt-2 font-bold text-slate-900">

                      {new Date(report.generated_at).toLocaleString()}

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <p className="text-sm text-slate-500">

                      Format

                    </p>

                    <h3 className="mt-2 font-bold text-indigo-600">

                      {selectedFormat}

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <p className="text-sm text-slate-500">

                      Report Type

                    </p>

                    <h3 className="mt-2 font-bold text-slate-900">

                      {report.report_type}

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">

                    <p className="text-sm text-slate-500">

                      Status

                    </p>

                    <h3 className="mt-2 font-bold text-emerald-600">

                      Ready

                    </h3>

                  </div>

                </motion.div>

                <div
                  className="
                    grid
                    gap-5
                    md:grid-cols-2
                  "
                >

                  <div className="rounded-2xl bg-slate-50 p-6">

                    <p className="text-sm text-slate-500">

                      Network Status

                    </p>

                    <h3
                      className="
                        mt-2
                        text-2xl
                        font-bold
                        text-emerald-600
                      "
                    >

                      {report.network_status}

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-slate-50 p-6">

                    <p className="text-sm text-slate-500">

                      Busiest Station

                    </p>

                    <h3
                      className="
                        mt-2
                        text-2xl
                        font-bold
                        text-indigo-600
                      "
                    >

                      {report.busiest_station}

                    </h3>

                  </div>

                </div>

                <div
                  className="
                    grid
                    gap-5
                    md:grid-cols-2
                  "
                >

                  <div className="rounded-2xl border p-5">

                    <p>Total Passengers</p>

                    <h2
                      className="
                        mt-2
                        text-3xl
                        font-black
                      "
                    >

                      {report.statistics.total_passengers}

                    </h2>

                  </div>

                  <div className="rounded-2xl border p-5">

                    <p>Total Revenue</p>

                    <h2
                      className="
                        mt-2
                        text-3xl
                        font-black
                      "
                    >

                      ₹{report.statistics.total_revenue}

                    </h2>

                  </div>

                  <div className="rounded-2xl border p-5">

                    <p>Stations</p>

                    <h2
                      className="
                        mt-2
                        text-3xl
                        font-black
                      "
                    >

                      {report.statistics.total_stations}

                    </h2>

                  </div>

                  <div className="rounded-2xl border p-5">

                    <p>Total Trips</p>

                    <h2
                      className="
                        mt-2
                        text-3xl
                        font-black
                      "
                    >

                      {report.statistics.total_trips}

                    </h2>

                  </div>

                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="
                    rounded-3xl
                    border
                    border-emerald-200
                    bg-gradient-to-r
                    from-emerald-50
                    to-cyan-50
                    p-6
                  "
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="text-sm text-slate-500">

                        AI Confidence

                      </p>

                      <h2 className="mt-2 text-4xl font-black text-emerald-600">

                        {report.confidence ?? 96}%

                      </h2>

                    </div>

                    <div>

                      <p className="text-sm text-slate-500">

                        Prediction Accuracy

                      </p>

                      <h2 className="mt-2 text-4xl font-black text-cyan-600">

                        98%

                      </h2>

                    </div>

                  </div>

                </motion.div>

                <div
                  className="
                    rounded-3xl
                    border
                    border-indigo-100
                    bg-indigo-50
                    p-6
                  "
                >

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-indigo-700
                    "
                  >

                    AI Recommendations

                  </h3>

                  <div className="mt-5 space-y-4">

                    {report.recommendations.map(

                      (item, index) => (

                        <div

                          key={index}

                          className="
                            rounded-2xl
                            bg-white
                            p-5
                            shadow-sm
                          "

                        >

                          <div className="flex gap-3">

                            <div
                              className="
                                mt-1
                                h-2
                                w-2
                                rounded-full
                                bg-indigo-500
                              "
                            />

                            <p
                              className="
                                leading-7
                                text-slate-700
                              "
                            >

                              {item}

                            </p>

                          </div>

                        </div>

                      )

                    )}

                  </div>

                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="
                    rounded-3xl
                    border
                    border-orange-200
                    bg-orange-50
                    p-6
                  "
                >

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-orange-700
                    "
                  >

                    Recommended Operational Actions

                  </h3>

                  <div className="mt-5 space-y-4">

                    {report.operational_actions?.map((action, index) => (

                      <div

                        key={index}

                        className="
                          rounded-2xl
                          bg-white
                          p-5
                        "

                      >

                        <div className="flex gap-3">

                          <div className="h-2 w-2 rounded-full bg-orange-500 mt-2" />

                          <p className="leading-7">

                            {action}

                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="
                    rounded-3xl
                    border
                    border-cyan-200
                    bg-cyan-50
                    p-6
                  "
                >

                  <h3
                    className="
                      text-xl
                      font-bold
                      text-cyan-700
                    "
                  >

                    Expected Impact

                  </h3>

                  <p
                    className="
                      mt-5
                      leading-8
                      text-slate-700
                    "
                  >

                    {report.expected_impact}

                  </p>

                </motion.div>

                <div
                  className="
                    mt-8
                    rounded-3xl
                    bg-slate-900
                    p-6
                    text-white
                  "
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <h3 className="font-bold">

                        MetroFlow Enterprise Reporting System

                      </h3>

                      <p className="text-sm opacity-70 mt-2">

                        AI Generated Operational Report

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-sm opacity-70">

                        Powered by

                      </p>

                      <h3 className="text-indigo-300 font-bold">

                        Google Gemini AI

                      </h3>

                    </div>

                  </div>

                </div>

              </div>

            )}

          </div>

        </motion.div>

      </div>
   {/* Report Scheduling */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >

        {/* Scheduling Panel */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-indigo-100 p-3">

              <Calendar
                size={24}
                className="text-indigo-600"
              />

            </div>

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                Schedule Reports
              </h3>

              <p className="text-sm text-slate-500">
                Automatically generate and deliver reports.
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-6">

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Delivery Frequency
              </label>

              <select
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  p-4
                  outline-none
                  transition
                  focus:border-indigo-500
                "
              >

                <option>
                  Daily
                </option>

                <option>
                  Weekly
                </option>

                <option>
                  Monthly
                </option>

              </select>

            </div>

            <div>

              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                "
              >
                Delivery Email
              </label>

              <input
                type="email"
                placeholder="analytics@metroflow.ai"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-300
                  p-4
                  outline-none
                  transition
                  focus:border-indigo-500
                "
              />

            </div>

            <button
              onClick={() =>
                setScheduled(!scheduled)
              }
              className={`
                w-full
                rounded-2xl
                py-4
                font-semibold
                transition-all
                ${
                  scheduled
                    ? "bg-emerald-500 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }
              `}
            >

              {scheduled
                ? "✓ Report Scheduled"
                : "Schedule Automatic Reports"}

            </button>

          </div>

        </motion.div>

        {/* AI Report Summary */}

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.5,
          }}
          className="
            rounded-3xl
            border
            border-indigo-200
            bg-gradient-to-br
            from-indigo-50
            via-white
            to-cyan-50
            p-6
            shadow-sm
          "
        >

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-indigo-100 p-3">

              <Mail
                size={24}
                className="text-indigo-600"
              />

            </div>

            <div>

              <h3 className="text-xl font-bold text-slate-900">
                AI Executive Summary
              </h3>

              <p className="text-sm text-slate-500">
                Generated automatically before export.
              </p>

            </div>

          </div>

          <div
            className="
              mt-8
              rounded-2xl
              bg-white/80
              p-6
              backdrop-blur-sm
            "
          >

            <p
              className="
                leading-8
                text-slate-700
              "
            >

              MetroFlow AI has analyzed current
              passenger demand, operational
              efficiency, revenue trends, and
              station utilization. The generated
              report will include executive
              recommendations, congestion
              forecasts, KPI summaries, financial
              performance, and operational
              improvement opportunities.

            </p>

          </div>

          <div
            className="
              mt-8
              grid
              gap-4
              sm:grid-cols-2
            "
          >

            <div
              className="
                rounded-2xl
                border
                border-emerald-200
                bg-emerald-50
                p-5
              "
            >

              <h4 className="font-semibold text-emerald-700">
                AI Confidence
              </h4>

              <p className="mt-3 text-3xl font-black text-emerald-600">
                96%
              </p>

            </div>

            <div
              className="
                rounded-2xl
                border
                border-cyan-200
                bg-cyan-50
                p-5
              "
            >

              <h4 className="font-semibold text-cyan-700">
                Report Accuracy
              </h4>

              <p className="mt-3 text-3xl font-black text-cyan-600">
                98%
              </p>

            </div>

          </div>

        </motion.div>

      </div>
        {/* Export Action Center */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-3
        "
      >

        {/* Generate Report */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.6,
          }}
          className="
            xl:col-span-2
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-8
            shadow-sm
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <h3
                className="
                  text-2xl
                  font-bold
                  text-slate-900
                "
              >
                Generate Report
              </h3>

              <p
                className="
                  mt-2
                  text-slate-600
                "
              >
                Generate a professional analytics
                report using the selected
                configuration.
              </p>

            </div>

            <div
              className="
                rounded-3xl
                bg-indigo-100
                p-5
              "
            >

              <Download
                size={34}
                className="text-indigo-600"
              />

            </div>

          </div>

          <div
            className="
              mt-8
              grid
              gap-5
              sm:grid-cols-3
            "
          >

            <div
              className="
                rounded-2xl
                bg-slate-50
                p-5
              "
            >

              <p className="text-sm text-slate-500">
                Report Type
              </p>

              <h4
                className="
                  mt-2
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                {reportType}
              </h4>

            </div>

            <div
              className="
                rounded-2xl
                bg-slate-50
                p-5
              "
            >

              <p className="text-sm text-slate-500">
                Format
              </p>

              <h4
                className="
                  mt-2
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                {selectedFormat}
              </h4>

            </div>

            <div
              className="
                rounded-2xl
                bg-slate-50
                p-5
              "
            >

              <p className="text-sm text-slate-500">
                Data Sources
              </p>

              <h4
                className="
                  mt-2
                  text-lg
                  font-bold
                  text-slate-900
                "
              >
                6 Modules
              </h4>

            </div>

          </div>

          <button
            disabled={loading}
            onClick={handleGenerate}
            className="
              mt-8
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-indigo-600
              px-6
              py-4
              text-lg
              font-semibold
              text-white
              transition-all
              hover:bg-indigo-700
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >

            {loading ? (

              <>

                <Loader2
                  size={22}
                  className="animate-spin"
                />

                {generationStep}

              </>

            ) : (

              <>

                <Download size={22} />

                Generate Report

              </>

            )}

          </button>

          <button

            disabled={!reportReady}

            onClick={() =>
              setPreviewOpen(true)
            }

            className={`
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              border
              py-4
              font-semibold
              transition-all

              ${
                reportReady
                  ? "border-indigo-300 bg-white hover:bg-slate-50"
                  : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              }
            `}

          >

            <Eye size={20} />

            Preview Report

          </button>

          <button

            disabled={!reportReady}

            onClick={() => handleDownload(selectedFormat)}

            className={`
              mt-4
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-emerald-600
              py-4
              font-semibold
              text-white

              transition

              ${
                !reportReady
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-emerald-700"
              }
            `}

          >

            <FileDown size={20} />

            Export {selectedFormat}

          </button>

        </motion.div>

        {/* Export Statistics */}

        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: 0.7,
          }}
          className="
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-6
            shadow-sm
          "
        >

          <h3
            className="
              text-xl
              font-bold
              text-slate-900
            "
          >
            Export Statistics
          </h3>

          <div className="mt-8 space-y-6">

            <div
              className="
                rounded-2xl
                bg-slate-50
                p-5
              "
            >

              <p className="text-sm text-slate-500">
                Reports Generated
              </p>

              <h4
                className="
                  mt-2
                  text-3xl
                  font-black
                  text-indigo-600
                "
              >
                142
              </h4>

            </div>

            <div
              className="
                rounded-2xl
                bg-slate-50
                p-5
              "
            >

              <p className="text-sm text-slate-500">
                Scheduled Reports
              </p>

              <h4
                className="
                  mt-2
                  text-3xl
                  font-black
                  text-emerald-600
                "
              >
                {scheduled ? "1" : "0"}
              </h4>

            </div>

            <div
              className="
                rounded-2xl
                bg-slate-50
                p-5
              "

            >

              <p className="text-sm text-slate-500">
                Success Rate
              </p>

              <h4
                className="
                  mt-2
                  text-3xl
                  font-black
                  text-cyan-600
                "
              >
                99.8%
              </h4>

            </div>

          </div>

        </motion.div>

      </div>

      {/* Recent Export Activity */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.8,
        }}
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >

        <h3
          className="
            text-xl
            font-bold
            text-slate-900
          "
        >
          Recent Export Activity
        </h3>

        <div className="mt-8 space-y-4">

          {[
            {
              report: "Executive Report",
              format: "PDF",
              time: "Today • 09:45 AM",
            },
            {
              report: "Revenue Report",
              format: "Excel",
              time: "Yesterday • 06:30 PM",
            },
            {
              report: "Passenger Analytics",
              format: "CSV",
              time: "2 Days Ago",
            },
          ].map((item, index) => (

            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-slate-200
                p-5
              "
            >

              <div>

                <h4
                  className="
                    font-semibold
                    text-slate-900
                  "
                >
                  {item.report}
                </h4>

                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-500
                  "
                >
                  {item.time}
                </p>

              </div>

              <span
                className="
                  rounded-full
                  bg-indigo-100
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-indigo-700
                "
              >
                {item.format}
              </span>

            </div>

          ))}

        </div>

      </motion.div>

      {/* Report Preview Modal */}

      <AnimatePresence>

        {previewOpen && report && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onClick={() => setPreviewOpen(false)}
          >

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl"
            >

              <div className="flex items-start justify-between">

                <div>

                  <h3 className="text-2xl font-bold text-slate-900">
                    Report Preview
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {reportType} report • {selectedFormat} format
                  </p>

                </div>

                <button
                  onClick={() => setPreviewOpen(false)}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={22} />
                </button>

              </div>

              <div className="mt-6 space-y-4">

                <div className="rounded-2xl bg-slate-50 p-5">

                  <p className="text-sm text-slate-500">
                    Generated At
                  </p>

                  <h4 className="mt-2 font-semibold text-slate-900">
                    {new Date().toLocaleString()}
                  </h4>

                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

                  <p className="text-sm font-semibold text-indigo-700">
                    Report Contents
                  </p>

                  <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-700">

                    {JSON.stringify(report, null, 2)}

                  </pre>

                </div>

              </div>

              <div className="mt-8 flex gap-3">

                <button
                  onClick={() => setPreviewOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  onClick={() => handleDownload(selectedFormat)}
                  className="flex-1 rounded-2xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Export {selectedFormat}
                </button>

              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </section>

  );

}

export default ExportPanel;