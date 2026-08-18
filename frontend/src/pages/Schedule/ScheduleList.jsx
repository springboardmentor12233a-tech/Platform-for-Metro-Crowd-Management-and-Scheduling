import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import api from "../../api/axios";
import ScheduleTable from "../../components/Schedule/ScheduleTable";

function ScheduleList() {

  const navigate = useNavigate();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchSchedules = async () => {

      try {

        const response = await api.get("/schedule/");

        setSchedules(response.data || []);

      } catch (error) {

        console.error(
          "Schedule API error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    fetchSchedules();

  }, []);

  return (

    <div className="min-h-screen bg-slate-100">

      <div className="max-w-[1800px] mx-auto px-8 py-8">

        {/* Back */}
        <button
          onClick={() => navigate("/schedule")}
          className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 mb-6 font-medium"
        >
          <ArrowLeft size={18} />
          Back to Schedule Operations
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl mb-8">

          <p className="text-cyan-400 text-xs font-semibold tracking-[0.3em] uppercase">
            Metro Operations
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Complete Train Schedule
          </h1>

          <p className="text-slate-300 mt-2">
            View today's complete AI-optimized metro timetable.
          </p>

        </div>

        {/* Existing Table */}
        <ScheduleTable
          scheduleData={schedules}
          loading={loading}
        />

      </div>

    </div>

  );
}

export default ScheduleList;