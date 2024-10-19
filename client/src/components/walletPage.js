import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import Wrapper from "../wrappers/dashboardWrapper";
import { url } from "../pages/url";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Wallet = ({ res_id }) => {
  const [walletData, setWalletData] = useState([]);
  const [payment, setPayment] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => setShowModal(false);

  const handleShow = () => {
    const availableBalance = walletData.reduce((acc, item) => {
      return item.status === 1 ? acc + parseFloat(item.balance) : acc;
    }, 0);

    if (availableBalance === 0) {
      toast.error("No available balance to withdraw!");
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walletResponse = await fetch(`${url}/resWallet/${res_id}`);
        const walletData = await walletResponse.json();
        setWalletData(walletData.data);

        const paymentResponse = await fetch(`${url}/fetchPayment/${res_id}`);
        const paymentData = await paymentResponse.json();
        setPayment(paymentData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [res_id]);

  const handleWithdrawRequest = async (event) => {
    event.preventDefault();

    const withdrawAmountNum = parseFloat(withdrawAmount);

    const availableBalance = walletData.reduce((acc, item) => {
      return item.status === 1 ? acc + parseFloat(item.balance) : acc;
    }, 0);

    if (withdrawAmountNum > availableBalance) {
      toast.error("Withdrawal amount can't exceed available balance");
      return;
    }

    try {
      const response = await fetch(`${url}/resWithdraw/${res_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: withdrawAmountNum,
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast.success("Withdrawal request sent successfully!");
        setWalletData((prevWalletData) =>
          prevWalletData.map((item) =>
            item.status === 1
              ? {
                  ...item,
                  balance: (
                    parseFloat(item.balance) - withdrawAmountNum
                  ).toFixed(2),
                }
              : item
          )
        );
      } else {
        throw new Error("Failed to send withdrawal request.");
      }
    } catch (error) {
      console.error("Error sending withdrawal request:", error);
      toast.error("Error sending withdrawal request.");
    }
  };

  const filteredPayments = payment.filter((data, index) => {
    const paymentNumber = index + 1;
    return (
      paymentNumber.toString().includes(searchTerm) ||
      data.withdrawal_amount.toString().includes(searchTerm)
    );
  });

  return (
    <Wrapper>
      <ToastContainer />
      <div className="container">
        <div
          className="row justify-content-between mt-3"
          style={{ height: "100vh" }}
        >
          <div className="col-md-12">
            <h2>Wallet</h2>
            <div className="mt-4">
              <p>
                To request a withdrawal, click on the "Available" box and enter
                the amount you wish to withdraw.
              </p>
            </div>
            <div className="row justify-content-center align-items-center">
              {walletData ? (
                walletData.map((item, index) => (
                  <div className="col-4" key={index}>
                    <div
                      className="card-body rounded rounded-3 p-4"
                      style={{
                        backgroundColor:
                          item.status === 0
                            ? "#F8971D"
                            : item.status === 1
                            ? "#16D582"
                            : "#E74C3C",
                      }}
                      onClick={item.status === 1 ? handleShow : null}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="text-white my-0 text-secondary">
                          {item.status === 0
                            ? "Pending"
                            : item.status === 1
                            ? "Available"
                            : "Dispute"}
                        </p>
                        <h3 className="text-white my-0">${item.balance}</h3>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No wallet data available</p>
              )}
            </div>

            <div className="table-card shadow">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5>Payment History</h5>
                <input
                  className="form-control w-50"
                  type="text"
                  placeholder="Search by # or Amount"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Transfer ID</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Date</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((data, index) => (
                    <tr key={data.id} className="align-middle">
                      <td>{index + 1}</td>
                      <td>{data.transfer_id}</td>
                      <td>${data.withdrawal_amount}</td>
                      <td>{data.withdrawal_date.split("T")[0]}</td>
                      <td className="py-3">
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              data.status === 0
                                ? "#F8971D"
                                : data.status === 1
                                ? "#16D582"
                                : "#E74C3C",
                          }}
                        >
                          {data.status === 0
                            ? "Pending"
                            : data.status === 1
                            ? "Completed"
                            : "Dispute"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex align-content-center justify-content-end">
                <p className="btn bg-secondary text-white mx-2 my-0">
                  Previous
                </p>
                <p
                  className="px-3 py-2 rounded-2 my-0"
                  style={{ background: "#ABB2B9" }}
                >
                  1
                </p>
                <p className="btn bg-secondary text-white mx-2 my-0">Next</p>
              </div>
            </div>
          </div>

          <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Request Withdrawal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form onSubmit={handleWithdrawRequest}>
                <input
                  type="number"
                  className="form-control mb-4 rounded-1"
                  placeholder="Enter Amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />

                <Button variant="warning" type="submit" onClick={handleClose}>
                  <p className="text-white m-0">Withdrawal</p>
                </Button>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </Wrapper>
  );
};

export default Wallet;
