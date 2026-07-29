import "../../styles/User/UserAlert.css";

function UserAlert({ alert }) {

  return (

    <div className="alert-card">

      <h2>
        🚨 Travel Alert
      </h2>


      {alert ? (

        <div>

          <p>
            {alert.message}
          </p>


          <span>
            Type: {alert.notification_type}
          </span>

        </div>

      ) : (

        <p>
          No alerts available currently.
        </p>

      )}

    </div>

  );

}

export default UserAlert;