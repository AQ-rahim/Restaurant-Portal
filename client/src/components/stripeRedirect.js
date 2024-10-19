import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { url } from "../pages/url";
import "react-toastify/dist/ReactToastify.css";

const StripeRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      const queryParams = new URLSearchParams(location.search);
      const accountId = queryParams.get("account");
      const error = queryParams.get("error");

      if (error) {
        toast.error("There was an error during Stripe onboarding.");
        navigate("/bank-details");
        return;
      }

      if (accountId) {
        try {
          const response = await fetch(
            `${url}/fetchStripeAccount/${accountId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch account details");
          }
          const accountDetails = await response.json();

          if (accountDetails.details_submitted) {
            toast.success(
              "Your account is successfully linked to the Stripe account."
            );
          } else {
            toast.info("Please complete the Stripe onboarding process.");
          }

          navigate("/dashboard");
        } catch (error) {
          toast.error("Error verifying Stripe account linkage.");
          console.error("Error:", error);
          navigate("/bank-details");
        }
      } else {
        toast.error("No account ID found.");
        navigate("/bank-details");
      }
    };

    handleRedirect();
  }, [location, navigate]);

  return (
    <>
      <ToastContainer />
      <div className="container mt-5">
        <h3>Processing Stripe Account...</h3>
      </div>
    </>
  );
};

export default StripeRedirect;
