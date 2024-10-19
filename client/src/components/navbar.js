import React from "react";
import profile from "../assets/profile.png";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import Wrapper from "../wrappers/barWrapper";
import { RiMenu2Fill } from "react-icons/ri";
import { url } from "../pages/url";

const Navbar = ({ menuHandle, user }) => {
  return (
    <Wrapper>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link to="/">
            <img src={logo} className="img-fluid logo" alt="logo" />
          </Link>

          <RiMenu2Fill
            color="#fff"
            size={24}
            className="menu-bar"
            style={{ cursor: "pointer" }}
            onClick={menuHandle}
          />
          <RiMenu2Fill
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
            color="#fff"
            size={24}
            className="menu-bar-mobile"
            style={{ cursor: "pointer" }}
          />
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <div className="profile">
                <h6 className="profile-title">Hello, {user.firstName}</h6>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    </Wrapper>
  );
};

export default Navbar;
