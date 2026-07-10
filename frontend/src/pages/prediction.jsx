import Navbar from "../components/Navbar";
import PredictionForm from "../components/PredictionForm";

function Prediction() {
  return (
    <>
      <Navbar />

      <div className="form-container">
        <PredictionForm />
      </div>
    </>
  );
}

export default Prediction;