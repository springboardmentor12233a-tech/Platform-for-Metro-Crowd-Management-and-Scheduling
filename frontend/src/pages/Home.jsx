import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <Navbar />

      <div className="form-container">

        <h1>AI MetroFlow</h1>

        <h2>Platform for Metro Crowd Management and Scheduling</h2>

        <p>
          Predict metro crowd levels using Artificial Intelligence,
          optimize train scheduling, monitor stations,
          and improve passenger management.
        </p>

        <br />

        <Link to="/login">
          <button>Get Started</button>
        </Link>

      </div>

      <Footer />
    </>
  );
}

export default Home;