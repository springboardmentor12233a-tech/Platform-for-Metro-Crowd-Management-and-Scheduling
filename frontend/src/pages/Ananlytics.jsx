import MainLayout from "../layouts/MainLayout";

import CrowdTrendCard from "../components/analytics/CrowdTrendCard";
import CrowdDistributionCard from "../components/analytics/CrowdDistributionCard";

import "../styles/Analytics.css";


function Analytics(){

  return(

    <MainLayout>

      <div className="analytics-page">

        <h1>
          Analytics Dashboard
        </h1>

        <div className="analytics-grid">

          <CrowdTrendCard />

          <CrowdDistributionCard />

        </div>

      </div>

    </MainLayout>

  );

}

export default Analytics;