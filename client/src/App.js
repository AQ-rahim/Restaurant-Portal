import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/authPage";
import ForgotPassword from "./pages/forgotPasswordPage";
import Dashboard from "./components/dashboardPage";
import ChangePassword from "./pages/changePassword";
import ResetPassword from "./pages/resetPassword";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Wallet from "./components/walletPage";
import EditRestaurant from "./pages/editRestaurant";
import ProfilePage from "./pages/profilePage";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import BankDetailsForm from "./components/bankDetailsForm";
import StripeRedirect from "./components/stripeRedirect";

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    id: null,
    res_id: null,
    firstName: "",
    email: "",
    image: "",
  });
  const [token, setToken] = useState("");

  useEffect(() => {
    const stored_token = Cookies.get("token") || "";
    if (stored_token) {
      try {
        setToken(stored_token);
        const decoded = jwtDecode(stored_token);
        setUser({
          id: decoded.userId,
          res_id: decoded.res_id,
          firstName: decoded.username,
          email: decoded.email,
        });
      } catch (error) {
        console.error("Invalid token:", error.message);
      }
    }
  }, [isLoggedIn]);

  const menuHandle = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <BrowserRouter>
      <div className={!token ? "auth" : ""}>
        <Routes>
          {!token && (
            <Route
              path="/auth"
              element={<AuthPage setIsLoggedIn={setIsLoggedIn} />}
            />
          )}
          {!token && (
            <Route path="/forgotPassword" element={<ForgotPassword />} />
          )}
          {!token && (
            <Route path="/resetPassword" element={<ResetPassword />} />
          )}
          {!token && <Route path="/logout" element={<Navigate to="/auth" />} />}
          {token ? (
            <>
              <Route path="/auth" element={<Navigate to="/dashboard" />} />

              <Route
                path="/forgotPassword"
                element={<Navigate to="/dashboard" />}
              />
              <Route
                path="/resetPassword"
                element={<Navigate to="/dashboard" />}
              />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to="/auth" />} />
              <Route path="/dashboard" element={<Navigate to="/auth" />} />
              <Route path="/wallet" element={<Navigate to="/auth" />} />
              <Route path="/restaurant" element={<Navigate to="/auth" />} />
              <Route path="/bank-details" element={<Navigate to="/auth" />} />
              <Route path="/stripe-redirect" element={<StripeRedirect />} />
              <Route path="/profile" element={<Navigate to="/auth" />} />
              <Route path="/changePassword" element={<Navigate to="/auth" />} />
            </>
          )}
        </Routes>

        {token && (
          <>
            <Navbar menuHandle={menuHandle} user={user} />
            <div className="d-flex">
              <Sidebar showSidebar={showSidebar} />
              <div className="w-100 px-0">
                {" "}
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route
                    path="/dashboard"
                    element={<Dashboard res_id={user.res_id} />}
                  />
                  <Route
                    path="/wallet"
                    element={<Wallet res_id={user.res_id} />}
                  />
                  <Route
                    path="/restaurant"
                    element={<EditRestaurant res_id={user.res_id} />}
                  />
                  <Route
                    path="/bank-details"
                    element={
                      <BankDetailsForm user={user} res_id={user.res_id} />
                    }
                  />
                  <Route
                    path="/stripe-redirect"
                    element={
                      <StripeRedirect user={user} res_id={user.res_id} />
                    }
                  />
                  <Route
                    path="/profile"
                    element={<ProfilePage userId={user.id} />}
                  />
                  <Route path="/changePassword" element={<ChangePassword />} />
                </Routes>
              </div>
            </div>
          </>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
