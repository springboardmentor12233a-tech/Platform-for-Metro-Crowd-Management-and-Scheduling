import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  CalendarDays,
  Train,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import scheduleService from "../services/scheduleService";
import trainStatusService from "../services/trainStatusService";
import stationService from "../services/stationService";

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);

  const [allTrains, setAllTrains] = useState([]);
  const [stations, setStations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [trainFilter, setTrainFilter] = useState("All");
  const [dayFilter, setDayFilter] = useState("All");

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const LIMIT = 100;

  // =========================================================
  // LOAD DATA
  // =========================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const skip = (page - 1) * LIMIT;

      const [
        scheduleResponse,
        trainResponse,
        stationResponse,
      ] = await Promise.all([
        scheduleService.getSchedules(skip, LIMIT),
        trainStatusService.getAllTrains(),
        stationService.getStations(),
      ]);

      // =====================================================
      // SCHEDULES
      // =====================================================

      const scheduleData = scheduleResponse.data;

      let scheduleList = [];

      if (Array.isArray(scheduleData)) {
        scheduleList = scheduleData;

        setTotal(scheduleData.length);
      } else if (
        scheduleData &&
        Array.isArray(scheduleData.schedules)
      ) {
        scheduleList = scheduleData.schedules;

        setTotal(
          Number(
            scheduleData.total ||
              scheduleData.schedules.length
          )
        );
      }

      setSchedules(scheduleList);

      // =====================================================
      // TRAINS
      // =====================================================

      let trainData = trainResponse.data;

      if (
        trainData &&
        Array.isArray(trainData.trains)
      ) {
        trainData = trainData.trains;
      }

      if (!Array.isArray(trainData)) {
        trainData = [];
      }

      setAllTrains(trainData);

      // =====================================================
      // STATIONS
      // =====================================================

      let stationData = stationResponse.data;

      if (
        stationData &&
        Array.isArray(stationData.stations)
      ) {
        stationData = stationData.stations;
      }

      if (!Array.isArray(stationData)) {
        stationData = [];
      }

      setStations(stationData);

      console.log("Schedules:", scheduleList);
      console.log("All trains:", trainData);
      console.log("All stations:", stationData);

    } catch (err) {
      console.error(
        "Failed to load schedule data:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load schedules."
      );

      setSchedules([]);
      setAllTrains([]);
      setStations([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL / PAGE LOAD
  // =========================================================

  useEffect(() => {
    loadData();
  }, [page]);

  // =========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================================

  useEffect(() => {
    setPage(1);
  }, [trainFilter, dayFilter]);

  // =========================================================
  // STATION MAP
  // =========================================================

  const stationMap = useMemo(() => {
    const map = {};

    stations.forEach((station) => {
      if (station?.id !== undefined) {
        map[String(station.id)] =
          station.station_name ||
          station.name ||
          "Unknown Station";
      }
    });

    return map;
  }, [stations]);

  // =========================================================
  // TRAIN MAP
  // =========================================================

  const trainMap = useMemo(() => {
    const map = {};

    allTrains.forEach((train) => {
      if (!train) return;

      const id =
        train.id ??
        train.train_id ??
        train.train_number;

      if (id !== undefined) {
        map[String(id)] = train;
      }

      // Also support train_number lookup
      if (train.train_number) {
        map[String(train.train_number)] = train;
      }
    });

    return map;
  }, [allTrains]);

  // =========================================================
  // GET STATION NAME
  // =========================================================

  const getStationName = (schedule) => {
    if (schedule.station_name) {
      return schedule.station_name;
    }

    if (schedule.station_id !== undefined) {
      return (
        stationMap[String(schedule.station_id)] ||
        `Station #${schedule.station_id}`
      );
    }

    return "Not Assigned";
  };

  // =========================================================
  // GET TRAIN DETAILS
  // =========================================================

  const getTrain = (schedule) => {
    return (
      trainMap[String(schedule.train_id)] ||
      null
    );
  };

  const getTrainDisplayName = (schedule) => {
    const train = getTrain(schedule);

    if (train?.train_number) {
      return train.train_number;
    }

    return schedule.train_id || "N/A";
  };

  const getTrainName = (schedule) => {
    const train = getTrain(schedule);

    return train?.train_name || "";
  };

  // =========================================================
  // FILTERED SCHEDULES
  // =========================================================

  const filteredSchedules = schedules.filter(
    (schedule) => {
      const searchText =
        search.trim().toLowerCase();

      const trainId = String(
        schedule.train_id || ""
      ).toLowerCase();

      const trainNumber =
        getTrainDisplayName(schedule)
          .toLowerCase();

      const trainName =
        getTrainName(schedule)
          .toLowerCase();

      const stationName =
        getStationName(schedule)
          .toLowerCase();

      const scheduleId =
        String(schedule.id || "").toLowerCase();

      const searchMatch =
        !searchText ||
        trainId.includes(searchText) ||
        trainNumber.includes(searchText) ||
        trainName.includes(searchText) ||
        stationName.includes(searchText) ||
        scheduleId.includes(searchText);

      const trainMatch =
        trainFilter === "All" ||
        String(schedule.train_id) ===
          String(trainFilter);

      const dayMatch =
        dayFilter === "All" ||
        String(schedule.day_type || "") ===
          String(dayFilter);

      return (
        searchMatch &&
        trainMatch &&
        dayMatch
      );
    }
  );

  // =========================================================
  // ALL TRAIN OPTIONS
  // =========================================================

  const trainOptions = useMemo(() => {
    return [
      {
        id: "All",
        label: "All Trains",
      },

      ...allTrains
        .map((train) => ({
          id:
            train.id ??
            train.train_id ??
            train.train_number,

          label:
            train.train_number ||
            train.train_id ||
            String(train.id),
        }))
        .filter(
          (train) =>
            train.id !== undefined &&
            train.id !== null
        ),
    ];
  }, [allTrains]);

  // =========================================================
  // DAY OPTIONS
  // =========================================================

  const dayOptions = useMemo(() => {
    const days = [
      ...new Set(
        schedules
          .map((schedule) => schedule.day_type)
          .filter(Boolean)
      ),
    ];

    return ["All", ...days];
  }, [schedules]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(total / LIMIT)
  );

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalStations =
    stations.length;

  const totalTrainCount =
    allTrains.length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold text-white">
              📅 Metro Schedules
            </h1>

            <p className="text-slate-400 mt-2">
              Train schedules and station timings
            </p>

            <div className="flex items-center gap-2 mt-3">

              <span className="w-3 h-3 rounded-full bg-green-500" />

              <span className="text-green-400 font-medium">
                Live Data
              </span>

              <span className="text-slate-500">
                Last Updated:
              </span>

              <span className="text-slate-400">
                {new Date().toLocaleTimeString()}
              </span>

            </div>

          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="
              flex items-center gap-2
              bg-cyan-600
              hover:bg-cyan-500
              disabled:opacity-50
              text-white
              px-5 py-3
              rounded-xl
              transition
            "
          >

            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
      ">

        <SummaryCard
          icon={
            <CalendarDays
              className="text-cyan-400"
              size={28}
            />
          }
          title="Total Schedules"
          value={total.toLocaleString()}
        />

        <SummaryCard
          icon={
            <Train
              className="text-green-400"
              size={28}
            />
          }
          title="Total Trains"
          value={totalTrainCount.toLocaleString()}
        />

        <SummaryCard
          icon={
            <MapPin
              className="text-purple-400"
              size={28}
            />
          }
          title="Total Stations"
          value={totalStations.toLocaleString()}
        />

      </div>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="
        bg-slate-800
        border border-slate-700
        rounded-2xl
        p-5
      ">

        <div className="
          flex
          flex-col
          lg:flex-row
          gap-4
        ">

          {/* SEARCH */}

          <div className="relative flex-1">

            <Search
              size={20}
              className="
                absolute
                left-4
                top-3.5
                text-slate-400
              "
            />

            <input
              type="text"
              placeholder="Search train, station or schedule ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="
                w-full
                pl-11
                pr-4
                py-3
                rounded-xl
                bg-slate-900
                border border-slate-700
                text-white
                placeholder-slate-500
                focus:outline-none
                focus:border-cyan-500
              "
            />

          </div>

          {/* TRAIN FILTER */}

          <select
            value={trainFilter}
            onChange={(e) => {
              setTrainFilter(e.target.value);
              setPage(1);
            }}
            className="
              bg-slate-900
              border border-slate-700
              rounded-xl
              px-4 py-3
              text-white
              min-w-[220px]
            "
          >

            {trainOptions.map((train) => (
              <option
                key={String(train.id)}
                value={String(train.id)}
              >
                {train.label}
              </option>
            ))}

          </select>

          {/* DAY FILTER */}

          <select
            value={dayFilter}
            onChange={(e) => {
              setDayFilter(e.target.value);
              setPage(1);
            }}
            className="
              bg-slate-900
              border border-slate-700
              rounded-xl
              px-4 py-3
              text-white
              min-w-[160px]
            "
          >

            {dayOptions.map((day) => (
              <option
                key={day}
                value={day}
              >
                {day}
              </option>
            ))}

          </select>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="
          bg-red-500/10
          border border-red-500
          text-red-400
          rounded-xl
          p-5
        ">

          <p className="font-semibold">
            Unable to load schedules
          </p>

          <p className="mt-1 text-sm">
            {error}
          </p>

        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="
          flex
          items-center
          justify-center
          h-64
        ">

          <div className="text-center">

            <RefreshCw
              size={35}
              className="
                text-cyan-400
                animate-spin
                mx-auto
              "
            />

            <p className="text-white mt-4">
              Loading schedules...
            </p>

          </div>

        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        filteredSchedules.length === 0 && (

          <div className="
            bg-slate-800
            border border-slate-700
            rounded-2xl
            p-12
            text-center
          ">

            <CalendarDays
              size={50}
              className="
                text-slate-500
                mx-auto
              "
            />

            <h2 className="
              text-xl
              font-bold
              text-white
              mt-4
            ">
              No schedules found
            </h2>

            <p className="
              text-slate-400
              mt-2
            ">
              Try changing your search or filters.
            </p>

          </div>
        )}

      {/* =====================================================
          SCHEDULE CARDS
      ===================================================== */}

      {!loading &&
        filteredSchedules.length > 0 && (

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          ">

            {filteredSchedules.map(
              (schedule) => {

                const train =
                  getTrain(schedule);

                const trainDisplay =
                  getTrainDisplayName(
                    schedule
                  );

                const trainName =
                  getTrainName(schedule);

                const stationName =
                  getStationName(
                    schedule
                  );

                return (

                  <div
                    key={schedule.id}
                    className="
                      bg-slate-800
                      border border-slate-700
                      rounded-2xl
                      p-6
                      hover:border-cyan-500/50
                      transition
                    "
                  >

                    {/* HEADER */}

                    <div className="
                      flex
                      justify-between
                      items-start
                    ">

                      <div>

                        <p className="
                          text-xs
                          text-slate-500
                        ">
                          Schedule ID
                        </p>

                        <h3 className="
                          text-cyan-400
                          font-bold
                          mt-1
                        ">
                          {schedule.id}
                        </h3>

                      </div>

                      <span className="
                        bg-cyan-500/10
                        text-cyan-400
                        px-3 py-1
                        rounded-full
                        text-sm
                      ">
                        {schedule.day_type || "N/A"}
                      </span>

                    </div>

                    {/* TRAIN */}

                    <div className="
                      flex
                      items-center
                      gap-3
                      mt-5
                    ">

                      <Train
                        size={22}
                        className="text-green-400"
                      />

                      <div>

                        <p className="
                          text-xs
                          text-slate-500
                        ">
                          Train
                        </p>

                        <p className="
                          text-white
                          font-semibold
                        ">
                          {trainDisplay}
                        </p>

                        {trainName && (
                          <p className="
                            text-slate-400
                            text-sm
                            mt-1
                          ">
                            {trainName}
                          </p>
                        )}

                      </div>

                    </div>

                    {/* STATION */}

                    <div className="
                      flex
                      items-center
                      gap-3
                      mt-4
                    ">

                      <MapPin
                        size={22}
                        className="text-purple-400"
                      />

                      <div>

                        <p className="
                          text-xs
                          text-slate-500
                        ">
                          Station
                        </p>

                        <p className="
                          text-white
                          font-semibold
                        ">
                          {stationName}
                        </p>

                      </div>

                    </div>

                    {/* TIMING */}

                    <div className="
                      grid
                      grid-cols-2
                      gap-4
                      mt-5
                    ">

                      <TimeCard
                        title="Arrival"
                        time={
                          schedule.arrival_time ||
                          "--:--"
                        }
                        color="cyan"
                      />

                      <TimeCard
                        title="Departure"
                        time={
                          schedule.departure_time ||
                          "--:--"
                        }
                        color="green"
                      />

                    </div>

                    {/* BOTTOM */}

                    <div className="
                      flex
                      justify-between
                      items-center
                      mt-5
                      pt-4
                      border-t border-slate-700
                    ">

                      <div>

                        <span className="
                          text-xs
                          text-slate-500
                        ">
                          Stop Sequence
                        </span>

                        <p className="
                          text-white
                          font-semibold
                        ">
                          #
                          {schedule.stop_sequence ?? "-"}
                        </p>

                      </div>

                      <div>

                        <span className="
                          text-xs
                          text-slate-500
                        ">
                          Platform
                        </span>

                        <p className="
                          text-white
                          font-semibold
                        ">
                          {schedule.platform ?? "-"}
                        </p>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>
        )}

      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {!loading &&
        !error &&
        totalPages > 1 && (

          <div className="
            flex
            items-center
            justify-center
            gap-5
            pb-8
          ">

            <button
              disabled={page === 1}
              onClick={goToPreviousPage}
              className="
                flex
                items-center
                gap-2
                px-4 py-2
                rounded-lg
                bg-slate-800
                border border-slate-700
                text-white
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >

              <ChevronLeft size={18} />

              Previous

            </button>

            <span className="
              text-slate-300
            ">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={goToNextPage}
              className="
                flex
                items-center
                gap-2
                px-4 py-2
                rounded-lg
                bg-slate-800
                border border-slate-700
                text-white
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >

              Next

              <ChevronRight size={18} />

            </button>

          </div>
        )}

    </div>
  );
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="
      bg-slate-800
      border border-slate-700
      rounded-2xl
      p-6
    ">

      <div className="
        flex
        items-center
        gap-4
      ">

        <div className="
          p-3
          rounded-xl
          bg-slate-900
        ">
          {icon}
        </div>

        <div>

          <p className="text-slate-400">
            {title}
          </p>

          <p className="
            text-3xl
            font-bold
            text-white
          ">
            {value}
          </p>

        </div>

      </div>

    </div>
  );
}


// =========================================================
// TIME CARD
// =========================================================

function TimeCard({
  title,
  time,
  color,
}) {
  return (
    <div className="
      bg-slate-900
      rounded-xl
      p-4
    ">

      <div className="
        flex
        items-center
        gap-2
      ">

        <Clock
          size={16}
          className={
            color === "green"
              ? "text-green-400"
              : "text-cyan-400"
          }
        />

        <span className="
          text-xs
          text-slate-400
        ">
          {title}
        </span>

      </div>

      <p className="
        text-xl
        font-bold
        text-white
        mt-2
      ">
        {time}
      </p>

    </div>
  );
}