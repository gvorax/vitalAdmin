import React from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import { UserContext } from "../context/UseContext";

const Layout = () => {
  // const { user } = useContext(UserContext);
  let token = localStorage.getItem("token")

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
