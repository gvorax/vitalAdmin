import React from "react";
import "./HeaderStyle.scss";
import Image from "../../assets/vital_logo.png";
const Header = ({title}) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <div className="header_img">
        <img src={Image} alt="" />
      </div>
    </div>
  );
};

export default Header;
