import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import logo from "../assets/logo.png";
import Wrapper from "../wrappers/authWrapper";
import image from "../assets/rider.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { url } from "./url";

const OTP = ({ email, getOtp }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (String(getOtp) === String(otp)) {
        setTimeout(() => {
          navigate("/resetPassword", { state: { email: email } });
        }, 2000);
      }else{
        toast.error("OTP didn't match")
      }
      
    } catch (error) {
      toast.error(error);
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
          email: email,
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
      <div className="container">
        <div className="row justify-content-center">
          <img src={logo} className="img-fuild logo" alt="OnlyHalal" />
        </div>
        <div className="row justiify-content-center align-items-center">
          <div className="col-md-6">
            <h6 className="text-secondary mt-4 w-50">
              We have send you <strong>One Time Password</strong> to your email{" "}
              <strong className="oh-primary">{email}</strong>
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
