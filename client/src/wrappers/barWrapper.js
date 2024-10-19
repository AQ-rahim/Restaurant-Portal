import styled from "styled-components";

const Wrapper = styled.div`
  .oh-primary {
    color: #f8971d;
  }
  .oh-btn {
    background-color: #f8971d;
    color: white;
  }

  .logo {
    width: 150px;
    margin: 0px 0px 0px 40px;
  }

  .sidebar {
    width: 250px;
    min-height: 100vh;
    padding-right: 10px;
    padding-top: 10px;
    background-color: #f9b157;
    transition: 0.5s ease-in-out;
  }
  .mobile-sidebar {
    display: none;
  }

  .sidebar.hide {
    display: none;
  }
  .list-container {
    list-style: none;
  }

  .list {
    position: relative;
    font-size: 16px;
    padding: 16px;
    color: #454545;
    font-weight: 500;
    margin: 10px 0;
    transition: 0.5s ease;
  }

  .list:after {
    content: "";
    position: absolute;
    top: 0;
    left: 100%;
    width: 5px;
    height: 56px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    background-color: #f9b157;
    transition: all 0.5s ease;
  }

  .list:hover:after {
    background-color: #f8971d;
    left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .list:hover {
    cursor: pointer;
    background-color: white;
    color: #f8971d;
  }

  .list.active:after {
    background-color: #000;
    left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }
  .list.active {
    background-color: white;
    color: #f8971d;
  }

  .navbar {
    background: #f9b157;
    right: 0;
    padding: 20px 5px;
  }

  .profile {
    display: flex;
    position: relative;
  }

  .profile-title {
    margin: 0;
    border-radius: 6px;
    padding: 10px;
    background: #454545;
    color: white;
  }

  .menu-bar {
    display: block;
    margin-left: 50px;
  }
  .menu-bar-mobile {
    display: none;
  }
`;

export default Wrapper;
