// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import api from "../services/api";

// function Notifications() {

//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {

//     const loadNotifications = () => {

//       api.get("/notifications")

//         .then((res) => {

//           setNotifications(res.data);

//           localStorage.setItem(
//             "notifications",
//             JSON.stringify(res.data)
//           );

//         })

//         .catch((err) => {

//           console.log(err);

//         });

//     };

//     loadNotifications();

//     const interval = setInterval(loadNotifications, 5000);

//     return () => clearInterval(interval);

//   }, []);

//   return (

//     <>

//       <Navbar />

//       <div className="container mt-5">

//         <h1 className="text-center mb-4">
//           🔔 MetroFlow Notifications
//         </h1>

//         <p className="text-center text-muted">
//           Live notification updates every 5 seconds
//         </p>

//         {notifications.length === 0 ? (

//           <div className="alert alert-secondary text-center">
//             No Notifications Available
//           </div>

//         ) : (

//           notifications.map((item, index) => (

//             <div
//               key={index}
//               className={`alert alert-${item.type}`}
//             >

//               {item.message}

//             </div>

//           ))

//         )}

//       </div>

//       <Footer />

//     </>

//   );

// }

// export default Notifications;

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function Notifications() {

  const [notification, setNotification] = useState(null);

  useEffect(() => {

    const loadNotification = () => {

      api.get("/notifications")
        .then((res) => {

          setNotification(res.data);

          localStorage.setItem(
            "notification",
            JSON.stringify(res.data)
          );

        })
        .catch((err) => {

          console.log(err);

        });

    };

    loadNotification();

    const interval = setInterval(loadNotification, 5000);

    return () => clearInterval(interval);

  }, []);

  return (

    <>

      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center mb-4">
          🔔 MetroFlow Notifications
        </h1>

        <p className="text-center text-muted">
          Live notification updates every 5 seconds
        </p>

        {!notification ? (

          <div className="alert alert-secondary text-center">
            No Notifications Available
          </div>

        ) : (

          <div className="card shadow-lg">

            <div className="card-header bg-primary text-white">

              <h4 className="mb-0">

                🚉 {notification.Station}

              </h4>

            </div>

            <div className="card-body">

              <p>
                <strong>Passenger Count:</strong>{" "}
                {notification.Passenger_Count}
              </p>

              <p>
                <strong>Crowd Level:</strong>{" "}
                {notification.Crowd_Level}
              </p>

              <p>
                <strong>Delay:</strong>{" "}
                {notification.Delay} Minutes
              </p>

              <hr />

              <div className="alert alert-info">

                {notification.Notification}

              </div>

            </div>

          </div>

        )}

      </div>

      <Footer />

    </>

  );

}

export default Notifications;