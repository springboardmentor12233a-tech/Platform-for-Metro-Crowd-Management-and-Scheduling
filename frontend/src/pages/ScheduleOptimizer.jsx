import { useState } from "react";

import OptimizationForm from "../components/scheduleOptimizer/OptimizationForm";
import OptimizationResult from "../components/scheduleOptimizer/OptimizationResult";

import trainScheduleOptimizerService from "../services/trainScheduleOptimizerService";

export default function ScheduleOptimizer() {

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  async function optimize(data) {

    try {

      setLoading(true);

      setResult(null);

      // =====================================================
      // Backend expects ONLY:
      // station_name
      // hour
      // day
      // month
      // weekend
      // =====================================================

      const requestData = {
        station_name: data.station_name,

        hour: Number(data.hour),

        day: Number(data.day),

        month: Number(data.month),

        weekend: Boolean(data.weekend),
      };

      console.log(
        "Train Schedule Optimizer Request:",
        requestData
      );

      const response =
        await trainScheduleOptimizerService.optimize(
          requestData
        );

      console.log(
        "Train Schedule Optimizer Response:",
        response.data
      );

      setResult(response.data);

    } catch (err) {

      console.error(
        "Schedule optimization failed:",
        err.response?.data || err
      );

      const detail =
        err.response?.data?.detail;

      if (Array.isArray(detail)) {

        alert(
          detail
            .map((error) => error.msg)
            .join("\n")
        );

      } else if (detail) {

        alert(detail);

      } else {

        alert(
          "Train schedule optimization failed."
        );

      }

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>

        <h1 className="text-4xl font-bold text-white">

          🚆 AI Train Schedule Optimizer

        </h1>

        <p className="text-slate-400 mt-2">

          AI-powered schedule optimization using
          passenger flow, crowd level, frequency,
          delay prediction and train allocation.

        </p>

      </div>


      {/* =====================================================
          INPUT FORM
      ===================================================== */}

      <OptimizationForm

        onSubmit={optimize}

        loading={loading}

      />


      {/* =====================================================
          RESULT
      ===================================================== */}

      <OptimizationResult

        result={result}

      />

    </div>

  );

}