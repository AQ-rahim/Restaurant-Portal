import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import logo from "../assets/logo.png";
import Wrapper from "../wrappers/authWrapper";
import image from "../assets/rider.png";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { url } from "./url";

const OTP = ({ isOtp, user, setUser }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [getOtp, setGetOtp] = useState("");
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (user) {
      fetch(`${url}/sendOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.otp) {
            setGetOtp(json.otp);
          } else {
            console.error("OTP not found in response", json);
          }
        })
        .catch((error) => {
          console.error("Error fetching OTP:", error);
        });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (getOtp == otp) {
        fetch(`${url}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: user.first,
            last_name: user.last,
            password: user.password,
            email: user.email,
            phone: user.phone,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (!data.success) {
              toast.error(data.message);
            } else {
              setUser({
                first: "",
                last: "",
                username: "",
                email: "",
                password: "",
                phone: "",
                confirm: "",
              });
              navigate("/");
            }
          })
          .catch((error) => {
            toast.error("Signup failed: " + error.message);
          });
      } else {
        toast.error("OTP doesn't match");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  const handleResend = (e) => {
    e.preventDefault();
    setTimer(120);
    setOtp("");
    try {
      fetch(`${url}/sendOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      }).then((res) => res.json());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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
  return (
    <Wrapper>
      <ToastContainer />
      <div className="container">
        <div className="row justify-content-center">
          <img src={logo} className="img-fuild logo" alt="OnlyHalal" />
        </div>
        <div className="row justiify-content-center align-items-center">
          <div className="col-md-6">
            <h6 className="text-secondary mt-4 w-50">
              We have send you <strong>One Time Password</strong> to your email{" "}
              <strong className="oh-primary">{user.email}</strong>
            </h6>
            <h3 className="mt-4">Please Enter OTP</h3>
            <form onSubmit={handleSubmit}>
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

                  <button className=" btn oh-btn mb-3 mx-2">Verify OTP</button>
                </div>
              </div>
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

export default OTP;
