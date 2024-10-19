import React, { useEffect, useState } from "react";
// import { CiCalendar } from "react-icons/ci";
// import { IoIosArrowDown } from "react-icons/io";
import { LuCupSoda } from "react-icons/lu";
import { BsCurrencyDollar, BsCardList } from "react-icons/bs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Wrapper from "../wrappers/dashboardWrapper";
import { url } from "../pages/url";

const Dashboard = ({ res_id }) => {
  // const [selectedOption, setSelectedOption] = useState("Day");
  const [filter, setFilter] = useState("daily");
  const [filteredEarnings, setFilteredEarnings] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [dashboard, setDashboard] = useState({
    menu: 0,
    orders: 0,
    earning: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${url}/dashboard/${res_id}`);
        const json = await response.json();
        setDashboard({
          menu: json.menus,
          orders: json.orders,
          earning: json.earning,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
      }
    };

    const fetchEarnings = async () => {
      try {
        const response = await fetch(`${url}/earnings/${res_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch earnings");
        }
        const data = await response.json();

        const formattedEarnings = data.map((earning) => ({
          ...earning,
          date: new Date(earning.date),
        }));
        setEarnings(data);
        filterEarnings(formattedEarnings, filter);
      } catch (error) {
        console.error("Error fetching earnings:", error);
      }
    };

    fetchDashboardData();
    fetchEarnings();
  }, [res_id]);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filterEarnings = (earningsData, selectedFilter) => {
    let filteredData = [];
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(startOfToday.getDate() + 1);

    switch (selectedFilter) {
      case "daily":
        filteredData = earningsData
          .filter(
            (earning) =>
              earning.date >= startOfToday && earning.date < endOfToday
          )
          .map((earning) => ({
            ...earning,
            time: new Date(`1970-01-01T${earning.time}`).toLocaleTimeString(
              "en-GB",
              { hour12: false }
            ),
            amount: parseFloat(earning.amount),
          }));
        break;

      case "weekly":
        const oneWeekAgo = new Date(startOfToday);
        oneWeekAgo.setDate(startOfToday.getDate() - 7);
        filteredData = earningsData.filter(
          (earning) => earning.date >= oneWeekAgo
        );
        const weeklyData = {};
        filteredData.forEach((earning) => {
          const date = new Date(earning.date).toISOString().split("T")[0];
          if (!weeklyData[date]) {
            weeklyData[date] = 0;
          }
          weeklyData[date] += parseFloat(earning.amount);
        });
        filteredData = Object.keys(weeklyData).map((date) => ({
          date: formatDate(new Date(date)),
          amount: weeklyData[date],
        }));
        break;

      case "monthly":
        const oneMonthAgo = new Date(startOfToday);
        oneMonthAgo.setMonth(startOfToday.getMonth() - 1);
        filteredData = earningsData.filter(
          (earning) => earning.date >= oneMonthAgo
        );
        const monthlyData = {};
        filteredData.forEach((earning) => {
          const month = `${earning.date.getFullYear()}-${String(
            earning.date.getMonth() + 1
          ).padStart(2, "0")}`;
          if (!monthlyData[month]) {
            monthlyData[month] = 0;
          }
          monthlyData[month] += parseFloat(earning.amount);
        });
        filteredData = Object.keys(monthlyData).map((month) => ({
          date: month,
          amount: monthlyData[month],
        }));
        break;

      default:
        filteredData = earningsData.map((earning) => ({
          ...earning,
          amount: parseFloat(earning.amount),
        }));
        break;
    }

    setFilteredEarnings(filteredData);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    filterEarnings(earnings, newFilter);
  };

  return (
    <Wrapper>
      <div className="container">
        <div className="row justify-content-between align-items-center mt-3">
          <div className="col-8">
            <h3>Dashboard</h3>
            <p className="text-secondary">Welcome to Onlyhalal..!</p>
          </div>
          {/* <div className="col-4">
            <div
              className="d-flex filter-card align-items-center"
              style={{ maxWidth: "260px" }}
            >
              <CiCalendar color="#f8971d" size={40} />
              <div className="ms-2">
                <p className="filter-card-text fw-bold">Filter Period</p>
                <small
                  className="filter-card-text text-secondary"
                  style={{ fontSize: "12px" }}
                >
                  4 June 2020 - 4 July 2020
                </small>
              </div>
              <IoIosArrowDown className="ms-3" color="#f8971d" size={18} />
            </div>
          </div> */}
        </div>
        <div className="row justify-content-center align-items-center mt-4">
          <div className="col-md-4">
            <div className="dashboard-card shadow">
              <div
                className="p-3 rounded-circle"
                style={{ backgroundColor: "#ffdfb2" }}
              >
                <LuCupSoda color="#f8971d" size={28} />
              </div>
              <div className="ms-3">
                <h3 className="fw-bold my-0">{dashboard.menu}</h3>
                <small className="text-secondary my-0">TOTAL MENUS</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card shadow">
              <div
                className="p-3 rounded-circle"
                style={{ backgroundColor: "#ffdfb2" }}
              >
                <BsCurrencyDollar color="#f8971d" size={28} />
              </div>
              <div className="ms-3">
                <h3 className="fw-bold my-0">${dashboard.earning}</h3>
                <small className="text-secondary my-0">TOTAL REVENUE</small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="dashboard-card shadow">
              <div
                className="p-3 rounded-circle"
                style={{ backgroundColor: "#ffdfb2" }}
              >
                <BsCardList color="#f8971d" size={28} />
              </div>
              <div className="ms-3">
                <h3 className="fw-bold my-0">{dashboard.orders}</h3>
                <small className="text-secondary my-0">TOTAL ORDER</small>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 shadow mt-4 rounded">
          <div className="row justify-content-between align-items-center">
            <div className="col-md-7">
              <h5>Order Analytics</h5>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <buttony
                className="btn mx-2 text-white"
                style={{
                  backgroundColor: filter === "daily" ? "#f8971d" : "#6c757d",
                  color: filter === "daily" ? "#fff" : "#000",
                }}
                onClick={() => handleFilterChange("daily")}
              >
                Daily
              </buttony>
              <button
                className="btn mx-2 text-white"
                style={{
                  backgroundColor: filter === "weekly" ? "#f8971d" : "#6c757d",
                  color: filter === "weekly" ? "#fff" : "#000",
                }}
                onClick={() => handleFilterChange("weekly")}
              >
                Weekly
              </button>
              <button
                className="btn mx-2 text-white"
                style={{
                  backgroundColor: filter === "monthly" ? "#f8971d" : "#6c757d",
                  color: filter === "monthly" ? "#fff" : "#000",
                }}
                onClick={() => handleFilterChange("monthly")}
              >
                Monthly
              </button>
            </div>
            <div className="mt-3" style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={filteredEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(tick) => {
                      if (filter === "daily") {
                        const date = new Date(`1970-01-01T${tick}Z`);
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleTimeString("en-GB", {
                            hour12: false,
                          });
                        }
                        return tick;
                      } else {
                        return tick;
                      }
                    }}
                  />

                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#F8971D"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* <div className="col-md-5">
              <div className="tab-group shadow">
                <input
                  type="radio"
                  id="day"
                  name="date-filter"
                  className=" hidden tab"
                  value="Day"
                  checked={selectedOption === "Day"}
                  onChange={handleOptionChange}
                />
                <label for="day" class="tab">
                  Day
                </label>

                <input
                  type="radio"
                  id="month"
                  name="date-filter"
                  className=" hidden tab"
                  value="Month"
                  checked={selectedOption === "Month"}
                  onChange={handleOptionChange}
                />
                <label for="month" class="tab">
                  Month
                </label>

                <input
                  type="radio"
                  id="today"
                  name="date-filter"
                  className=" hidden tab"
                  value="Today"
                  checked={selectedOption === "Today"}
                  onChange={handleOptionChange}
                />
                <label for="today" class="tab">
                  Today
                </label>
              </div>
            </div> */}
        </div>
      </div>
    </Wrapper>
  );
};

export default Dashboard;
