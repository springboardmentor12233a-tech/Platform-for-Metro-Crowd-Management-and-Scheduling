import { useEffect, useState } from "react";
import "./CrowdPrediction.css";

function CrowdPrediction() {

  // =========================================
  // STATIONS
  // =========================================

  const [stations, setStations] = useState([]);
  const [stationsLoading, setStationsLoading] = useState(true);


  // =========================================
  // FORM STATE
  // =========================================

  const [station, setStation] = useState("");
  const [date, setDate] = useState("2026-01-01");
  const [time, setTime] = useState("08:15");
  const [weather, setWeather] = useState("Sunny");


  // =========================================
  // OPERATIONAL RESULT STATE
  // =========================================

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);


  // =========================================
  // AI FORECAST STATE
  // =========================================

  const [aiForecast, setAiForecast] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);


  // =========================================
  // ERROR STATE
  // =========================================

  const [error, setError] = useState("");


  // =========================================
  // LOAD REAL METRO STATIONS
  // =========================================

  useEffect(() => {

    async function loadStations() {

      try {

        setStationsLoading(true);
        setError("");

        const response = await fetch(
          "http://127.0.0.1:8000/crowd-stations"
        );

        const data = await response.json();

        if (!response.ok || !data.success) {

          throw new Error(
            data.message ||
              "Unable to load metro stations."
          );
        }

        setStations(data.stations);

        // Select first station automatically
        if (data.stations.length > 0) {

          setStation(
            data.stations[0]
          );
        }

      } catch (err) {

        console.error(
          "Station loading error:",
          err
        );

        setError(
          err.message ||
            "Unable to connect to the MetroFlow backend."
        );

      } finally {

        setStationsLoading(false);
      }
    }

    loadStations();

  }, []);


  // =========================================
  // RUN OPERATIONAL CROWD ANALYSIS
  // =========================================

  const checkCrowd = async () => {

    try {

      setLoading(true);
      setError("");
      setResult(null);

      // -----------------------------------------
      // VALIDATION
      // -----------------------------------------

      if (!station) {

        setError(
          "Please select a station."
        );

        return;
      }

      if (!date) {

        setError(
          "Please select a date."
        );

        return;
      }

      if (!time) {

        setError(
          "Please select a time."
        );

        return;
      }


      // -----------------------------------------
      // BACKEND REQUEST
      // -----------------------------------------

      const url =
        "http://127.0.0.1:8000/crowd-prediction" +
        `?station=${encodeURIComponent(station)}` +
        `&date=${encodeURIComponent(date)}` +
        `&time=${encodeURIComponent(time)}`;

      const response = await fetch(url);

      const data = await response.json();


      // -----------------------------------------
      // BACKEND ERROR
      // -----------------------------------------

      if (!response.ok) {

        if (data.detail) {

          throw new Error(
            typeof data.detail === "string"
              ? data.detail
              : "Unable to retrieve crowd data."
          );
        }

        throw new Error(
          "Unable to retrieve crowd data."
        );
      }


      // -----------------------------------------
      // APPLICATION ERROR
      // -----------------------------------------

      if (data.success === false) {

        throw new Error(
          data.message ||
            "No crowd data found for this selection."
        );
      }


      // -----------------------------------------
      // SAVE TO PREDICTION HISTORY
      // -----------------------------------------

      const existingHistory = JSON.parse(
        localStorage.getItem(
          "predictionHistory"
        ) || "[]"
      );


      const historyEntry = {

        id: Date.now(),

        type: "operational",

        station:
          data.station,

        date:
          data.date,

        time:
          data.time,

        matched_time:
          data.matched_time,

        passenger_count:
          data.passenger_count,

        passenger_entries:
          data.passenger_entries,

        passenger_exits:
          data.passenger_exits,

        occupancy_percent:
          data.occupancy_percent,

        crowd_level:
          data.crowd_level,

        peak_hour:
          data.peak_hour,

        congestion_level:
          data.congestion_level,

        number_of_trips:
          data.number_of_trips,

        delay_minutes:
          data.delay_minutes,

        train_frequency_per_hour:
          data.train_frequency_per_hour,

        train_speed_kmph:
          data.train_speed_kmph,

        weather:
          data.weather,

        day:
          data.day,

        is_holiday:
          data.is_holiday,

        ai_recommendation:
          data.ai_recommendation
      };


      const updatedHistory = [

        historyEntry,

        ...existingHistory

      ].slice(0, 50);


      localStorage.setItem(
        "predictionHistory",
        JSON.stringify(
          updatedHistory
        )
      );


      // -----------------------------------------
      // DISPLAY RESULT
      // -----------------------------------------

      setResult(data);

    } catch (err) {

      console.error(
        "Crowd prediction error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to the MetroFlow backend."
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================================
  // RUN AI CROWD FORECAST
  // =========================================

  const runAIForecast = async () => {

    try {

      setAiLoading(true);
      setError("");
      setAiForecast(null);


      // -----------------------------------------
      // VALIDATION
      // -----------------------------------------

      if (!station) {

        setError(
          "Please select a station."
        );

        return;
      }

      if (!date) {

        setError(
          "Please select a date."
        );

        return;
      }

      if (!time) {

        setError(
          "Please select a time."
        );

        return;
      }


      // -----------------------------------------
      // AI MODEL REQUEST
      // -----------------------------------------

      const url =
        "http://127.0.0.1:8000/ai-crowd-forecast" +
        `?station=${encodeURIComponent(station)}` +
        `&date=${encodeURIComponent(date)}` +
        `&time=${encodeURIComponent(time)}` +
        `&weather=${encodeURIComponent(weather)}`;


      const response = await fetch(url);

      const data = await response.json();


      // -----------------------------------------
      // BACKEND ERROR
      // -----------------------------------------

      if (!response.ok) {

        if (data.detail) {

          throw new Error(
            typeof data.detail === "string"
              ? data.detail
              : "Unable to generate AI forecast."
          );
        }

        throw new Error(
          "Unable to generate AI forecast."
        );
      }


      // -----------------------------------------
      // APPLICATION ERROR
      // -----------------------------------------

      if (data.success === false) {

        throw new Error(
          data.message ||
            "AI crowd forecast failed."
        );
      }


      // -----------------------------------------
      // SAVE AI FORECAST HISTORY
      // -----------------------------------------

      const existingAIHistory =
        JSON.parse(
          localStorage.getItem(
            "aiForecastHistory"
          ) || "[]"
        );


      const aiHistoryEntry = {

        id: Date.now(),

        type: "ai_forecast",

        station:
          data.station,

        date:
          data.date,

        time:
          data.time,

        weather:
          data.weather,

        predicted_passengers:
          data.predicted_passengers,

        estimated_occupancy_percent:
          data.estimated_occupancy_percent,

        crowd_level:
          data.crowd_level,

        risk_level:
          data.risk_level,

        peak_period:
          data.peak_period,

        ai_recommendation:
          data.ai_recommendation
      };


      const updatedAIHistory = [

        aiHistoryEntry,

        ...existingAIHistory

      ].slice(0, 50);


      localStorage.setItem(
        "aiForecastHistory",
        JSON.stringify(
          updatedAIHistory
        )
      );


      // -----------------------------------------
      // DISPLAY AI FORECAST
      // -----------------------------------------

      setAiForecast(data);

    } catch (err) {

      console.error(
        "AI forecast error:",
        err
      );

      setError(
        err.message ||
          "Unable to generate AI forecast."
      );

    } finally {

      setAiLoading(false);
    }
  };


  // =========================================
  // CROWD STATUS CSS CLASS
  // =========================================

  const getCrowdClass = () => {

    if (!result) {
      return "";
    }

    const level =
      result.crowd_level?.toLowerCase();


    if (level === "high") {
      return "crowd-high";
    }


    if (level === "medium") {
      return "crowd-medium";
    }


    return "crowd-low";
  };


  // =========================================
  // AI RISK CSS CLASS
  // =========================================

  const getAIRiskClass = () => {

    if (!aiForecast) {
      return "";
    }

    const risk =
      aiForecast.risk_level?.toLowerCase();


    if (risk === "high") {
      return "risk-high";
    }


    if (risk === "moderate") {
      return "risk-medium";
    }


    return "risk-low";
  };


  // =========================================
  // PAGE
  // =========================================

  return (

    <div className="crowd-prediction">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="crowd-section-header">

        <div>

          <h2>
            MetroFlow AI Prediction
          </h2>

          <p>
            Analyze passenger crowd and train
            operational conditions using
            AI-powered metro data.
          </p>

        </div>

        <div className="ai-intelligence-badge">
          AI Intelligence
        </div>

      </div>


      {/* =====================================
          FORM
      ===================================== */}

      <div className="crowd-form">


        {/* STATION */}

        <div className="form-group">

          <label>
            Station
          </label>

          <select
            value={station}
            onChange={(e) =>
              setStation(e.target.value)
            }
            disabled={stationsLoading}
          >

            {stationsLoading ? (

              <option value="">
                Loading stations...
              </option>

            ) : (

              <>

                <option value="">
                  Select a station
                </option>


                {stations.map(
                  (stationName) => (

                    <option
                      key={stationName}
                      value={stationName}
                    >
                      {stationName}
                    </option>

                  )
                )}

              </>

            )}

          </select>

        </div>


        {/* DATE */}

        <div className="form-group">

          <label>
            Date
          </label>

          <input
            type="date"
            value={date}
            min="2026-01-01"
            max="2026-02-22"
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

        </div>


        {/* TIME */}

        <div className="form-group">

          <label>
            Time
          </label>

          <input
            type="time"
            value={time}
            step="900"
            onChange={(e) =>
              setTime(e.target.value)
            }
          />

        </div>


        {/* WEATHER */}

        <div className="form-group">

          <label>
            Weather
          </label>

          <select
            value={weather}
            onChange={(e) =>
              setWeather(e.target.value)
            }
          >

            <option value="Sunny">
              Sunny
            </option>

            <option value="Cloudy">
              Cloudy
            </option>

            <option value="Rainy">
              Rainy
            </option>

          </select>

        </div>


        {/* OPERATIONAL ANALYSIS BUTTON */}

        <button
          type="button"
          className="crowd-analysis-button"
          onClick={checkCrowd}
          disabled={
            loading ||
            stationsLoading ||
            !station
          }
        >

          {loading
            ? "Analyzing..."
            : "Check Crowd"}

        </button>


        {/* AI FORECAST BUTTON */}

        <button
          type="button"
          className="ai-forecast-button"
          onClick={runAIForecast}
          disabled={
            aiLoading ||
            stationsLoading ||
            !station
          }
        >

          {aiLoading
            ? "AI Forecasting..."
            : "Run AI Forecast"}

        </button>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (

        <div className="crowd-error">

          <strong>
            Error:
          </strong>{" "}

          {error}

        </div>

      )}


      {/* =====================================
          OPERATIONAL RESULTS
      ===================================== */}

      {result && (

        <div className="crowd-results">


          {/* =================================
              ANALYSIS HEADER
          ================================= */}

          <div className="result-header">

            <div>

              <span className="analysis-label">
                OPERATIONAL ANALYSIS
              </span>

              <h3>
                {result.station}
              </h3>

              <p>
                {result.date}
                {" • "}
                {result.time}
              </p>


              {result.matched_time &&
                result.matched_time !==
                  result.time && (

                <small className="matched-time">

                  Dataset record matched at{" "}
                  {result.matched_time}

                </small>

              )}

            </div>


            <div
              className={`crowd-status ${getCrowdClass()}`}
            >
              {result.crowd_level}
            </div>

          </div>


          {/* =================================
              PASSENGER INTELLIGENCE
          ================================= */}

          <div className="intelligence-section">

            <div className="intelligence-header">

              <div className="intelligence-icon">
                👥
              </div>

              <div>

                <h3>
                  Passenger Intelligence
                </h3>

                <p>
                  Passenger demand and crowd
                  analysis from operational data
                </p>

              </div>

            </div>


            <div className="crowd-kpis">


              {/* PASSENGER COUNT */}

              <div className="crowd-kpi">

                <span>
                  Passenger Count
                </span>

                <strong>
                  {result.passenger_count}
                </strong>

              </div>


              {/* PASSENGER ENTRIES */}

              <div className="crowd-kpi">

                <span>
                  Passenger Entries
                </span>

                <strong>
                  {result.passenger_entries}
                </strong>

              </div>


              {/* PASSENGER EXITS */}

              <div className="crowd-kpi">

                <span>
                  Passenger Exits
                </span>

                <strong>
                  {result.passenger_exits}
                </strong>

              </div>


              {/* OCCUPANCY */}

              <div className="crowd-kpi">

                <span>
                  Occupancy
                </span>

                <strong>
                  {result.occupancy_percent}%
                </strong>

              </div>


              {/* CROWD LEVEL */}

              <div className="crowd-kpi">

                <span>
                  Crowd Level
                </span>

                <strong>
                  {result.crowd_level}
                </strong>

              </div>


              {/* PEAK HOUR */}

              <div className="crowd-kpi">

                <span>
                  Peak Hour
                </span>

                <strong>
                  {result.peak_hour
                    ? "Yes"
                    : "No"}
                </strong>

              </div>

            </div>


            {/* CONGESTION */}

            <div className="crowd-details">

              <div>

                <span>
                  Congestion
                </span>

                <strong>
                  {result.congestion_level}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================
              TRAIN INTELLIGENCE
          ================================= */}

          <div className="intelligence-section train-section">

            <div className="intelligence-header">

              <div className="intelligence-icon">
                🚆
              </div>

              <div>

                <h3>
                  Train Intelligence
                </h3>

                <p>
                  Operational train performance
                  for the selected period
                </p>

              </div>

            </div>


            <div className="crowd-kpis">


              {/* NUMBER OF TRIPS */}

              <div className="crowd-kpi">

                <span>
                  Number of Trips
                </span>

                <strong>
                  {result.number_of_trips}
                </strong>

              </div>


              {/* FREQUENCY */}

              <div className="crowd-kpi">

                <span>
                  Frequency
                </span>

                <strong>
                  {result.train_frequency_per_hour}
                </strong>

                <small>
                  trains/hour
                </small>

              </div>


              {/* SPEED */}

              <div className="crowd-kpi">

                <span>
                  Train Speed
                </span>

                <strong>
                  {result.train_speed_kmph}
                </strong>

                <small>
                  km/h
                </small>

              </div>


              {/* DELAY */}

              <div className="crowd-kpi">

                <span>
                  Delay
                </span>

                <strong>
                  {result.delay_minutes}
                </strong>

                <small>
                  min
                </small>

              </div>


              {/* CONGESTION */}

              <div className="crowd-kpi">

                <span>
                  Congestion
                </span>

                <strong>
                  {result.congestion_level}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================
              OPERATIONAL CONTEXT
          ================================= */}

          <div className="intelligence-section">

            <div className="intelligence-header">

              <div className="intelligence-icon">
                🌦️
              </div>

              <div>

                <h3>
                  Operational Context
                </h3>

                <p>
                  Environmental and schedule
                  information
                </p>

              </div>

            </div>


            <div className="crowd-kpis">


              {/* WEATHER */}

              <div className="crowd-kpi">

                <span>
                  Weather
                </span>

                <strong>
                  {result.weather}
                </strong>

              </div>


              {/* DAY */}

              <div className="crowd-kpi">

                <span>
                  Day
                </span>

                <strong>
                  {result.day}
                </strong>

              </div>


              {/* HOLIDAY */}

              <div className="crowd-kpi">

                <span>
                  Holiday
                </span>

                <strong>
                  {result.is_holiday
                    ? "Yes"
                    : "No"}
                </strong>

              </div>


              {/* MATCHED TIME */}

              <div className="crowd-kpi">

                <span>
                  Dataset Time
                </span>

                <strong>
                  {result.matched_time}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================
              EXISTING AI RECOMMENDATION
          ================================= */}

          <div className="ai-recommendation">

            <div>

              <span>
                🤖 AI Recommendation
              </span>

              <strong>
                {result.ai_recommendation}
              </strong>

              <p>
                Recommendation generated from
                the selected operational conditions.
              </p>

            </div>

            <div className="ai-badge">
              AI
            </div>

          </div>

        </div>

      )}


      {/* =====================================
          AI FORECAST RESULT
      ===================================== */}

      {aiForecast && (

        <div className="ai-forecast-card">


          {/* =================================
              AI FORECAST HEADER
          ================================= */}

          <div className="ai-forecast-header">

            <div>

              <span className="forecast-label">
                MACHINE LEARNING FORECAST
              </span>

              <h3>
                🤖 AI Passenger Demand Forecast
              </h3>

              <p>
                Random Forest model-generated
                passenger demand forecast.
              </p>

            </div>


            <div
              className={`ai-risk-badge ${getAIRiskClass()}`}
            >
              {aiForecast.risk_level} Risk
            </div>

          </div>


          {/* =================================
              AI KPI CARDS
          ================================= */}

          <div className="ai-forecast-kpis">


            {/* PREDICTED PASSENGERS */}

            <div className="ai-forecast-kpi">

              <span>
                Predicted Passengers
              </span>

              <strong>
                {Number(
                  aiForecast.predicted_passengers
                ).toLocaleString()}
              </strong>

              <small>
                ML-generated forecast
              </small>

            </div>


            {/* ESTIMATED OCCUPANCY */}

            <div className="ai-forecast-kpi">

              <span>
                Estimated Occupancy
              </span>

              <strong>
                {aiForecast.estimated_occupancy_percent}%
              </strong>

              <small>
                Derived from forecast
              </small>

            </div>


            {/* CROWD LEVEL */}

            <div className="ai-forecast-kpi">

              <span>
                Forecast Crowd Level
              </span>

              <strong>
                {aiForecast.crowd_level}
              </strong>

              <small>
                AI classification
              </small>

            </div>


            {/* PEAK PERIOD */}

            <div className="ai-forecast-kpi">

              <span>
                Peak Period
              </span>

              <strong>
                {aiForecast.peak_period
                  ? "Yes"
                  : "No"}
              </strong>

              <small>
                Time-based indicator
              </small>

            </div>

          </div>


          {/* =================================
              AI FORECAST DETAILS
          ================================= */}

          <div className="ai-forecast-details">


            {/* STATION */}

            <div>

              <span>
                Station
              </span>

              <strong>
                {aiForecast.station}
              </strong>

            </div>


            {/* DATE AND TIME */}

            <div>

              <span>
                Forecast Time
              </span>

              <strong>
                {aiForecast.date}
                {" • "}
                {aiForecast.time}
              </strong>

            </div>


            {/* WEATHER */}

            <div>

              <span>
                Weather Input
              </span>

              <strong>
                {aiForecast.weather}
              </strong>

            </div>

          </div>


          {/* =================================
              AI RECOMMENDATION
          ================================= */}

          <div className="ai-forecast-recommendation">

            <div>

              <span>
                💡 AI Operational Recommendation
              </span>

              <strong>
                {aiForecast.ai_recommendation}
              </strong>

            </div>

          </div>


          {/* =================================
              MODEL NOTE
          ================================= */}

          <div className="ai-model-note">

            <span>
              ℹ️ Forecast Interpretation
            </span>

            <p>
              Passenger demand is generated by
              the trained Random Forest model.
              Estimated occupancy is derived from
              the predicted passenger count and
              should be interpreted as an operational
              estimate rather than a directly predicted
              occupancy value.
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default CrowdPrediction;