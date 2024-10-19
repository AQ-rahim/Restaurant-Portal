import styled from "styled-components";

const Wrapper = styled.main`
  height: 100vh;
  .oh-primary {
    color: #f8971d;
  }

  .logo {
    width: 220px;
    margin-top: 20px;
  }

  .oh-btn {
    background-color: #f8971d;
    color: white;
  }
  .oh-btn-sec {
    background-color: white;
    color: #f8971d;
    border-color: #f8971d;
  }

  .image {
    width: 100%;
  }

  /* OTPInput.css */
  .otp-input {
    border: none;
    border-bottom: 2px solid #f8971d;
    text-align: center;
    font-size: 16px;
    outline: none;
  }

  .otp-input-container {
    display: flex;
    justify-content: space-between;
  }

  .btn-back {
    box-shadow: 0px 0px 2px 1px #f8971d;
  }

  @media (max-width: 768px) {
    .image {
      display: none;
    }
    .logo {
      margin-bottom: 80px;
    }
  }
`;

export default Wrapper;
