import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import LatestPredictionCard from "../components/LatestPredictionCard";
import AlertSection from "../components/AlertSection";
import RecommendationCard from "../components/RecommendationCard";
import InsightCards from "../components/InsightCards";
import HeatmapSection from "../components/HeatmapSection";
import PredictionTable from "../components/PredictionTable";

import "../styles/Dashboard.css";


function Dashboard() {

  const [dashboardData, setDashboardData] = useState(null);
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [insightsData, setInsightsData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {


    // Dashboard frontend data
    fetch("http://127.0.0.1:8000/dashboard/dashboard/frontend")

      .then((response) => response.json())

      .then((data) => {

        setDashboardData(data);

      })

      .catch((error) => {

        console.error("Dashboard Error:", error);

      });



    // Latest Prediction
    fetch("http://127.0.0.1:8000/dashboard/latest")

      .then((response) => response.json())

      .then((data) => {

        setLatestPrediction(data);

      })

      .catch((error) => {

        console.error("Latest Prediction Error:", error);

      });



    // Prediction History
    fetch("http://127.0.0.1:8000/dashboard/history")

      .then((response) => response.json())

      .then((data) => {

        setPredictionHistory(data);

      })

      .catch((error) => {

        console.error("History Error:", error);

      });



    // Insights
    fetch("http://127.0.0.1:8000/insights")

      .then((response) => response.json())

      .then((data) => {

        setInsightsData(data);

      })

      .catch((error) => {

        console.error("Insights Error:", error);

      });



    // Heatmap
    fetch("http://127.0.0.1:8000/heatmap")

      .then((response) => response.json())

      .then((data) => {

        setHeatmapData(data);

      })

      .catch((error) => {

        console.error("Heatmap Error:", error);

      });



    setLoading(false);


  }, []);



  if (loading) {

    return (
      <MainLayout>
        <h2>Loading Dashboard...</h2>
      </MainLayout>
    );

  }



  return (

    <MainLayout>

      <div className="dashboard">


        <LatestPredictionCard
          prediction={latestPrediction}
        />


        <AlertSection
          alert={dashboardData?.latest_alert}
          announcement={dashboardData?.latest_announcement}
        />


        <RecommendationCard
          recommendation={dashboardData?.latest_ai_recommendation}
        />


        <InsightCards
          insights={insightsData}
        />


        <HeatmapSection
          heatmapData={heatmapData}
        />


        <PredictionTable
          predictions={predictionHistory}
        />


      </div>

    </MainLayout>

  );

}


export default Dashboard;