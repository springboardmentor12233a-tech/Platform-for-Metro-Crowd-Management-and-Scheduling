import Navbar from "../components/Navbar";

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
      </div>
    </>
  );
}

export default Home;