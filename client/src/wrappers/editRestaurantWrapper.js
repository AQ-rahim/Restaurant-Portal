const { default: styled } = require("styled-components");

const Wrapper = styled.div`
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

  .profile-img {
    width: 140px;
    height: 140px;
    border-radius: 8px;
  }
  .image {
    position: relative;
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

  .edit-card {
    padding: 10px;
    border-radius: 8px;
  }

  .heading {
    margin-top: 20px;
  }
  .heading2 {
    margin-bottom: 20px;
    margin-top: 30px;
  }

  @media (max-width: 997px) {
    .edit-card {
      margin-bottom: 20px;
    }
    .heading {
      text-align: center;
    }
    .heading2 {
      text-align: center;
    }
  }
`;

export default Wrapper;
