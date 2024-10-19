import React, { useEffect, useState, useMemo } from "react";
import { MdEdit, MdMyLocation } from "react-icons/md";
import Wrapper from "../wrappers/editRestaurantWrapper";
import { ToastContainer, toast } from "react-toastify";
import NotFound from "../assets/not_found.png";
import { Link, useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { url } from "./url";

const libraries = ["places"];
const googleMapsApiKey = "AIzaSyDTiBB_qmAwAwW4ujo1jJQ1qXKQ39tDpLo";

const EditRestaurant = ({ res_id }) => {
  // console.log(res_id);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState({
    id: 0,
    restaurant_name: "",
    contact_details: 0,
    location: "",
    branches: "",
    opening_time: "",
    closing_time: "",
    state: "",
    city: "",
    zipcode: null,
    email: "",
    image: "",
    user_id: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [markerPosition, setMarkerPosition] = useState(null);

  const stateCityData = {
    Illinois: [
      "CHICAGO",
      "CHICAGO HEIGHTS",
      "CHICAGO RIDGE",
      "DES PLAINES",
      "NORTH CHICAGO",
      "SOUTH CHICAGO HEIGHTS",
      "WEST CHICAGO",
    ],
  };

  const cityOptions = stateCityData[restaurant.state] || [];

  const loaderOptions = useMemo(
    () => ({
      googleMapsApiKey,
      libraries,
    }),
    []
  );

  const { isLoaded } = useJsApiLoader(loaderOptions);

  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setMarkerPosition({ lat: latitude, lng: longitude });
          fetchAddressFromCoordinates(latitude, longitude);
        },
        (error) => {
          toast.error("Error fetching location.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const fetchAddressFromCoordinates = async (lat, lng) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleMapsApiKey}`
    );
    const data = await response.json();
    if (data.results && data.results[0]) {
      const address = data.results[0].formatted_address;
      setRestaurant((prevData) => ({
        ...prevData,
        location: address,
      }));
    }
  };

  const fetchCoordinatesFromAddress = async (address) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${googleMapsApiKey}`
    );
    const data = await response.json();
    if (data.results && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      setMapCenter({ lat, lng });
      setMarkerPosition({ lat, lng });
    } else {
      toast.error("Address not found. Please enter a valid address.");
    }
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in restaurant) {
      setRestaurant((prevRestaurant) => ({
        ...prevRestaurant,
        [name]: value,
      }));
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("cover", selectedFile);
    try {
      fetch(`${url}/updateCover/${res_id}`, {
        method: "PUT",
        body: formData,
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

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      fetch(`${url}/editRestaurant/${res_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurant_name: restaurant.restaurant_name,
          contact_details: restaurant.contact_details,
          location: restaurant.location,
          branches: restaurant.branches,
          opening_time: restaurant.opening_time,
          closing_time: restaurant.closing_time,
          state: restaurant.state,
          city: restaurant.city,
          zipcode: restaurant.code,
          email: restaurant.email,
          cover: restaurant.cover,
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

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await fetch(`${url}/restaurantWeb/${res_id}`);
        const json = await response.json();

        const formatTime = (time) => (time ? time.slice(0, 5) : "");

        setRestaurant({
          id: json.restaurant.id,
          restaurant_name: json.restaurant.restaurant_name,
          contact_details: json.restaurant.contact_details,
          location: json.restaurant.location,
          branches: json.restaurant.branches,
          opening_time: formatTime(json.restaurant.opening_time),
          closing_time: formatTime(json.restaurant.closing_time),
          state: json.restaurant.state,
          city: json.restaurant.city,
          zipcode: json.restaurant.zipcode,
          email: json.restaurant.email,
          image: json.restaurant.cover,
          user_id: json.restaurant.res_user_id,
        });
        if (json.restaurant.location) {
          fetchCoordinatesFromAddress(json.restaurant.location);
        }
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchRestaurantData();
  }, [res_id]);

  return (
    <Wrapper>
      {res_id ? (
        <div className="container">
          <ToastContainer />
          <form onSubmit={handleSubmit}>
            <h3 className="heading">Restaurant Details</h3>
            <div className="edit-card row justify-content-center mt-3">
              <div className="col-md-6">
                <span
                  className="oh-primary"
                  style={{ float: "right", cursor: "pointer", fontWeight: 500 }}
                  onClick={() => setIsEdit(!isEdit)}
                >
                  Edit
                </span>
                <div className="d-flex align-items-center">
                  <div className="image">
                    <img
                      src={`${url}/uploads/${restaurant.image}`}
                      className="img-fluid profile-img"
                      alt="Restaurant"
                    />
                    <div class="file-upload">
                      <span>
                        <MdEdit color="white" className="edit-icon" />
                      </span>
                      <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        disabled={!isEdit}
                      />
                    </div>
                  </div>
                  <div className="ms-3">
                    <h5 className="mb-0">{restaurant.restaurant_name}</h5>
                    <small className="text-secondary">
                      {restaurant.branches}
                    </small>
                  </div>
                </div>
                <div className="mb-3 mt-4">
                  <label className="ms-1 text-secondary">Restaurant Name</label>
                  <input
                    type="text"
                    value={restaurant.restaurant_name}
                    name="restaurant_name"
                    className="form-control"
                    disabled={!isEdit}
                    onChange={handleChange}
                  />
                </div>
                <div className="row justify-content-center align-items-center mb-3">
                  <div className="col-md-6">
                    <label className="ms-1 text-secondary">
                      Restaurant Phone Number
                    </label>
                    <input
                      type="text"
                      value={restaurant.contact_details}
                      name="contact_details"
                      className="form-control"
                      disabled={true}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ms-1 text-secondary">
                      Restaurant Email Address
                    </label>
                    <input
                      type="email"
                      value={restaurant.email}
                      name="email"
                      className="form-control"
                      disabled={true}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row justify-content-center align-items-center mb-3">
                  <div className="col-md-6">
                    <label className="ms-1 text-secondary">Opening Time</label>
                    <input
                      type="time"
                      value={restaurant.opening_time}
                      name="opening_time"
                      className="form-control"
                      disabled={!isEdit}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ms-1 text-secondary">Closing Time</label>
                    <input
                      type="time"
                      value={restaurant.closing_time}
                      name="closing_time"
                      className="form-control"
                      disabled={!isEdit}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row justify-content-center align-items-center mb-3">
                  <div className="col-md-6">
                    <label className="ms-1 text-secondary">State</label>
                    <select
                      value={restaurant.state}
                      name="state"
                      className="form-control"
                      disabled={!isEdit}
                      onChange={handleChange}
                    >
                      <option value="">Select State</option>
                      {Object.keys(stateCityData).map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="ms-1 text-secondary">City</label>
                    <select
                      value={restaurant.city}
                      name="city"
                      className="form-control"
                      disabled={!isEdit || !restaurant.state}
                      onChange={handleChange}
                    >
                      <option value="">Select City</option>
                      {cityOptions.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row align-items-center mb-3">
                  <div className="col-md-6 mb-3">
                    <button
                      className="btn oh-btn-sec w-100"
                      type="submit"
                      disabled={!isEdit}
                      onClick={handleFileSubmit}
                    >
                      Update Image
                    </button>
                  </div>
                  <div className="col-md-6 mb-3">
                    <button
                      className="btn oh-btn w-100"
                      type="submit"
                      disabled={!isEdit}
                    >
                      Update Info
                    </button>
                  </div>
                  <div className="col-md-12">
                    <button
                      className="btn oh-btn w-100"
                      type="button"
                      disabled={!isEdit}
                      onClick={() =>
                        navigate("/bank-details", {
                          state: {
                            restaurant_name: restaurant.restaurant_name,
                            phone: restaurant.contact_details,
                            address: restaurant.location,
                            state: restaurant.state,
                            city: restaurant.city,
                            zipcode: restaurant.zipcode,
                          },
                        })
                      }
                    >
                      Link Bank Account
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="col-md-12">
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{
                        height: "300px",
                        width: "100%",
                        borderRadius: 10,
                      }}
                      center={mapCenter}
                      zoom={16}
                    >
                      {markerPosition && <Marker position={markerPosition} />}
                    </GoogleMap>
                  ) : (
                    <div>Loading Map...</div>
                  )}
                </div>
                <div className="my-3">
                  <label className="ms-1 text-secondary">
                    Restaurant Location
                  </label>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="text"
                      value={restaurant.location}
                      name="location"
                      className="form-control"
                      disabled={!isEdit}
                      onChange={handleChange}
                    />
                    {isEdit && (
                      <MdMyLocation
                        onClick={fetchCurrentLocation}
                        style={{ cursor: "pointer", marginLeft: "8px" }}
                      />
                    )}
                  </div>
                </div>

                <div className="row justify-content-center align-items-center mb-3">
                  <div className="col-md-6">
                    <label className="ms-1 text-secondary">Zip Code</label>
                    <input
                      type="numeric"
                      value={restaurant.zipcode}
                      name="zipcode"
                      className="form-control"
                      disabled={!isEdit}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="ms-1 text-secondary">Branch</label>
                    <input
                      type="text"
                      value={restaurant.branches}
                      name="branches"
                      className="form-control"
                      disabled={!isEdit}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <img
          src={NotFound}
          className="img-fluid opacity-75"
          alt="not found"
          style={{ position: "absolute", top: "15%", left: "35%" }}
        />
      )}
    </Wrapper>
  );
};

export default EditRestaurant;
