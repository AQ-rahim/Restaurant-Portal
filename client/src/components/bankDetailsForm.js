import React, { useState, useEffect } from "react";
import Wrapper from "../wrappers/barWrapper";
import { ToastContainer, toast } from "react-toastify";
import { url } from "../pages/url";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import { Spinner } from "react-bootstrap"; // Import Spinner for loading indicator

const BankDetailsForm = ({ user }) => {
  const location = useLocation();
  const { restaurant_name, phone, address, state, city, zipcode } =
    location.state || {};

  const [formData, setFormData] = useState({
    accountId: "",
    email: user.email || "",
    taxId: "",
    accountHolderName: "",
    business: restaurant_name || "",
    routingNumber: "",
    accountNumber: "",
    phone: phone || "",
    address: address || "",
    state: state || "",
    city: city || "",
    zipCode: zipcode || "",
    supportPhone: "",
    privacyPolicy: "",
    payoutStatementDescriptor: "",
    industry: "Food Industry",
    website: "",
  });

  const [loading, setLoading] = useState(true); // Initialize as true
  const [isEdit, setIsEdit] = useState(false);

  const fetchBankDetails = async (id) => {
    try {
      const response = await fetch(`${url}/checkStripeAccount/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message !== "No connected account found.") {
          toast.error(`Error fetching bank details: ${errorData.error}`);
        }
        setLoading(false);
        return;
      }
      const result = await response.json();
      if (result.success) {
        setFormData((prevData) => ({
          ...prevData,
          accountId: result.data.accountId,
          email: result.data.email || prevData.email,
          taxId: result.data.taxId || "",
          accountHolderName: result.data.accountHolderName || "",
          business: result.data.business || "",
          routingNumber: result.data.routingNumber || "",
          accountNumber: result.data.accountNumber || "",
          supportPhone: result.data.supportPhone || "",
          privacyPolicy: result.data.privacyPolicy || "",
          payoutStatementDescriptor:
            result.data.payoutStatementDescriptor || "",
          website: result.data.website || "",
          phone: result.data.phone || prevData.phone,
          address: result.data.address || prevData.address,
          state: result.data.state || prevData.state,
          city: result.data.city || prevData.city,
          zipCode: result.data.zipCode || prevData.zipCode,
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch bank details");
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetails(user.res_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.res_id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log(formData);

    if (formData.accountId && !isEdit) {
      // If accountId exists and not in edit mode, do nothing or show a message
      toast.info("No changes to save.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${url}/createStripeAccount/${user.res_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Failed to save bank details: ${errorData.error}`);
        setLoading(false);
        return;
      }

      const result = await response.json();
      if (result.accountLink) {
        window.location.href = result.accountLink;
      }
      toast.success("Redirecting to the Stripe Account");
      console.log(result);
    } catch (error) {
      toast.error("Failed to save bank details");
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  // Conditional Rendering
  const renderContent = () => {
    if (loading) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (formData.accountId && !isEdit) {
      // Display details in a table
      return (
        <div className="container mt-3">
          <h2 className="heading mb-4">Bank Details</h2>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th>Email</th>
                <td>{formData.email}</td>
              </tr>
              <tr>
                <th>Tax ID</th>
                <td>{formData.taxId}</td>
              </tr>
              <tr>
                <th>Account Holder Name</th>
                <td>{formData.accountHolderName}</td>
              </tr>
              <tr>
                <th>Doing Business As</th>
                <td>{formData.business}</td>
              </tr>
              <tr>
                <th>Routing Number</th>
                <td>{formData.routingNumber}</td>
              </tr>
              <tr>
                <th>Account Number</th>
                <td>{formData.accountNumber}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{formData.phone}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{formData.address}</td>
              </tr>
              <tr>
                <th>City</th>
                <td>{formData.city}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{formData.state}</td>
              </tr>
              <tr>
                <th>ZIP Code</th>
                <td>{formData.zipCode}</td>
              </tr>
              <tr>
                <th>Support Phone No.</th>
                <td>{formData.supportPhone}</td>
              </tr>
              <tr>
                <th>Privacy Policy</th>
                <td>{formData.privacyPolicy}</td>
              </tr>
              <tr>
                <th>Payout Statement Descriptor</th>
                <td>{formData.payoutStatementDescriptor}</td>
              </tr>
              <tr>
                <th>Industry</th>
                <td>{formData.industry}</td>
              </tr>
              <tr>
                <th>Website</th>
                <td>{formData.website}</td>
              </tr>
            </tbody>
          </table>
          <div className="row align-items-center">
            <div className="col-md-6 mb-3">
              <button
                className="btn oh-btn w-100"
                type="button"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Display the form for creating or editing details
    return (
      <div className="container mt-3">
        <h2 className="heading">Bank Details Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="edit-card row justify-content-center mt-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="ms-1 text-secondary">Email: </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="form-control"
                  required
                />
              </div>
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">Tax ID: </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">
                    Account Holder Name:
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    disabled={!isEdit}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">
                    Doing Business As:
                  </label>
                  <input
                    type="text"
                    name="business"
                    value={formData.business}
                    disabled
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">Routing Number:</label>
                  <input
                    type="text"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">Account Number:</label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">Phone: </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    disabled
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">Address: </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    disabled
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">City: </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    disabled
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">State: </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    disabled
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">ZIP Code: </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    disabled
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">
                    Support Phone No.:{" "}
                  </label>
                  <input
                    type="tel"
                    name="supportPhone"
                    value={formData.supportPhone}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">
                    Privacy Policy:{" "}
                  </label>
                  <input
                    type="text"
                    name="privacyPolicy"
                    value={formData.privacyPolicy}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">
                    Payout Statement Descriptor:{" "}
                    <span
                      data-toggle="tooltip"
                      title="This is how your payouts will appear on your customers' bank statements."
                    >
                      <i className="bi bi-info-circle"></i>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="payoutStatementDescriptor"
                    value={formData.payoutStatementDescriptor}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className="form-control"
                    required
                    placeholder="Restaurant or Bussiness Name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="ms-1 text-secondary">Industry: </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    disabled
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="row justify-content-center align-items-center mb-3">
                <div className="col-md-12 mb-3">
                  <label className="ms-1 text-secondary">Website: </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={!isEdit}
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mt-3">
              <button
                className="btn oh-btn w-100"
                type="button"
                onClick={() => {
                  if (isEdit && formData.accountId) {
                    setIsEdit(false);
                    // Optionally, refetch details to discard changes
                    fetchBankDetails(user.res_id);
                  } else {
                    setIsEdit(!isEdit);
                  }
                }}
              >
                {isEdit ? "Cancel" : "Edit"}
              </button>
            </div>
            <div className="col-md-6 mb-3 mt-3">
              <button
                className="btn oh-btn w-100"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Saving...
                  </>
                ) : (
                  "Save Bank Details"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <Wrapper>
      <ToastContainer />
      {renderContent()}
    </Wrapper>
  );
};

export default BankDetailsForm;
