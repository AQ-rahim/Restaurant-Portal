import React, { useState, useEffect } from "react";
import Wrapper from "../wrappers/authWrapper";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { url } from "./url";

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state ? location.state.id : null;
  const email = location.state ? location.state.email : null;
  const [enable, setEnable] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);

  const handleOTP = (e) => {
    e.preventDefault();
    try {
      fetch(`${url}/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          received_otp: otp,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success === true) {
            toast.success(json.message);
            setEnable(true);
          }
        });
    } catch (error) {
      toast.error(error);
    }
  };

  const handleResend = (e) => {
    e.preventDefault();
    setTimer(120);
    setOtp("");
    try {
      fetch(`${url}/resendOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      }).then((res) => res.json());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch(`${url}/sendOTP`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((json) => toast.info(json.message));

    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `0${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetch(`${url}/checkPassword/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: currentPassword,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success === false) {
            toast.error("Current Password doesn't match");
          } else {
            if (newPassword !== confirmPassword) {
              toast.error("Password doesn't match");
            } else {
              fetch(`${url}/changePassword/${id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  newPassword: newPassword,
                  confirmPassword: confirmPassword,
                }),
              })
                .then((res) => res.json())
                .then((json) => {
                  if (json.success === true) {
                    toast.success(json.message);
                    setTimeout(() => {
                      navigate("/dashboard");
                    }, 2000);
                  }
                });
            }
          }
          setConfirmPassword("");
          setCurrentPassword("");
          setNewPassword("");
        });
    } catch (error) {
      toast.success(error);
    }
  };
  return (
    <div className="auth">
      <Wrapper>
        <ToastContainer />
        <div className="container">
          <div className="row justiify-content-center align-items-center">
            <div className="col-md-6">
              <h6 className="text-secondary mt-4 w-50">
                We have send you <strong>One Time Password</strong> to your
                email <strong className="oh-primary">{email}</strong> & phone
                number.
              </h6>
              <h3 className="mt-4">Please Enter OTP</h3>
              <form onSubmit={handleOTP}>
                <div className="mt-4">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    containerStyle={{
                      width: "100px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    separator={<span>-</span>}
                    inputStyle={{
                      width: "2em",
                      textAlign: "center",
                      fontSize: "16px",
                      border: "none",
                      borderBottom: "2px solid #f8971d",
                      margin: "0px 4px",
                      padding: "4px 0px",
                      outline: "none",
                    }}
                    renderInput={(props) => <input {...props} />}
                  />
                  <div className="d-flex mt-3">
                    {timer !== 0 ? (
                      <button
                        className="btn oh-btn-sec mb-3 mx-2"
                        onClick={handleResend}
                        disabled={timer !== 0}
                      >
                        {formatTime(timer)}
                      </button>
                    ) : (
                      <button
                        className="btn oh-btn-sec mb-3 mx-2"
                        onClick={handleResend}
                      >
                        Resend
                      </button>
                    )}

                    <button className=" btn oh-btn mb-3 mx-2">
                      Verify OTP
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-md-6">
              <h2 className="my-5">Change Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="col-md-6 mb-3">
                  <label className="ms-3 text-secondary">
                    Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-5 mt-2"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={!enable}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="ms-3 text-secondary">New Password</label>
                  <input
                    type="password"
                    className="form-control rounded-5 mt-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!enable}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="ms-3 text-secondary">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control rounded-5 mt-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!enable}
                  />
                </div>
                <button
                  className="btn mb-3 oh-btn"
                  type="submit"
                  disabled={!enable}
                >
                  Change
                </button>
              </form>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default ChangePassword;
