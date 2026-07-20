import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function Notifications() {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    api.get("/notifications")
      .then((res) => {

        setNotifications(res.data);

      })
      .catch((err) => {

        console.log(err);

      });

  }, []);

  return (

    <>
      <Navbar />

      <div className="container mt-5">

        <h1 className="text-center mb-4">
          🔔 MetroFlow Notifications
        </h1>

        {

          notifications.map((item, index) => (

            <div
              key={index}
              className={`alert alert-${item.type}`}
            >

              {item.message}

            </div>

          ))

        }

      </div>

      <Footer />

    </>

  );

}

export default Notifications;