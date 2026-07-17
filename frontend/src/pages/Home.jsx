import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
function Home() {
  return (
    <>
      <Navbar />

      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <h1>🚇 MetroFlow</h1>

        <h3>AI Metro Crowd Management and Scheduling Platform</h3>

        <p>
          Welcome to MetroFlow. Use the navigation bar to explore the dashboard,
          predictions, scheduling, monitoring, and reports.
        </p>
        <div className="row mt-5">

  <div className="col-md-4">
    <div className="card shadow p-4 text-center">
      <h4>🚆 Train Scheduling</h4>
      <p>Automatic train frequency adjustment based on passenger demand.</p>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card shadow p-4 text-center">
      <h4>🤖 AI Prediction</h4>
      <p>Predict crowd levels using Machine Learning models.</p>
    </div>
  </div>

  <div className="col-md-4">
    <div className="card shadow p-4 text-center">
      <h4>📊 Analytics</h4>
      <p>Traffic reports, forecasting and operational monitoring.</p>
    </div>
  </div>

</div>
      </div>
      <Footer />
    </>
  );
}

export default Home;