import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";

function MonitoringFilters({
  onFilterChange,
}) {

  const [search, setSearch] =
    useState("");

  const [risk, setRisk] =
    useState("ALL");

  const [occupancy, setOccupancy] =
    useState("ALL");

  const [sortBy, setSortBy] =
    useState("RISK");

  function applyFilters(next = {}) {

    const filters = {
      search,
      risk,
      occupancy,
      sortBy,
      ...next,
    };

    onFilterChange?.(filters);

  }

  function resetFilters() {

    setSearch("");
    setRisk("ALL");
    setOccupancy("ALL");
    setSortBy("RISK");

    onFilterChange?.({
      search: "",
      risk: "ALL",
      occupancy: "ALL",
      sortBy: "RISK",
    });

  }

  return (

    <section className="space-y-6">

      {/* Header */}

      <div>

        <h2 className="text-3xl font-bold text-slate-900">
          Monitoring Filters
        </h2>

        <p className="mt-2 text-slate-500">
          Filter, search and prioritize live metro station monitoring data.
        </p>

      </div>
            {/* ==========================
          Filter Controls
      ========================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
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

        <div className="grid gap-5 lg:grid-cols-5">

          {/* Search */}

          <div className="lg:col-span-2">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Search Station
            </label>

            <div className="relative">

              <Search
                size={18}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                placeholder="Search station..."
                value={search}
                onChange={(e) => {

                  setSearch(e.target.value);

                  applyFilters({
                    search: e.target.value,
                  });

                }}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  py-3
                  pl-11
                  pr-4
                  outline-none
                  transition
                  focus:border-cyan-500
                  focus:ring-2
                  focus:ring-cyan-100
                "
              />

            </div>

          </div>

          {/* Risk Filter */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Risk Level
            </label>

            <select
              value={risk}
              onChange={(e) => {

                setRisk(e.target.value);

                applyFilters({
                  risk: e.target.value,
                });

              }}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-100
              "
            >
              <option value="ALL">
                All
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="LOW">
                Low
              </option>

            </select>

          </div>

          {/* Occupancy */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Occupancy
            </label>

            <select
              value={occupancy}
              onChange={(e) => {

                setOccupancy(e.target.value);

                applyFilters({
                  occupancy: e.target.value,
                });

              }}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-100
              "
            >
              <option value="ALL">
                All
              </option>

              <option value="HIGH">
                80%+
              </option>

              <option value="MEDIUM">
                60–79%
              </option>

              <option value="LOW">
                Below 60%
              </option>

            </select>

          </div>

          {/* Sort */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) => {

                setSortBy(e.target.value);

                applyFilters({
                  sortBy: e.target.value,
                });

              }}
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                px-4
                py-3
                outline-none
                focus:border-cyan-500
                focus:ring-2
                focus:ring-cyan-100
              "
            >
              <option value="RISK">
                Risk Score
              </option>

              <option value="OCCUPANCY">
                Occupancy
              </option>

              <option value="PASSENGERS">
                Passengers
              </option>

              <option value="NAME">
                Station Name
              </option>

            </select>

          </div>

        </div>

        {/* Reset Button */}

        <div className="mt-6 flex justify-end">

          <button
            onClick={resetFilters}
            className="
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-300
              px-5
              py-3
              text-sm
              font-semibold
              text-slate-700
              transition
              hover:bg-slate-100
            "
          >

            <RotateCcw size={18} />

            Reset Filters

          </button>

        </div>

      </motion.div>
            {/* ==========================
          Quick Filter Chips
      ========================== */}

      <div
        className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
        "
      >

        <div className="mb-5 flex items-center gap-3">

          <div className="rounded-xl bg-cyan-100 p-3">

            <Filter
              size={20}
              className="text-cyan-700"
            />

          </div>

          <div>

            <h3 className="text-xl font-bold text-slate-900">
              Quick Filters
            </h3>

            <p className="text-sm text-slate-500">
              Instantly apply commonly used monitoring filters.
            </p>

          </div>

        </div>

        <div className="flex flex-wrap gap-3">

          {/* Critical */}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {

              setRisk("HIGH");

              applyFilters({
                risk: "HIGH",
              });

            }}
            className="
              rounded-full
              bg-red-100
              px-5
              py-3
              text-sm
              font-semibold
              text-red-700
              transition
              hover:bg-red-200
            "
          >
            🔴 Critical Stations
          </motion.button>

          {/* Busy */}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {

              setRisk("MEDIUM");

              applyFilters({
                risk: "MEDIUM",
              });

            }}
            className="
              rounded-full
              bg-yellow-100
              px-5
              py-3
              text-sm
              font-semibold
              text-yellow-700
              transition
              hover:bg-yellow-200
            "
          >
            🟡 Busy Stations
          </motion.button>

          {/* Normal */}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {

              setRisk("LOW");

              applyFilters({
                risk: "LOW",
              });

            }}
            className="
              rounded-full
              bg-emerald-100
              px-5
              py-3
              text-sm
              font-semibold
              text-emerald-700
              transition
              hover:bg-emerald-200
            "
          >
            🟢 Normal Stations
          </motion.button>

          {/* High Occupancy */}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {

              setOccupancy("HIGH");

              applyFilters({
                occupancy: "HIGH",
              });

            }}
            className="
              rounded-full
              bg-cyan-100
              px-5
              py-3
              text-sm
              font-semibold
              text-cyan-700
              transition
              hover:bg-cyan-200
            "
          >
            📊 80%+ Occupancy
          </motion.button>

          {/* Risk Ranking */}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {

              setSortBy("RISK");

              applyFilters({
                sortBy: "RISK",
              });

            }}
            className="
              rounded-full
              bg-indigo-100
              px-5
              py-3
              text-sm
              font-semibold
              text-indigo-700
              transition
              hover:bg-indigo-200
            "
          >
            🤖 AI Risk Ranking
          </motion.button>

          {/* Passenger Ranking */}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {

              setSortBy("PASSENGERS");

              applyFilters({
                sortBy: "PASSENGERS",
              });

            }}
            className="
              rounded-full
              bg-violet-100
              px-5
              py-3
              text-sm
              font-semibold
              text-violet-700
              transition
              hover:bg-violet-200
            "
          >
            🚉 Top Passenger Load
          </motion.button>

        </div>

      </div>
            {/* ==========================
          Active Filters Summary
      ========================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
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

        <h3 className="text-xl font-bold text-slate-900">
          Current Filter Configuration
        </h3>

        <div className="mt-5 flex flex-wrap gap-3">

          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
            Search:
            {" "}
            {search || "All Stations"}
          </span>

          <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            Risk:
            {" "}
            {risk}
          </span>

          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            Occupancy:
            {" "}
            {occupancy}
          </span>

          <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
            Sort:
            {" "}
            {sortBy}
          </span>

        </div>

      </motion.div>

      {/* ==========================
          AI Monitoring Guidance
      ========================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        className="
          rounded-3xl
          border
          border-cyan-200
          bg-gradient-to-r
          from-cyan-50
          via-white
          to-blue-50
          p-8
          shadow-sm
        "
      >

        <div className="flex items-start gap-5">

          <div className="rounded-2xl bg-cyan-100 p-4">

            <Filter
              size={34}
              className="text-cyan-700"
            />

          </div>

          <div className="flex-1">

            <h3 className="text-2xl font-bold text-slate-900">
              AI Monitoring Guidance
            </h3>

            <p className="mt-4 leading-8 text-slate-600">

              Use these filters to quickly identify
              congestion hotspots, prioritize high-risk
              stations, and focus operational resources
              where they are most needed. Combining
              occupancy, AI risk level, and passenger
              volume provides the clearest picture of
              current network conditions.

            </p>

            <div className="mt-6 rounded-2xl border border-cyan-200 bg-white p-5">

              <h4 className="font-semibold text-cyan-700">
                Recommended Workflow
              </h4>

              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">

                <li>
                  • Review <strong>High Risk</strong> stations first.
                </li>

                <li>
                  • Monitor stations above <strong>80% occupancy</strong>.
                </li>

                <li>
                  • Sort by <strong>Passenger Load</strong> during peak hours.
                </li>

                <li>
                  • Reset filters to return to the full live network overview.
                </li>

              </ul>

            </div>

          </div>

        </div>

      </motion.div>

    </section>

  );

}

export default MonitoringFilters;
