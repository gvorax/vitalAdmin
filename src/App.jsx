import { Route, Routes } from "react-router-dom";
import "./App.css";
import { UserContextProvider } from "./context/UseContext";
import Layout from "./layout/Layout";
import Login from "./pages/Login/Login";
import Menu from "./pages/Menu/Menu";
import Orders from "./pages/Orders/Orders";
import Users from "./pages/Users/Users";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="app">
      <UserContextProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="menu" element={<Menu />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </div>
  );
}

export default App;
