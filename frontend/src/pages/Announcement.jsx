// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// function Announcement() {

//   const role = localStorage.getItem("role");

//   const [announcement, setAnnouncement] = useState("");
//   const [savedAnnouncement, setSavedAnnouncement] = useState("");

//   useEffect(() => {
//     const data = localStorage.getItem("announcement");

//     if (data) {
//       setSavedAnnouncement(data);
//     }
//   }, []);

//   const publishAnnouncement = () => {

//     localStorage.setItem("announcement", announcement);

//     setSavedAnnouncement(announcement);

//     setAnnouncement("");

//     alert("Announcement Published Successfully");

//   };

//   return (
//     <>
//       <Navbar />

//       <div className="container mt-5">

//         <h2 className="text-center mb-4">
//           📢 Emergency Announcement
//         </h2>

//         {role === "admin" && (

//           <div className="card shadow p-4 mb-4">

//             <h4>Create Announcement</h4>

//             <textarea
//               className="form-control"
//               rows="5"
//               placeholder="Enter Announcement..."
//               value={announcement}
//               onChange={(e) => setAnnouncement(e.target.value)}
//             />

//             <button
//               className="btn btn-primary mt-3"
//               onClick={publishAnnouncement}
//             >
//               Publish
//             </button>

//           </div>

//         )}

//         <div className="card shadow p-4">

//           <h4>Latest Announcement</h4>

//           {savedAnnouncement ? (
//             <div className="alert alert-warning mt-3">
//               {savedAnnouncement}
//             </div>
//           ) : (
//             <p>No announcements available.</p>
//           )}

//         </div>

//       </div>

//       <Footer />
//     </>
//   );
// }

// export default Announcement;
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function Announcement() {

  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {

    api.get("/announcement")
      .then((res) => {
        setAnnouncement(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  if (!announcement) {

    return (
      <>
        <Navbar />

        <div className="container text-center mt-5">
          <div className="spinner-border text-primary"></div>
          <h3 className="mt-3">Loading Announcement...</h3>
        </div>

        <Footer />
      </>
    );

  }

  return (

    <>
      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center mb-4">
          📢 Emergency Announcement
        </h1>

        <div className="card shadow p-4">

          <h4>
            📍 Station
          </h4>

          <h3 className="text-primary">
            {announcement.Station}
          </h3>

          <hr />

          <h4>
            Announcement
          </h4>

          <p className="fs-5">
            {announcement.Announcement}
          </p>

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Announcement;