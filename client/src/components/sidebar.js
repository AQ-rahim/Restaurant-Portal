import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Wrapper from "../wrappers/barWrapper";
import Cookies from "js-cookie";

const SidebarData = [
  {
    id: 1,
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    id: 2,
    title: "Wallet",
    path: "/wallet",
  },
  {
    id: 3,
    title: "Edit Restaurant",
    path: "/restaurant",
  },
  {
    id: 4,
    title: "Profile",
    path: "/profile",
  },
];

const Sidebar = ({ showSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await Cookies.remove("token");
    navigate("/logout");
    window.location.reload();
  };

  return (
    <Wrapper>
      <div className={`sidebar ${!showSidebar ? "hide" : "me-4"}`}>
        {SidebarData.map((data) => (
          <ul className="list-container mx-0 p-0" key={data.id}>
            <Link className="text-decoration-none" to={data.path}>
              <li
                key={data.id}
                className={`list ${
                  location.pathname === data.path ? "active" : ""
                }`}
              >
                {data.title}
              </li>
            </Link>
          </ul>
        ))}
        <ul className="list-container mx-0 p-0">
          <li className="list" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>

      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="mobile-sidebar me-4">
          {SidebarData.map((data) => (
            <ul className="list-container mx-0 p-0" key={data.id}>
              <Link className="text-decoration-none" to={data.path}>
                <li className="list">{data.title}</li>
              </Link>
            </ul>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default Sidebar;
