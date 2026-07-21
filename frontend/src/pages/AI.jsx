import AIHero from "../components/ai/AIHero";
import AIKPIs from "../components/ai/AIKPIs";
import CongestionPrediction from "../components/ai/CongestionPrediction";
import DemandForecast from "../components/ai/DemandForecast";
import TrainOptimizer from "../components/ai/TrainOptimizer";
import RecommendationCenter from "../components/ai/RecommendationCenter";
import IncidentDetection from "../components/ai/IncidentDetection";
import NetworkSimulation from "../components/ai/NetworkSimulation";

function AI() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl space-y-8 p-6">

        <AIHero />

        <AIKPIs />

        <CongestionPrediction />

        <DemandForecast />

        <TrainOptimizer />

        <RecommendationCenter />

        <IncidentDetection />

        <NetworkSimulation />

      </div>
    </div>
  );
}

export default AI;