import React, { useState } from "react";
import Header from "../../components/header/Header";
import "../Orders/OrderStyle.scss";
import { Tooltip } from "antd";
import _ from "lodash";
import { api } from "../../api/api";
import DeleteModal from "../../components/Modal/DeleteModal";
import { useEffect } from "react";
import { toast } from "react-toastify";
const Users = () => {
  const [modal, setModal] = useState(false);
  const [num, setNum] = useState();
  const [usersMap, setUsersMap] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/order/all");
      setUsersMap(response.data.data.orders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filterData = () => {
    const filtered = usersMap?.filter((item) => {
      return (
        item?.name.toLowerCase().includes(filter.toLowerCase()) ||
        item?.phone_number.toString().includes(filter)
      );
    });
    setFilteredData(filtered);
  };

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(() => {
      fetchUsers(); // Fetch data every 5 seconds
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    filterData();
  }, [filter, usersMap]);

  const handleDeleteClick = (userId) => {
    setNum(userId);
    setModal(true);
  };

  const handleCancelDelete = () => {
    setNum(null);
    setModal(false);
  };

  const handleConfirmDelete = async () => {
    const pendingToastId = toast.info("O'chirilmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });
    try {
      await api.delete(`/api/order/${num}`);
      await toast.update(pendingToastId, {
        render: "Muvaffaqiyatli o'chirildi",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000, // Automatically close success toast after 3 seconds
      });
      // Refresh the user list after deletion
      const response = await api.get("/api/order/all");
      setUsersMap(response.data.data.orders);
    } catch (error) {
      toast.update(pendingToastId, {
        render: "Nimadir xato ketdi...",
        type: toast.TYPE.ERROR,
        autoClose: 3000, // Automatically close error toast after 3 seconds
      });
    }

    setModal(false);
    setNum(null);
  };

  return (
    <div className="order_section">
      <Header title="Mijozlar" />
      <div className="order_details">
        <h2>Mijozlar</h2>

        <div className="order_table">
          <div className="order_search">
            <label>Ism yoki telefon raqam orqali qidirish</label>
            <input
              type="text"
              placeholder="Raqam yoki Ism"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="table user_table">
            <div className="thead users">
              <div className="tr">
                <div className="th">Id</div>
                <div className="th">Ism/Familiya</div>
                <div className="th">Telefon raqami</div>
                <div className="th">Holat</div>
              </div>
              <div className="tbody users">
                {loading && <p className="loading">Yuklanmoqda</p>}

                {filteredData.length ? filteredData.map((item, index) => (
                  <div className="tr" key={index}>
                    <div className="td">
                     {index+1 }
                    </div>
                    <div className="td">
                      <Tooltip title={item.name}>
                        <span>{_.truncate(item.name, { length: 13 })}</span>
                      </Tooltip>
                    </div>
                    <div className="td">
                      <a href={`tel:+998${item.phone_number}`}>
                        {" "}
                        {item.phone_number}
                      </a>
                    </div>
                    <div className="td">
                      <p
                        style={{ color: "red" }}
                        onClick={() => handleDeleteClick(item._id)}
                      >
                        O'chirish
                      </p>
                    </div>
                  </div>
                )):<p style={{textAlign:"center",fontSize:"22px"}}> {!loading ? 'Mijozlar mavjud emas':null}  </p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {modal && (
        <DeleteModal
          onCancel={handleCancelDelete}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Users;
