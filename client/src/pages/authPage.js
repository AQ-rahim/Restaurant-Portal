import React, { useState } from "react";
import logo from "../assets/logo.png";
import Wrapper from "../wrappers/authWrapper";
import { FcGoogle } from "react-icons/fc";
import image from "../assets/rider.png";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "./url";
import OTP from "./authOtpPage";

const AuthPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [showOtp, setShowOtp] = useState(false);
  const [user, setUser] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
    phone: "",
    confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Remove all non-digit characters
      const sanitizedValue = value.replace(/\D/g, "");

      // Ensure phone number is up to 10 digits long and doesn't start with '1'
      if (
        sanitizedValue.length <= 10 &&
        (sanitizedValue.length === 0 || sanitizedValue[0] !== "1")
      ) {
        setUser((prevUser) => ({
          ...prevUser,
          [name]: sanitizedValue,
        }));
      }
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password must be 6-12 characters long, contain at least one uppercase letter,
    // one special character, and one number
    const minLength = 6;
    const maxLength = 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      password.length <= maxLength &&
      hasUppercase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (check) {
      if (user.email === "" || user.password === "") {
        toast.error("Fill the required field");
      } else {
        fetch(`${url}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            password: user.password,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.success === false) {
              toast.error(json.message);
            } else {
              Cookies.set("token", json.token, { expires: 1 });
              toast.success(json.message);
              setTimeout(() => {
                setIsLoggedIn(true);
                navigate("/");
              }, 2000);
            }
          })
          .catch((error) => {
            toast.error(error.message || "An error occurred");
          });
      }
    } else {
      if (
        user.first === "" ||
        user.last === "" ||
        user.phone === "" ||
        user.confirm === "" ||
        user.email === "" ||
        user.password === ""
      ) {
        toast.error("Fill the required fields");
      } else if (!validatePassword(user.password)) {
        toast.error(
          "Password must be 6-12 characters long, contain at least one uppercase letter, one number, and one special character"
        );
      } else if (user.password !== user.confirm) {
        toast.error("Password doesn't match");
      } else if (!validateEmail(user.email)) {
        toast.error("Wrong email format");
      } else {
        setShowOtp(true);
      }
    }
  };

  const [check, setCheck] = useState(true);
  return (
    <>
      {!showOtp ? (
        <Wrapper>
          <ToastContainer />
          <div className="container">
            <div className="row justify-content-center">
              <img src={logo} className="img-fluid logo" alt="OnlyHalal" />
            </div>

            <div className="row justify-content-center align-items-center">
              <div className="col-md-6">
                <h2>{!check ? "Sign Up" : "Sign In"}</h2>
                <h6 className="text-secondary mb-4">
                  {!check
                    ? "Create your Onlyhalal account."
                    : "Sign in to stay connected."}
                </h6>
                <form>
                  {!check ? (
                    <div className="row justify-content-center align-items-center">
                      <div className="col-md-6 mb-2">
                        <label className="ms-3 text-secondary">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="form-control rounded-5 mt-2"
                          name="first"
                          value={user.first}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="ms-3 text-secondary">Last Name</label>
                        <input
                          type="text"
                          className="form-control rounded-5 mt-2"
                          name="last"
                          value={user.last}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="ms-3 text-secondary">Email</label>
                        <input
                          type="email"
                          className="form-control rounded-5 mt-2"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="ms-3 text-secondary">Phone No.</label>
                        <input
                          type="text"
                          className="form-control rounded-5 mt-2"
                          name="phone"
                          value={user.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="ms-3 text-secondary">Password</label>
                        <input
                          type="password"
                          className="form-control rounded-5 mt-2"
                          name="password"
                          value={user.password}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="ms-3 text-secondary">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          className="form-control rounded-5 mt-2"
                          name="confirm"
                          value={user.confirm}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2">
                        <label className="ms-3 text-secondary">Email</label>
                        <input
                          type="text"
                          className="form-control rounded-5 mt-2"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="ms-3 text-secondary">Password</label>
                        <input
                          type="password"
                          className="form-control rounded-5 mt-2"
                          name="password"
                          value={user.password}
                          onChange={handleChange}
                        />
                        <p className="text-end">
                          <Link
                            to="/forgotPassword"
                            className="text-danger text-decoration-none text-end"
                          >
                            Forgot Password?
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}
                  {/* <div className="form-check mb-3 ">
                <input
                  className="form-check-input oh-primary"
                  type="checkbox"
                />
                <label className="form-check-label text-secondary">
                  {!check ? "I agree with terms of uses" : "Remember Me"}
                </label>
              </div> */}
                  <button className="btn oh-btn mb-2" onClick={handleSubmit}>
                    {!check ? "Sign Up" : "Sign In"}
                  </button>
                  {/* <p className="text-secondary my-2">
                or Sign In with other accounts
              </p>
              <button
                onClick={handleGoogleLogin}
                className="btn oh-btn google-btn"
              >
                <FcGoogle size={24} />
                <p className="my-0 ms-2">Sign-in with Google</p>
              </button> */}
                  <p className="text-secondary" style={{ cursor: "pointer" }}>
                    {!check
                      ? "Already have an account?"
                      : "Don't have an account?"}{" "}
                    <span
                      className="oh-primary"
                      onClick={() => setCheck(!check)}
                    >
                      {!check ? "Login" : "Sign Up"}
                    </span>
                  </p>
                </form>
              </div>
              <div className="col-md-6">
                <img src={image} className="img-fluid image" alt="rider" />
              </div>
            </div>
          </div>
        </Wrapper>
      ) : (
        <OTP
          email={user.email}
          setShowOtp={setShowOtp}
          user={user}
          setUser={setUser}
        />
      )}
    </>
  );
};

export default AuthPage;
