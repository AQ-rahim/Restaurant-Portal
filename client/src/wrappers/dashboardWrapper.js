import styled from "styled-components";

const Wrapper = styled.div`
  .oh-primary {
    color: #f8971d;
  }
  .oh-btn {
    background-color: #f8971d;
    color: white;
  }

  .filter-card {
    padding: 10px 15px;
    border-radius: 10px;
    background-color: #f9b157;
  }
  .filter-card-text {
    margin: 0;
  }

  .dashboard-card {
    display: flex;
    padding: 20px;
    border-radius: 8px;
  }

  .tab-group {
    padding: 10px;
    display: flex;
    border-radius: 10px;
  }

  .tab {
    flex: 1;
    padding: 6px 12px;
    text-align: center;
    background: white;
    color: #566573;
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 10px;
    margin-left: 4px;
    transition: background 0.3s ease;
  }

  .tab:not(:last-child) {
  }

  .tab:checked,
  .tab:checked + label {
    background: #808b96;
    color: white;
  }

  .tab:checked {
    -webkit-appearance: none;
  }

  label {
    cursor: pointer;
  }

  .hidden {
    display: none;
  }

  .table-card {
    position: relative;
    margin-top: 30px;
    padding: 20px;
    border-radius: 8px;
  }

  .status {
    padding: 10px 20px;
    color: white;
    border-radius: 8px;
  }

  .wallet-card {
    background-color: #f9b157;
    padding: 20px;
    border-radius: 8px;
  }

  @media (max-width: 992px) {
    .logo {
      margin: 0px 0px 0px 10px;
    }
    .sidebar {
      display: none;
    }
    .mobile-sidebar {
      width: 250px;
      display: block;
      min-height: 100%;
      background-color: #f9b157;
      padding-right: 10px;
      padding-top: 10px;
      transition: 0.5s ease-in-out;
    }
    .offcanvas {
      width: 250px;
    }
    .menu-bar {
      display: none;
    }
    .menu-bar-mobile {
      display: block;
      margin-left: 30px;
    }
  }
`;

export default Wrapper;
