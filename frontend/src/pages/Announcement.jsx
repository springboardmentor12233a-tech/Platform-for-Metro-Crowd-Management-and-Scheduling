import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Announcement() {

  const role = localStorage.getItem("role");

  const [announcement, setAnnouncement] = useState("");
  const [savedAnnouncement, setSavedAnnouncement] = useState("");

  useEffect(() => {

    const data = localStorage.getItem("announcement");

    if (data) {
      setSavedAnnouncement(data);
    }

  }, []);

  // Publish or Update
  const publishAnnouncement = () => {

    if (announcement.trim() === "") {

      alert("Please enter an announcement.");

      return;

    }

    localStorage.setItem("announcement", announcement);

    setSavedAnnouncement(announcement);

    setAnnouncement("");

    alert("Announcement Published Successfully!");

  };

  // Edit Existing
  const editAnnouncement = () => {

    setAnnouncement(savedAnnouncement);

  };

  // Delete
  const deleteAnnouncement = () => {

    if (window.confirm("Are you sure you want to delete this announcement?")) {

      localStorage.removeItem("announcement");

      setSavedAnnouncement("");

      setAnnouncement("");

      alert("Announcement Deleted Successfully!");

    }

  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">

        <h2 className="text-center mb-4">
          📢 Emergency Announcement
        </h2>

        {/* Admin Controls */}

        {role === "admin" && (

          <div className="card shadow p-4 mb-4">

            <h4 className="mb-3">
              Admin Control Panel
            </h4>

            <textarea
              className="form-control"
              rows="5"
              placeholder="Enter Announcement..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />

            <div className="mt-3">

              <button
                className="btn btn-primary me-2"
                onClick={publishAnnouncement}
              >
                📢 Publish
              </button>

              <button
                className="btn btn-warning me-2"
                onClick={editAnnouncement}
                disabled={!savedAnnouncement}
              >
                ✏ Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={deleteAnnouncement}
                disabled={!savedAnnouncement}
              >
                🗑 Delete
              </button>

            </div>

          </div>

        )}

        {/* Latest Announcement */}

        <div className="card shadow p-4">

          <h4>
            Latest Announcement
          </h4>

          {savedAnnouncement ? (

            <div className="alert alert-warning mt-3">

              <h5>📢 MetroFlow Notice</h5>

              <hr />

              <p className="mb-0">
                {savedAnnouncement}
              </p>

            </div>

          ) : (

            <div className="alert alert-secondary mt-3">

              No announcements available.

            </div>

          )}

        </div>

      </div>

      <Footer />
    </>
  );
}

export default Announcement;

// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import api from "../services/api";

// function Announcement() {

//   const [announcement, setAnnouncement] = useState(null);

//   useEffect(() => {

//     api.get("/announcement")
//       .then((res) => {
//         setAnnouncement(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//   }, []);

//   if (!announcement) {

//     return (
//       <>
//         <Navbar />

//         <div className="container text-center mt-5">
//           <div className="spinner-border text-primary"></div>
//           <h3 className="mt-3">Loading Announcement...</h3>
//         </div>

//         <Footer />
//       </>
//     );

//   }

//   return (

//     <>
//       <Navbar />

//       <div className="container mt-5">

//         <h1 className="text-center mb-4">
//           📢 Emergency Announcement
//         </h1>

//         <div className="card shadow p-4">

//           <h4>
//             📍 Station
//           </h4>

//           <h3 className="text-primary">
//             {announcement.Station}
//           </h3>

//           <hr />

//           <h4>
//             Announcement
//           </h4>

//           <p className="fs-5">
//             {announcement.Announcement}
//           </p>

//         </div>

//       </div>

//       <Footer />

//     </>

//   );

// }

// export default Announcement;