import React, { useState } from "react";
import logo from "../assets/logo.png";
import Wrapper from "../wrappers/authWrapper";
import image from "../assets/rider.png";
import { ToastContainer, toast } from "react-toastify";
import OTP from "./otpPage";
import { url } from "./url";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [getOtp, setGetOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetch(`${url}/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success === true) {
            setGetOtp(json.otp);
            toast.info(json.message);
            setShowOTP(true);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Wrapper>
      <ToastContainer />
      {!showOTP ? (
        <div className="container">
          <div className="row justify-content-center">
            <img src={logo} className="img-fuild logo" alt="OnlyHalal" />
          </div>
          <div className="row justiify-content-center align-items-center">
            <div className="col-md-6">
              <h2>Forgot Password</h2>
              <h6 className="text-secondary mt-3 w-50 mb-5">
                Enter your email address and we'll send you an email with
                instuctions to reset your password.
              </h6>
              <form onSubmit={handleSubmit}>
                <div className="col-md-6 mb-3">
                  <label className="ms-3">Email</label>
                  <input
                    type="email"
                    className="form-control rounded-5 mt-2"
                    placeholder="e.g. john@example.com"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                <button className="btn mb-3 oh-btn" type="submit">
                  Send
                </button>
              </form>
            </div>

            <div className="col-md-6">
              <img src={image} className="img-fluid image" alt="rider" />
            </div>
          </div>
        </div>
      ) : (
        <OTP email={email} getOtp={getOtp} />
      )}
    </Wrapper>
  );
};

export default ForgotPassword;
