import "../../styles/User/AnnouncementCard.css";

function AnnouncementCard({ announcement }) {

  return (

    <div className="announcement-card">

      <h2>
        📣 Latest Announcement
      </h2>


      {announcement ? (

        <p>
          {announcement.announcement}
        </p>

      ) : (

        <p>
          No announcements available.
        </p>

      )}

    </div>

  );

}

export default AnnouncementCard;