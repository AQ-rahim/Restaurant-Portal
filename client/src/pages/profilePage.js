import React, { useEffect, useState } from "react";
import Wrapper from "../wrappers/profileWrapper";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { url } from "./url";

const ProfilePage = ({ userId }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    date_of_birth: "",
    country: "",
    city: "",
    gender: "",
  });

  useEffect(() => {
    fetch(`${url}/getUser/${userId}`)
      .then((res) => res.json())
      .then((json) => {
        setUser({
          firstName: json.user.first_name,
          lastName: json.user.last_name,
          email: json.user.email,
          phone: json.user.phone,
          address: json.user.address,
          date_of_birth: json.user.date_of_birth?.split("T")[0],
          country: json.user.country,
          city: json.user.city,
          gender: json.user.gender,
        });
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      fetch(`${url}/updateProfile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          phone: user.phone,
          address: user.address,
          date_of_birth: user.date_of_birth,
          country: user.country,
          city: user.city,
          gender: user.gender,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success === true) {
            toast.success(json.message);
          }
        });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Wrapper>
      <ToastContainer />
      <div className="container mt-3">
        <h2 className="ms-5">Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="row justify-content-center mt-4">
            <div className="col-md-5 profile-card mx-2">
              <div className="row justify-content-space-between align-items-center mb-3">
                <div className="col-md-6">
                  <label className="ms-1 text-secondary">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="ms-1 text-secondary">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-3 mt-3">
                <label className="ms-1 text-secondary">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="ms-1 text-secondary">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="ms-1 text-secondary">Password</label>
                <div className="input-group">
                  <input
                    type="text"
                    name="password"
                    value="***Password is hidden***"
                    className="form-control"
                    disabled="true"
                    onChange={handleChange}
                  />
                  <button
                    className="btn oh-btn"
                    type="button"
                    onClick={() =>
                      navigate("/changePassword", {
                        state: {
                          id: userId,
                          email: user.email,
                        },
                      })
                    }
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-5 profile-card">
              <div className="mb-3">
                <label className="ms-1 text-secondary">Address</label>
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-6">
                  <label className="ms-1 text-secondary">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={user.country}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="ms-1 text-secondary">City</label>
                  <input
                    type="text"
                    name="city"
                    value={user.city}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-6">
                  <label className="ms-1 text-secondary">Gender</label>
                  <select
                    className="form-select"
                    name="gender"
                    onChange={handleChange}
                    value={user.gender}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Rather not say</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="ms-1 text-secondary">Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={user.date_of_birth}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <button className="btn oh-btn w-100" type="submit">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

export default ProfilePage;
