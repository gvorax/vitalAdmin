import axios from "axios";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const UserContext = createContext();

export function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    name: "",
    phone_number: null,
  });

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("admin"));

    setUser(data);

    if (!data) {
      navigate("/login");
    }
  }, []);

  const signIn = async (phone, password) => {
    const pendingToastId = toast.info("Tekshirilmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });

    let response = null;
    response = await axios.post("https://vital.zirapcha.uz/api/admin/login", {
      phone_number: phone,
      password: password,
    });

    if (response.status == 201) {
      toast.update(pendingToastId, {
        render: "Muvaffaqiyatli o'tdi",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000, // Automatically close success toast after 3 seconds
      });

      const data = response.data.data.admin;

      const dataAdmin = {
        id: data._id,
        name: data.name,
        phone_number: data.phone_number,
      }
      
      sessionStorage.setItem("admin",JSON.stringify(dataAdmin));

      localStorage.setItem("token", response.data.data.token);

      setUser(dataAdmin);
    } else {
      toast.update(pendingToastId, {
        render: "Nomer yoki parol xato ...",
        type: toast.TYPE.ERROR,
        autoClose: 3000, // Automatically close error toast after 3 seconds
      });

      console.error("Login yoki parol xato");
    }
  };

  const signOut = () => {
    localStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, setUser, signIn, signOut }}>
      <div>{children} </div>
    </UserContext.Provider>
  );
}
