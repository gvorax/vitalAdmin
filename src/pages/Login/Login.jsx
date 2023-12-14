import React from "react";
import { useContext } from "react";
import { useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UseContext";
import "./LoginStyle.scss";

const Login = () => {
  const { signIn } = useContext(UserContext);
  const phoneRef = useRef("");
  const passRef = useRef("");
  const navigate = useNavigate();

  const onSend = async (e) => {
    e.preventDefault();
    let phone = Number(phoneRef.current.value);
    let password = passRef.current.value;

    if (phone !== "" && password !== "") {

      await signIn(phone,password);
      let token = await localStorage.getItem("token");

      if (token) {
        await navigate("/");
      } else {
        await navigate('/login')
      }
      
    } else {
      alert("To'ldirilmagan");
    }
  };

  return (
    <div className="login_bg">
      <div className="bg_blur">
        <div className="login_box">
          <div className="login_profile_img">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <form onSubmit={(e) => onSend(e)}>
            <div className="login_profile_input">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>

              <input
                type="number"
                placeholder="99 123 45 67"
                ref={phoneRef}
              />
            </div>
            <div className="login_profile_input">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="password"
                placeholder="Kodingizni kiriting"
                ref={passRef}
              />
            </div>
            <Link to="#">
              {" "}
              <button className="login_btn" onClick={(e) => onSend(e)}>
                Kirish
              </button>{" "}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
