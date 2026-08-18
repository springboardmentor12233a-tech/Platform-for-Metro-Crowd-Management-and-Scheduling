import { useEffect, useMemo, useState } from "react";
import { Radio, Search } from "lucide-react";

import Layout from "../../components/layout/Layout";

import {
  getLiveCrowdMonitoring,
  getNetworkSummary,
} from "../../api/dashboardApi";

import useMetro from "../../hooks/useMetro";

import LiveAlertPanel from "../../components/CrowdMonitoring/LiveAlertPanel";
import KPICards from "../../components/CrowdMonitoring/KPICards";
import MetroNetwork from "../../components/CrowdMonitoring/MetroNetwork";
import MetroNetworkMap from "../../components/CrowdMonitoring/MetroNetworkMap";
import AIInsights from "../../components/CrowdMonitoring/AIInsights";
import StationCard from "../../components/CrowdMonitoring/StationCard";


function CrowdMonitoring() {
  const { selectedStation } = useMetro();

  const [stations, setStations] = useState([]);
  const [summary, setSummary] = useState({
    network_health: 100,
    average_occupancy: 0,
    high_risk: 0,
    moderate: 0,
    healthy: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /*
   * =========================================================
   * LOAD DATA
   * =========================================================
   */

  const loadData = async () => {
    try {
      setError("");

      const [liveData, summaryData] = await Promise.all([
        getLiveCrowdMonitoring(),
        getNetworkSummary(),
      ]);

      console.log("LIVE CROWD DATA:", liveData);
      console.log("NETWORK SUMMARY:", summaryData);

      /*
       * Normalize stations
       */

      const rawStations = Array.isArray(liveData)
        ? liveData
        : [];

      const normalizedStations = rawStations.map((station, index) => {
        const stationName =
          station?.station_name ||
          station?.station ||
          station?.name ||
          `Station ${index + 1}`;

        const passengers = Number(
          station?.passengers ??
          station?.total_passengers ??
          0
        );

        let occupancy = Number(
          station?.occupancy ??
          station?.occupancy_percentage ??
          station?.occupancy_percent ??
          0
        );

        /*
         * Prevent invalid values
         */

        if (!Number.isFinite(occupancy)) {
          occupancy = 0;
        }

        occupancy = Math.max(
          0,
          Math.min(100, occupancy)
        );

        /*
         * Determine crowd level
         */

        let crowdLevel =
          station?.crowd_level ||
          station?.crowdLevel ||
          station?.risk_level ||
          "";

        if (!crowdLevel) {
          if (occupancy >= 80) {
            crowdLevel = "Critical";
          } else if (occupancy >= 60) {
            crowdLevel = "Busy";
          } else {
            crowdLevel = "Normal";
          }
        }

        return {
          ...station,

          station: stationName,
          station_name: stationName,
          name: stationName,

          passengers,
          total_passengers: passengers,

          occupancy,

          crowd_level: crowdLevel,
        };
      });

      setStations(normalizedStations);

      /*
       * Normalize summary
       */

      const safeSummary = summaryData || {};

      setSummary({
        network_health:
          Number(
            safeSummary.network_health ??
            safeSummary.networkHealth ??
            100
          ),

        average_occupancy:
          Number(
            safeSummary.average_occupancy ??
            safeSummary.averageOccupancy ??
            0
          ),

        high_risk:
          Number(
            safeSummary.high_risk ??
            safeSummary.highRisk ??
            normalizedStations.filter(
              (s) => s.occupancy >= 80
            ).length
          ),

        moderate:
          Number(
            safeSummary.moderate ??
            normalizedStations.filter(
              (s) =>
                s.occupancy >= 60 &&
                s.occupancy < 80
            ).length
          ),

        healthy:
          Number(
            safeSummary.healthy ??
            normalizedStations.filter(
              (s) => s.occupancy < 60
            ).length
          ),
      });

    } catch (err) {
      console.error(
        "Crowd Monitoring Error:",
        err
      );

      setError(
        "Unable to load the latest crowd monitoring data."
      );

      /*
       * Do not destroy existing data during refresh
       */
    } finally {
      setLoading(false);
    }
  };


  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    loadData();

    const refreshTimer = setInterval(
      loadData,
      30000
    );

    return () => {
      clearInterval(refreshTimer);
    };
  }, []);


  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const filteredStations = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return stations;
    }

    return stations.filter((station) => {
      const name =
        station?.station_name ||
        station?.station ||
        station?.name ||
        "";

      return name
        .toLowerCase()
        .includes(keyword);
    });
  }, [stations, search]);


  /*
   * =========================================================
   * SELECTED STATION
   * =========================================================
   */

  const selectedStationData = useMemo(() => {
    if (!selectedStation) {
      return null;
    }

    const selected = String(
      selectedStation
    ).toLowerCase();

    return (
      stations.find((station) => {
        const name =
          station?.station_name ||
          station?.station ||
          station?.name ||
          "";

        return (
          name.toLowerCase() === selected
        );
      }) || null
    );
  }, [
    stations,
    selectedStation,
  ]);


  /*
   * =========================================================
   * SELECTED STATION FIRST
   * =========================================================
   */

  const orderedStations = useMemo(() => {
    if (!selectedStationData) {
      return filteredStations;
    }

    const selectedName =
      selectedStationData.station_name ||
      selectedStationData.station ||
      selectedStationData.name;

    const remaining =
      filteredStations.filter(
        (station) => {
          const name =
            station?.station_name ||
            station?.station ||
            station?.name ||
            "";

          return (
            name.toLowerCase() !==
            String(selectedName).toLowerCase()
          );
        }
      );

    return [
      selectedStationData,
      ...remaining,
    ];
  }, [
    filteredStations,
    selectedStationData,
  ]);


  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <Layout>
        <div className="
          min-h-[calc(100vh-80px)]
          flex
          items-center
          justify-center
          bg-slate-50
        ">
          <div className="text-center">

            <div className="
              mx-auto
              h-14
              w-14
              rounded-full
              border-4
              border-indigo-200
              border-t-indigo-600
              animate-spin
            " />

            <h2 className="
              mt-6
              text-xl
              font-bold
              text-slate-800
            ">
              Loading Crowd Monitoring...
            </h2>

            <p className="
              mt-2
              text-sm
              text-slate-500
            ">
              Connecting to MetroVision live data
            </p>

          </div>
        </div>
      </Layout>
    );
  }


  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <Layout>

      <div className="
        min-h-screen
        bg-slate-50
        px-4
        py-6
        sm:px-6
        lg:px-8
      ">

        <div className="
          mx-auto
          max-w-[1800px]
        ">

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="
            mb-6
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          ">

            <div>

              <div className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-emerald-600
              ">

                <span className="
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-emerald-500
                  animate-pulse
                " />

                LIVE MONITORING

              </div>

              <h1 className="
                mt-2
                text-3xl
                font-extrabold
                tracking-tight
                text-slate-900
                md:text-4xl
              ">
                MetroVision Crowd Control Center
              </h1>

              <p className="
                mt-1
                text-slate-500
              ">
                AI-powered real-time crowd monitoring dashboard
              </p>

            </div>

            <div className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              bg-emerald-100
              px-5
              py-2.5
              font-semibold
              text-emerald-700
            ">

              <Radio size={16} />

              LIVE

            </div>

          </div>


          {/* =================================================
              ERROR NOTICE
          ================================================= */}

          {error && (
            <div className="
              mb-5
              rounded-xl
              border
              border-yellow-200
              bg-yellow-50
              px-4
              py-3
              text-sm
              text-yellow-800
            ">
              {error} Showing the latest available data.
            </div>
          )}


          {/* =================================================
              ALERT CENTER
          ================================================= */}

          <div className="mb-6">

            <LiveAlertPanel
              stations={stations}
              selectedStation={selectedStation}
            />

          </div>


          {/* =================================================
              KPI CARDS
          ================================================= */}

          <div className="mb-6">

            <KPICards
              stations={stations}
              summary={summary}
              selectedStation={selectedStationData}
            />

          </div>


          {/* =================================================
              NETWORK STATUS + AI OPERATIONS
          ================================================= */}

          <div className="
            mb-6
            grid
            grid-cols-1
            gap-6
            xl:grid-cols-3
          ">

            <div className="xl:col-span-2">

              <MetroNetwork
                stations={stations}
                summary={summary}
                selectedStation={selectedStationData}
              />

            </div>

            <div>

              <AIInsights
                stations={stations}
                summary={summary}
                selectedStation={selectedStationData}
              />

            </div>

          </div>


          {/* =================================================
              METRO MAP
          ================================================= */}

          <div className="
            mb-6
            overflow-hidden
            rounded-3xl
            border
            border-slate-200
            bg-white
            shadow-lg
          ">

            <div className="
              flex
              flex-col
              gap-4
              border-b
              border-slate-200
              p-6
              md:flex-row
              md:items-center
              md:justify-between
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                  text-slate-900
                ">
                  Delhi Metro Live Network
                </h2>

                <p className="
                  mt-1
                  text-sm
                  text-slate-500
                ">
                  AI-powered real-time passenger monitoring
                </p>

              </div>

              <div className="
                flex
                items-center
                gap-4
                text-xs
                font-medium
                text-slate-600
              ">

                <span className="
                  flex
                  items-center
                  gap-1.5
                ">
                  <span className="
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-emerald-500
                  " />
                  Low
                </span>

                <span className="
                  flex
                  items-center
                  gap-1.5
                ">
                  <span className="
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-yellow-400
                  " />
                  Medium
                </span>

                <span className="
                  flex
                  items-center
                  gap-1.5
                ">
                  <span className="
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-red-500
                  " />
                  High
                </span>

              </div>

            </div>

            <div className="
              min-h-[420px]
              w-full
              overflow-hidden
            ">

              <MetroNetworkMap
                stations={stations}
                selectedStation={selectedStation}
              />

            </div>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="
            mb-6
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-lg
          ">

            <div className="relative">

              <Search
                size={19}
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
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search metro station..."
                className="
                  w-full
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-3.5
                  pl-12
                  pr-4
                  text-slate-800
                  outline-none
                  transition
                  focus:border-indigo-400
                  focus:ring-2
                  focus:ring-indigo-100
                "
              />

            </div>

            <div className="
              mt-3
              flex
              flex-col
              gap-2
              text-xs
              text-slate-500
              sm:flex-row
              sm:items-center
              sm:justify-between
            ">

              <span>
                Showing{" "}
                <strong className="text-slate-800">
                  {orderedStations.length}
                </strong>{" "}
                stations
              </span>

              <span>
                Auto Refresh:{" "}
                <strong className="text-indigo-600">
                  30 sec
                </strong>
              </span>

            </div>

          </div>


          {/* =================================================
              LIVE STATION MONITORING
          ================================================= */}

          <section className="mb-6">

            <div className="
              mb-5
              flex
              flex-col
              gap-2
              md:flex-row
              md:items-end
              md:justify-between
            ">

              <div>

                <h2 className="
                  text-2xl
                  font-bold
                  text-slate-900
                ">
                  Live Station Monitoring
                </h2>

                <p className="
                  mt-1
                  text-sm
                  text-slate-500
                ">
                  AI-powered monitoring with crowd prediction and operational recommendations
                </p>

              </div>

              <div className="
                text-sm
                font-medium
                text-slate-500
              ">
                {orderedStations.length} active stations
              </div>

            </div>


            {orderedStations.length === 0 ? (

              <div className="
                rounded-3xl
                border
                border-dashed
                border-slate-300
                bg-white
                p-12
                text-center
              ">

                <h3 className="
                  text-xl
                  font-bold
                  text-slate-800
                ">
                  No stations found
                </h3>

                <p className="
                  mt-2
                  text-slate-500
                ">
                  Try another station name.
                </p>

              </div>

            ) : (

              <div className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              ">

                {orderedStations.map(
                  (station, index) => (

                    <StationCard
                      key={
                        station.station ||
                        station.station_name ||
                        index
                      }
                      station={station}
                    />

                  )
                )}

              </div>

            )}

          </section>


          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="
            rounded-3xl
            bg-slate-950
            p-6
            text-white
            shadow-xl
          ">

            <div className="
              flex
              flex-col
              gap-4
              md:flex-row
              md:items-center
              md:justify-between
            ">

              <div>

                <h3 className="
                  font-bold
                ">
                  MetroVision Crowd Monitoring
                </h3>

                <p className="
                  mt-1
                  text-sm
                  text-slate-400
                ">
                  Real-time AI-powered metro crowd intelligence
                </p>

              </div>

              <div className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-emerald-400
              ">

                <span className="
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-emerald-400
                  animate-pulse
                " />

                AI Monitoring Active

              </div>

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

export default CrowdMonitoring;