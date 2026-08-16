import { useEffect, useRef, useState } from "react";

import {
  RefreshCw,
  Brain,
  Users,
  Train,
  Clock,
  Activity,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  CalendarDays,
} from "lucide-react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { getAnalyticsData } from "../services/analyticsService";


// ============================================================
// PREDICTION CARD
// ============================================================

const PredictionCard = ({
  title,
  description,
  count,
  icon: Icon,
  iconClass,
  type,
  filter,
  setFilter,
}) => {

  return (

    <button
      onClick={() => setFilter(type)}
      className={`
        text-left
        bg-slate-800
        border
        rounded-2xl
        p-6
        transition
        hover:border-cyan-500/50
        ${
          filter === type
            ? "border-cyan-500"
            : "border-slate-700"
        }
      `}
    >

      <div className="flex items-start justify-between">

        <div>

          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <p className="text-3xl font-bold text-white mt-2">
            {count.toLocaleString()}
          </p>

          <p className="text-slate-500 text-sm mt-2">
            {description}
          </p>

        </div>

        <div className={`p-3 rounded-xl ${iconClass}`}>
          <Icon size={26} />
        </div>

      </div>

    </button>

  );

};


// ============================================================
// ANALYTICS PAGE
// ============================================================

export default function Analytics() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [analytics, setAnalytics] = useState({

    crowd: [],

    ridership: [],

    frequency: [],

    delay: [],

    schedule: [],

  });


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [filter, setFilter] =
    useState("All");


  const reportRef =
    useRef(null);


  // ==========================================================
  // LOAD ANALYTICS FROM DATABASE
  // ==========================================================

  const loadAnalytics = async () => {

    try {

      setLoading(true);

      setError("");


      console.log(
        "Loading analytics from database..."
      );


      const data =
        await getAnalyticsData();


      console.log(
        "Analytics data from backend:",
        data
      );


      // ======================================================
      // NORMALIZE BACKEND DATA
      // ======================================================

      setAnalytics({

        crowd:
          Array.isArray(data?.crowd)

            ? data.crowd.map(
                (item) => ({
                  ...item,
                  type: "Crowd",
                })
              )

            : [],


        ridership:
          Array.isArray(data?.ridership)

            ? data.ridership.map(
                (item) => ({
                  ...item,
                  type: "Ridership",
                })
              )

            : [],


        frequency:
          Array.isArray(data?.frequency)

            ? data.frequency.map(
                (item) => ({
                  ...item,
                  type: "Frequency",
                })
              )

            : [],


        delay:
          Array.isArray(data?.delay)

            ? data.delay.map(
                (item) => ({
                  ...item,
                  type: "Delay",
                })
              )

            : [],


        schedule:
          Array.isArray(data?.schedule)

            ? data.schedule.map(
                (item) => ({
                  ...item,
                  type: "Schedule",
                })
              )

            : [],

      });


    } catch (err) {

      console.error(
        "Analytics loading failed:",
        err
      );


      setError(

        err?.response?.data?.detail ||

        err?.message ||

        "Failed to load analytics."

      );


      setAnalytics({

        crowd: [],

        ridership: [],

        frequency: [],

        delay: [],

        schedule: [],

      });


    } finally {

      setLoading(false);

    }

  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadAnalytics();

  }, []);


  // ==========================================================
  // DATABASE COUNTS
  // ==========================================================

  const crowdCount =
    analytics.crowd.length;


  const ridershipCount =
    analytics.ridership.length;


  const frequencyCount =
    analytics.frequency.length;


  const delayCount =
    analytics.delay.length;


  const scheduleCount =
    analytics.schedule.length;


  const totalPredictions =

    crowdCount +

    ridershipCount +

    frequencyCount +

    delayCount +

    scheduleCount;


  // ==========================================================
  // ACTIVE RESULTS
  // ==========================================================

  const getActiveResults = () => {

    if (filter === "Crowd") {

      return analytics.crowd;

    }


    if (filter === "Ridership") {

      return analytics.ridership;

    }


    if (filter === "Frequency") {

      return analytics.frequency;

    }


    if (filter === "Delay") {

      return analytics.delay;

    }


    if (filter === "Schedule") {

      return analytics.schedule;

    }


    return [

      ...analytics.crowd,

      ...analytics.ridership,

      ...analytics.frequency,

      ...analytics.delay,

      ...analytics.schedule,

    ];

  };


  const activeResults =
    getActiveResults();


  // ==========================================================
  // PREDICTION VALUE
  // ==========================================================

  const getPredictionValue = (item) => {

    if (!item) {

      return "—";

    }


    // --------------------------------------------------------
    // Crowd
    // --------------------------------------------------------

    if (item.type === "Crowd") {

      return (

        item.predicted_crowd_level ??

        "—"

      );

    }


    // --------------------------------------------------------
    // Ridership
    // --------------------------------------------------------

    if (item.type === "Ridership") {

      return (

        item.prediction ??

        item.predicted_entries ??

        item.predicted_ridership ??

        "—"

      );

    }


    // --------------------------------------------------------
    // Frequency
    // --------------------------------------------------------

    if (item.type === "Frequency") {

      if (
        item.recommended_frequency !==
        undefined
      ) {

        return `${item.recommended_frequency} min`;

      }


      return (

        item.predicted_frequency ??

        "—"

      );

    }


    // --------------------------------------------------------
    // Delay
    // --------------------------------------------------------

    if (item.type === "Delay") {

      if (
        item.predicted_delay_minutes !==
        undefined &&
        item.predicted_delay_minutes !==
        null
      ) {

        return `${item.predicted_delay_minutes} min`;

      }


      if (
        item.predicted_delay !==
        undefined &&
        item.predicted_delay !==
        null
      ) {

        return `${item.predicted_delay} min`;

      }


      return "—";

    }


    // --------------------------------------------------------
    // Schedule
    // --------------------------------------------------------

    if (item.type === "Schedule") {

      return (

        item.schedule_action ??

        item.recommendation ??

        "—"

      );

    }


    return (

      item.prediction ??

      item.predicted_crowd_level ??

      item.predicted_entries ??

      item.predicted_ridership ??

      item.recommended_frequency ??

      item.predicted_delay ??

      "—"

    );

  };


  // ==========================================================
  // STATION
  // ==========================================================

  const getStation = (item) => {

    if (!item) {

      return "—";

    }


    return (

      item.station_name ??

      item.station ??

      item.origin_station ??

      item.destination_station ??

      item.from_station ??

      "—"

    );

  };


  // ==========================================================
  // CONFIDENCE
  // ==========================================================

  const getConfidence = (item) => {

    if (
      item?.confidence_score ===
        undefined ||

      item?.confidence_score ===
        null
    ) {

      return "—";

    }


    const value =
      Number(
        item.confidence_score
      );


    if (
      Number.isNaN(value)
    ) {

      return "—";

    }


    return `${(

      value <= 1

        ? value * 100

        : value

    ).toFixed(1)}%`;

  };


  // ==========================================================
  // STATUS
  // ==========================================================

  const getStatus = (item) => {

    if (!item) {

      return "Completed";

    }


    // Schedule

    if (
      item.type ===
      "Schedule"
    ) {

      if (
        item.reschedule_required ===
        true
      ) {

        return "Reschedule Required";

      }


      return (

        item.schedule_action ??

        item.recommendation ??

        "Completed"

      );

    }


    // Frequency

    if (
      item.type ===
      "Frequency"
    ) {

      return (

        item.priority ??

        item.frequency_action ??

        "Completed"

      );

    }


    // Delay

    if (
      item.type ===
      "Delay"
    ) {

      return (

        item.delay_level ??

        "Completed"

      );

    }


    // Crowd

    if (
      item.type ===
      "Crowd"
    ) {

      return (

        item.predicted_crowd_level ??

        "Completed"

      );

    }


    return (

      item.status ??

      item.recommendation ??

      "Completed"

    );

  };


  // ==========================================================
  // DOWNLOAD JPG
  // ==========================================================

  const downloadJPG = async () => {

    if (!reportRef.current) {

      return;

    }


    try {

      const canvas =
        await html2canvas(
          reportRef.current,
          {
            scale: 2,
            backgroundColor:
              "#0f172a",
            useCORS: true,
          }
        );


      const image =
        canvas.toDataURL(
          "image/jpeg",
          0.95
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        image;


      link.download =
        `metro-analytics-${Date.now()}.jpg`;


      link.click();


    } catch (err) {

      console.error(
        "JPG export failed:",
        err
      );

    }

  };


  // ==========================================================
  // DOWNLOAD PDF
  // ==========================================================

  const downloadPDF = async () => {

    if (!reportRef.current) {

      return;

    }


    try {

      const canvas =
        await html2canvas(
          reportRef.current,
          {
            scale: 2,
            backgroundColor:
              "#0f172a",
            useCORS: true,
          }
        );


      const image =
        canvas.toDataURL(
          "image/png"
        );


      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );


      const pageWidth =
        pdf.internal.pageSize
          .getWidth();


      const pageHeight =
        pdf.internal.pageSize
          .getHeight();


      const imageWidth =
        pageWidth - 20;


      const imageHeight =
        (
          canvas.height *
          imageWidth
        ) /
        canvas.width;


      let heightLeft =
        imageHeight;


      let position = 10;


      pdf.addImage(
        image,
        "PNG",
        10,
        position,
        imageWidth,
        imageHeight
      );


      heightLeft -=
        pageHeight - 20;


      while (
        heightLeft > 0
      ) {

        position =
          heightLeft -
          imageHeight +
          10;


        pdf.addPage();


        pdf.addImage(
          image,
          "PNG",
          10,
          position,
          imageWidth,
          imageHeight
        );


        heightLeft -=
          pageHeight - 20;

      }


      pdf.save(
        `metro-analytics-${Date.now()}.pdf`
      );


    } catch (err) {

      console.error(
        "PDF export failed:",
        err
      );

    }

  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      ref={reportRef}
      className="
        space-y-8
        text-white
        bg-slate-900
        p-1
      "
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>

        <div
          className="
            flex
            items-center
            justify-between
            gap-4
          "
        >

          <div>

            <h1
              className="
                text-4xl
                font-bold
              "
            >

              📊 Analytics & Prediction Center

            </h1>


            <p
              className="
                text-slate-400
                mt-2
              "
            >

              AI-powered metro analytics,
              predictions and operational insights

            </p>

          </div>


          <button
            onClick={
              loadAnalytics
            }
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              bg-cyan-600
              hover:bg-cyan-500
              px-5
              py-3
              rounded-xl
              disabled:opacity-50
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
          ERROR
      ====================================================== */}

      {error && (

        <div
          className="
            bg-red-500/10
            border
            border-red-500/50
            text-red-400
            p-4
            rounded-xl
            flex
            items-center
            gap-3
          "
        >

          <AlertTriangle
            size={20}
          />

          <p>
            {error}
          </p>

        </div>

      )}


      {/* =====================================================
          DATABASE SUMMARY
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-5
          gap-5
        "
      >

        {/* Total */}

        <div
          className="
            bg-slate-800
            border
            border-slate-700
            rounded-2xl
            p-6
          "
        >

          <div
            className="
              flex
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-slate-400
                "
              >

                Total Predictions

              </p>


              <p
                className="
                  text-3xl
                  font-bold
                  mt-2
                "
              >

                {totalPredictions.toLocaleString()}

              </p>

            </div>


            <Brain
              className="
                text-cyan-400
              "
              size={30}
            />

          </div>

        </div>


        {/* Crowd */}

        <div
          className="
            bg-slate-800
            border
            border-slate-700
            rounded-2xl
            p-6
          "
        >

          <div
            className="
              flex
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-slate-400
                "
              >

                Crowd Predictions

              </p>


              <p
                className="
                  text-3xl
                  font-bold
                  mt-2
                "
              >

                {crowdCount}

              </p>

            </div>


            <Users
              className="
                text-purple-400
              "
              size={30}
            />

          </div>

        </div>


        {/* Ridership */}

        <div
          className="
            bg-slate-800
            border
            border-slate-700
            rounded-2xl
            p-6
          "
        >

          <div
            className="
              flex
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-slate-400
                "
              >

                Ridership Predictions

              </p>


              <p
                className="
                  text-3xl
                  font-bold
                  mt-2
                "
              >

                {ridershipCount}

              </p>

            </div>


            <Train
              className="
                text-green-400
              "
              size={30}
            />

          </div>

        </div>


        {/* Frequency */}

        <div
          className="
            bg-slate-800
            border
            border-slate-700
            rounded-2xl
            p-6
          "
        >

          <div
            className="
              flex
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-slate-400
                "
              >

                Frequency Predictions

              </p>


              <p
                className="
                  text-3xl
                  font-bold
                  mt-2
                "
              >

                {frequencyCount}

              </p>

            </div>


            <Activity
              className="
                text-cyan-400
              "
              size={30}
            />

          </div>

        </div>


        {/* Delay */}

        <div
          className="
            bg-slate-800
            border
            border-slate-700
            rounded-2xl
            p-6
          "
        >

          <div
            className="
              flex
              justify-between
            "
          >

            <div>

              <p
                className="
                  text-slate-400
                "
              >

                Delay Predictions

              </p>


              <p
                className="
                  text-3xl
                  font-bold
                  mt-2
                "
              >

                {delayCount}

              </p>

            </div>


            <Clock
              className="
                text-orange-400
              "
              size={30}
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          PREDICTION TYPE CARDS
      ====================================================== */}

      <div>

        <h2
          className="
            text-xl
            font-semibold
            mb-4
          "
        >

          Prediction Results

        </h2>


        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-5
            gap-4
          "
        >

          <PredictionCard
            title="Crowd"
            description="Station crowd prediction"
            count={crowdCount}
            icon={Users}
            iconClass="
              bg-purple-500/10
              text-purple-400
            "
            type="Crowd"
            filter={filter}
            setFilter={setFilter}
          />


          <PredictionCard
            title="Ridership"
            description="Passenger demand"
            count={ridershipCount}
            icon={Train}
            iconClass="
              bg-green-500/10
              text-green-400
            "
            type="Ridership"
            filter={filter}
            setFilter={setFilter}
          />


          <PredictionCard
            title="Frequency"
            description="Train frequency optimization"
            count={frequencyCount}
            icon={Activity}
            iconClass="
              bg-cyan-500/10
              text-cyan-400
            "
            type="Frequency"
            filter={filter}
            setFilter={setFilter}
          />


          <PredictionCard
            title="Delay"
            description="Delay prediction"
            count={delayCount}
            icon={Clock}
            iconClass="
              bg-orange-500/10
              text-orange-400
            "
            type="Delay"
            filter={filter}
            setFilter={setFilter}
          />


          <PredictionCard
            title="Schedule"
            description="Train schedule optimization"
            count={scheduleCount}
            icon={CalendarDays}
            iconClass="
              bg-pink-500/10
              text-pink-400
            "
            type="Schedule"
            filter={filter}
            setFilter={setFilter}
          />

        </div>

      </div>


      {/* =====================================================
          FILTER
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          flex-wrap
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-semibold
            "
          >

            Prediction Report

          </h2>


          <p
            className="
              text-slate-400
              text-sm
              mt-1
            "
          >

            {filter === "All"
              ? "All prediction results from PostgreSQL"
              : `${filter} prediction results from PostgreSQL`}

          </p>

        </div>


        <select
          value={filter}
          onChange={(e) =>
            setFilter(
              e.target.value
            )
          }
          className="
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            text-white
          "
        >

          <option value="All">
            All Predictions
          </option>

          <option value="Crowd">
            Crowd
          </option>

          <option value="Ridership">
            Ridership
          </option>

          <option value="Frequency">
            Frequency
          </option>

          <option value="Delay">
            Delay
          </option>

          <option value="Schedule">
            Schedule
          </option>

        </select>

      </div>


      {/* =====================================================
          LOADING
      ====================================================== */}

      {loading && (

        <div
          className="
            flex
            justify-center
            items-center
            h-48
          "
        >

          <RefreshCw
            size={35}
            className="
              animate-spin
              text-cyan-400
            "
          />

        </div>

      )}


      {/* =====================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        activeResults.length === 0 && (

          <div
            className="
              bg-slate-800
              border
              border-slate-700
              rounded-2xl
              p-12
              text-center
            "
          >

            <AlertTriangle
              size={45}
              className="
                mx-auto
                text-slate-500
              "
            />


            <h3
              className="
                text-xl
                font-semibold
                mt-4
              "
            >

              No prediction results available

            </h3>


            <p
              className="
                text-slate-400
                mt-2
              "
            >

              Run a prediction from one
              of the prediction modules first.

            </p>

          </div>

        )}


      {/* =====================================================
          DATABASE RESULTS TABLE
      ====================================================== */}

      {!loading &&
        activeResults.length > 0 && (

          <div
            className="
              bg-slate-800
              border
              border-slate-700
              rounded-2xl
              overflow-hidden
            "
          >

            <div
              className="
                overflow-x-auto
              "
            >

              <table
                className="
                  w-full
                  text-left
                "
              >

                <thead
                  className="
                    border-b
                    border-slate-700
                    text-slate-400
                  "
                >

                  <tr>

                    <th className="p-4">
                      Type
                    </th>

                    <th className="p-4">
                      Station
                    </th>

                    <th className="p-4">
                      Prediction
                    </th>

                    <th className="p-4">
                      Confidence
                    </th>

                    <th className="p-4">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {activeResults
                    .slice(0, 100)
                    .map(
                      (
                        item,
                        index
                      ) => (

                        <tr
                          key={
                            item.id ||
                            item.prediction_id ||
                            `${item.type}-${index}`
                          }
                          className="
                            border-b
                            border-slate-700
                            last:border-0
                          "
                        >

                          <td
                            className="
                              p-4
                              text-cyan-400
                              font-medium
                            "
                          >

                            {item.type}

                          </td>


                          <td
                            className="
                              p-4
                              text-white
                            "
                          >

                            {getStation(
                              item
                            )}

                          </td>


                          <td
                            className="
                              p-4
                              text-white
                              font-semibold
                            "
                          >

                            {getPredictionValue(
                              item
                            )}

                          </td>


                          <td
                            className="
                              p-4
                              text-slate-300
                            "
                          >

                            {getConfidence(
                              item
                            )}

                          </td>


                          <td
                            className="
                              p-4
                            "
                          >

                            <span
                              className="
                                inline-flex
                                items-center
                                gap-2
                                text-green-400
                              "
                            >

                              <span
                                className="
                                  w-2
                                  h-2
                                  rounded-full
                                  bg-green-400
                                "
                              />

                              {getStatus(
                                item
                              )}

                            </span>

                          </td>

                        </tr>

                      )
                    )}

                </tbody>

              </table>

            </div>

          </div>

        )}


      {/* =====================================================
          DOWNLOAD REPORT
      ====================================================== */}

      <div
        className="
          bg-slate-800
          border
          border-slate-700
          rounded-2xl
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            justify-between
            gap-5
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
              "
            >

              Export Analytics Report

            </h2>


            <p
              className="
                text-slate-400
                text-sm
                mt-1
              "
            >

              Download the prediction
              analytics retrieved from PostgreSQL.

            </p>

          </div>


          <div
            className="
              flex
              gap-3
              flex-wrap
            "
          >

            <button
              onClick={
                downloadPDF
              }
              className="
                flex
                items-center
                gap-2
                bg-cyan-600
                hover:bg-cyan-500
                px-5
                py-3
                rounded-xl
                text-white
              "
            >

              <FileText
                size={18}
              />

              Download PDF

            </button>


            <button
              onClick={
                downloadJPG
              }
              className="
                flex
                items-center
                gap-2
                bg-purple-600
                hover:bg-purple-500
                px-5
                py-3
                rounded-xl
                text-white
              "
            >

              <ImageIcon
                size={18}
              />

              Download JPG

            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          text-sm
          text-slate-500
          border-t
          border-slate-800
          pt-5
        "
      >

        <span>
          Metro Crowd Management System
        </span>


        <span
          className="
            flex
            items-center
            gap-2
          "
        >

          <span
            className="
              w-2
              h-2
              bg-green-500
              rounded-full
            "
          />

          Analytics Operational

        </span>

      </div>

    </div>

  );

}