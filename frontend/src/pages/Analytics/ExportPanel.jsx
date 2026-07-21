import { useState } from "react";

import { motion } from "framer-motion";

import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Mail,
  CheckCircle2,
} from "lucide-react";

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

  const handleExport = () => {

    console.log({

      format: selectedFormat,

      reportType,

      summary,

      passengerTrend,

      revenueAnalysis,

      busiestStations,

    });

    alert(
      `${selectedFormat} export functionality will be connected to the backend.`
    );

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

          <div className="mt-8 space-y-5">

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
                Export Format
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
                Included Data
              </p>

              <ul
                className="
                  mt-3
                  space-y-2
                  text-sm
                  text-slate-700
                "
              >
                <li>
                  • Executive KPIs
                </li>

                <li>
                  • Passenger Analytics
                </li>

                <li>
                  • Revenue Analysis
                </li>

                <li>
                  • Operational Metrics
                </li>

                <li>
                  • AI Insights
                </li>

                <li>
                  • Heatmap Analytics
                </li>

              </ul>

            </div>

            <div
              className="
                rounded-2xl
                border
                border-indigo-100
                bg-indigo-50
                p-5
              "
            >

              <p
                className="
                  text-sm
                  leading-7
                  text-slate-700
                "
              >
                The generated report will include
                charts, KPI summaries, AI insights,
                operational metrics, and analytics
                corresponding to the selected report
                type and export format.
              </p>

            </div>

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
            onClick={handleExport}
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
            "
          >

            <Download size={22} />

            Generate & Export Report

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
          </section>

  );

}

export default ExportPanel;