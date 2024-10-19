import React, { useState } from "react";
import logo from "../assets/logo.png";
import Wrapper from "../wrappers/authWrapper";
import image from "../assets/rider.png";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "./url";
 
const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state ? location.state.email : "";
  const [password, setPassowrd] = useState("");
  const [confirm, setConfirm] = useState("");

  const handlePassSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Password doesn't match!");
    } else {
      try {
        fetch(`${url}/resetPassword`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            toast.success(json.message);
            setTimeout(() => {
              navigate("/auth");
            }, 2000);
          });
      } catch (error) {
        toast.error(error);
      }
      setConfirm("");
      setPassowrd("");
    }
  };

  return (
    <Wrapper>
      <ToastContainer />
      <div className="container">
        <div className="row justify-content-center">
          <img src={logo} className="img-fuild logo" alt="OnlyHalal" />
        </div>
        <div className="row justiify-content-center align-items-center">
          <div className="col-md-6">
            <h2>Reset Password</h2>
            <form onSubmit={handlePassSubmit}>
              <div className="col-md-6 mb-3 mt-5">
                <label className="ms-3">New Password</label>
                <input
                  type="password"
                  className="form-control rounded-5 mt-2"
                  value={password}
                  onChange={(e) => setPassowrd(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="ms-3">Confirm Password</label>
                <input
                  type="password"
                  className="form-control rounded-5 mt-2"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <button className="btn mb-3 oh-btn" type="submit">
                Reset
              </button>
            </form>
          </div>
          <div className="col-md-6">
            <img src={image} className="img-fluid image" alt="rider" />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ResetPassword;
