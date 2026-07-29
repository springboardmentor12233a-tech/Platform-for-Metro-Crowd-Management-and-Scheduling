import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaSyncAlt,
  FaServer,
  FaRobot,
  FaDatabase,
  FaHistory,
  FaChartPie
} from "react-icons/fa";

function Testing() {

  const [report, setReport] = useState(null);

  const loadTests = () => {

    api.get("/system-test")
      .then((res) => {

        setReport(res.data);

      })
      .catch(console.log);

  };

  useEffect(() => {

    loadTests();

  }, []);

  if (!report) {

    return (

      <>

        <Navbar />

        <div className="container text-center mt-5">

          <div className="spinner-border text-primary"></div>

          <h3 className="mt-3">

            Running System Tests...

          </h3>

        </div>

        <Footer />

      </>

    );

  }

  const successRate =
    Math.round((report.Passed / report.Total) * 100);
      return (

    <>

      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center fw-bold">

          🧪 MetroFlow System Testing Dashboard

        </h1>

        <p className="text-center text-muted">

          Application Testing, Validation & Health Monitoring

        </p>

        <div className="text-center mb-4">

          <button
            className="btn btn-primary"
            onClick={loadTests}
          >

            <FaSyncAlt />

            {" "}

            Refresh Tests

          </button>

        </div>

        {/* Summary Cards */}

        <div className="row">

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaChartPie
                size={40}
                className="text-primary mx-auto"
              />

              <h5 className="mt-3">

                Total Tests

              </h5>

              <h2>

                {report.Total}

              </h2>

            </div>

          </div>

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaCheckCircle
                size={40}
                className="text-success mx-auto"
              />

              <h5 className="mt-3">

                Passed

              </h5>

              <h2 className="text-success">

                {report.Passed}

              </h2>

            </div>

          </div>

          <div className="col-md-4 mb-4">

            <div className="card shadow text-center p-4 h-100">

              <FaTimesCircle
                size={40}
                className="text-danger mx-auto"
              />

              <h5 className="mt-3">

                Failed

              </h5>

              <h2 className="text-danger">

                {report.Failed}

              </h2>

            </div>

          </div>

        </div>

        {/* Success Rate */}

        <div className="card shadow p-4 mb-4">

          <h4>

            Overall System Health

          </h4>

          <div
            className="progress mt-3"
            style={{ height: "30px" }}
          >

            <div
              className="progress-bar bg-success"
              style={{
                width: `${successRate}%`
              }}
            >

              {successRate}%

            </div>

          </div>

        </div>
                {/* ================= TEST RESULTS ================= */}

        <div className="card shadow p-4">

          <h3 className="mb-4">

            🧪 Test Results

          </h3>

          <table className="table table-hover align-middle">

            <thead className="table-dark">

              <tr>

                <th>Component</th>

                <th>Status</th>

                <th>Result</th>

              </tr>

            </thead>

            <tbody>

              {report.Tests.map((test, index) => (

                <tr key={index}>

                  <td>

                    {test.Component === "Backend API" && (
                      <FaServer className="me-2 text-primary" />
                    )}

                    {test.Component === "AI Prediction Model" && (
                      <FaRobot className="me-2 text-success" />
                    )}

                    {test.Component === "Scaler" && (
                      <FaDatabase className="me-2 text-warning" />
                    )}

                    {test.Component === "Prediction History" && (
                      <FaHistory className="me-2 text-info" />
                    )}

                    {test.Component === "Gemini AI" && (
                      <FaRobot className="me-2 text-danger" />
                    )}

                    {test.Component}

                  </td>

                  <td>

                    <span
                      className={
                        test.Result
                          ? "badge bg-success"
                          : "badge bg-danger"
                      }
                    >

                      {test.Status}

                    </span>

                  </td>

                  <td>

                    {test.Result ? (

                      <span className="text-success">

                        <FaCheckCircle />

                        {" "}Passed

                      </span>

                    ) : (

                      <span className="text-danger">

                        <FaTimesCircle />

                        {" "}Failed

                      </span>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
              </div>

      <Footer />

    </>

  );

}

export default Testing;