import styled from "styled-components";

const Wrapper = styled.main`
  height: 100vh;
  .oh-primary {
    color: #f8971d;
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
  .profile-card {
    padding: 20px;
    border-radius: 8px;
    margin: 0px 20px 0px 20px;
  }
  .image {
    position: relative;
  }
  .profile-img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }
  .file-upload {
    position: absolute;
    top: -5%;
    left: 85%;
    overflow: hidden;
    cursor: pointer;
    padding: 10px;
    background-color: #f8971d;
    color: #fff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
  }
  .edit-icon {
    position: absolute;
    top: 25%;
    left: 25%;
  }

  .file-upload input[type="file"] {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    width: 30px;
    height: 30px;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .profile-card {
      margin-top: 10px;
    }
  }
`;

export default Wrapper;
