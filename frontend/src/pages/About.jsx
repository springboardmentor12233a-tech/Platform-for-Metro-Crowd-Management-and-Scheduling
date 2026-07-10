import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "40px",
          background: "rgba(255,255,255,0.9)",
          minHeight: "100vh",
        }}
      >
        <h1>About AI MetroFlow</h1>

        <p>
          AI MetroFlow is an AI-powered platform that predicts metro crowd
          levels using machine learning to improve scheduling and reduce
          overcrowding.
        </p>

        <h2>Technologies Used</h2>

        <ul>
          <li>Python</li>
          <li>Flask</li>
          <li>React</li>
          <li>Machine Learning</li>
          <li>Scikit-learn</li>
          <li>Pandas</li>
        </ul>
      </div>
    </>
  );
}

export default About;