import UserSidebar from "../components/user/UserSidebar";
import "../styles/User/UserLayout.css";

function UserLayout({children}){

  return(
    <div className="user-layout">

      <UserSidebar />

      <main className="user-content">
        {children}
      </main>

    </div>
  );

}

export default UserLayout;