import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import _ from "lodash";
import Header from "../../components/header/Header";
import "./OrderStyle.scss";
import OrderModal from "../../components/Modal/OrderModal";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [id, setId] = useState();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [filter, setFilter] = useState("");

  const getOrders = async () => {
    const res = await api.get("/api/order/all");
    let data = Object.assign(res.data.data.orders);

    await setOrders(data);
    setLoading(false);

  };

  const countFalseStatus = (dataArray) => {
    return dataArray.reduce((count, item) => {
      if (item.status === true) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const filterData = () => {
    const filtered = orders.filter((item) => {
      const matchesFilter =
        item?.name?.toLowerCase().includes(filter.toLowerCase()) ||
        item?.phone_number?.toString().includes(filter);

      if (statusFilter === "all") {
        return matchesFilter;
      } else {
        return matchesFilter && item.status === (statusFilter === "active");
      }
    });

    setFilteredData(filtered);
  };

  const countTrueStatus = (dataArray) => {
    return dataArray.reduce((count, item) => {
      if (item.status === false) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  useEffect(() => {
    getOrders();
    const intervalId = setInterval(() => {
      getOrders();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [modal]);

  useEffect(() => {
    filterData();
  }, [filter, statusFilter, orders]);

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  function convertUtcToTashkentTime(utcDateString) {
    const utcDate = new Date(utcDateString);
    const tashkentOffset = 5 * 60; // Tashkent is UTC+5

    const tashkentTime = new Date(
      utcDate.getTime() + tashkentOffset * 60 * 1000
    );
    return tashkentTime;
  }

  const calculateTime = (items) => {
    const item = convertUtcToTashkentTime(items.created_at).toISOString();

    const regex = /\d+(\.\d+)?/g;
    const numbersArray = item?.match(regex);

    if (numbersArray) {
      let year = numbersArray.slice(0, 1);
      let month = numbersArray.slice(1, 2);
      let day = numbersArray.slice(2, 3);
      let hour = numbersArray.slice(3, 4);
      let min = numbersArray.slice(4, 5);
      return `${hour}:${min}  ${day}.${month}.${year}`;
    }

    return [];
  };

  const handleCancelDelete = () => {
    setId(null);
    setModal(false);
  };

  const handleDeleteClick = (id) => {
    setId(id);
    setModal(true);
  };

  const handleConfirmDelete = async () => {
    const pendingToastId = toast.info("O'chirilmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });
    try {
      await api.delete(`/api/order/${id}`);
      await toast.update(pendingToastId, {
        render: "Muvaffaqiyatli o'chirildi",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000, // Automatically close success toast after 3 seconds
      });
      // Refresh the user list after deletion
      const res = await api.get("/api/order/all");
      let data = Object.assign(res.data.data.orders);

      await setOrders(data);
    } catch (error) {
      toast.update(pendingToastId, {
        render: "Nimadir xato ketdi...",
        type: toast.TYPE.ERROR,
        autoClose: 3000, // Automatically close error toast after 3 seconds
      });
    }

    setModal(false);
    setId(null);
  };

  return (
    <div className="order_section">
      <Header title="Buyurtmalar" />
      <div className="order_details">
        <h2>Kunlik buyurtmalar</h2>
        <div className="order_stat">
          <div className="stat_item">
            <div className="stat_img">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="46"
                viewBox="0 0 40 46"
                fill="none"
              >
                <path
                  d="M31.4286 14.2857V11.4286C31.4286 5.12679 26.3017 0 20 0C13.6982 0 8.57143 5.12679 8.57143 11.4286V14.2857H0V38.5714C0 42.5163 3.19795 45.7143 7.14286 45.7143H32.8571C36.8021 45.7143 40 42.5163 40 38.5714V14.2857H31.4286ZM14.2857 11.4286C14.2857 8.27768 16.8491 5.71429 20 5.71429C23.1509 5.71429 25.7143 8.27768 25.7143 11.4286V14.2857H14.2857V11.4286ZM28.5714 22.1429C27.3879 22.1429 26.4286 21.1835 26.4286 20C26.4286 18.8165 27.3879 17.8571 28.5714 17.8571C29.7549 17.8571 30.7143 18.8165 30.7143 20C30.7143 21.1835 29.7549 22.1429 28.5714 22.1429ZM11.4286 22.1429C10.2451 22.1429 9.28571 21.1835 9.28571 20C9.28571 18.8165 10.2451 17.8571 11.4286 17.8571C12.6121 17.8571 13.5714 18.8165 13.5714 20C13.5714 21.1835 12.6121 22.1429 11.4286 22.1429Z"
                  fill="#FEB21D"
                />
              </svg>
            </div>
            <div className="stat_details">
              <p className="stat_title">{orders.length}</p>
              <p className="stat_subtitle">Buyurtmalar</p>
            </div>
          </div>
          <div className="stat_item ">
            <div className="stat_img item_second">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="47"
                height="49"
                viewBox="0 0 47 49"
                fill="none"
              >
                <path
                  d="M31.4286 14.2857V11.4286C31.4286 5.12679 26.3017 0 20 0C13.6982 0 8.57143 5.12679 8.57143 11.4286V14.2857H0V38.5714C0 42.5163 3.19795 45.7143 7.14286 45.7143H32.8571C36.8021 45.7143 40 42.5163 40 38.5714V14.2857H31.4286ZM14.2857 11.4286C14.2857 8.27768 16.8491 5.71429 20 5.71429C23.1509 5.71429 25.7143 8.27768 25.7143 11.4286V14.2857H14.2857V11.4286ZM28.5714 22.1429C27.3879 22.1429 26.4286 21.1835 26.4286 20C26.4286 18.8165 27.3879 17.8571 28.5714 17.8571C29.7549 17.8571 30.7143 18.8165 30.7143 20C30.7143 21.1835 29.7549 22.1429 28.5714 22.1429ZM11.4286 22.1429C10.2451 22.1429 9.28571 21.1835 9.28571 20C9.28571 18.8165 10.2451 17.8571 11.4286 17.8571C12.6121 17.8571 13.5714 18.8165 13.5714 20C13.5714 21.1835 12.6121 22.1429 11.4286 22.1429Z"
                  fill="#0578F6"
                />
                <circle cx="36.5" cy="38.5" r="10.5" fill="#CCE5FF" />
                <path
                  d="M36.75 30C35.0194 30 33.3277 30.5132 31.8888 31.4746C30.4498 32.4361 29.3283 33.8027 28.6661 35.4015C28.0038 37.0004 27.8305 38.7597 28.1681 40.457C28.5058 42.1544 29.3391 43.7135 30.5628 44.9372C31.7865 46.1609 33.3456 46.9942 35.043 47.3319C36.7403 47.6695 38.4996 47.4962 40.0985 46.8339C41.6973 46.1717 43.0639 45.0502 44.0254 43.6112C44.9868 42.1723 45.5 40.4806 45.5 38.75C45.5 37.6009 45.2737 36.4631 44.834 35.4015C44.3942 34.3399 43.7497 33.3753 42.9372 32.5628C42.1247 31.7503 41.1601 31.1058 40.0985 30.6661C39.0369 30.2263 37.8991 30 36.75 30ZM40.25 39.625H36.75C36.5179 39.625 36.2954 39.5328 36.1313 39.3687C35.9672 39.2046 35.875 38.9821 35.875 38.75V35.25C35.875 35.0179 35.9672 34.7954 36.1313 34.6313C36.2954 34.4672 36.5179 34.375 36.75 34.375C36.9821 34.375 37.2046 34.4672 37.3687 34.6313C37.5328 34.7954 37.625 35.0179 37.625 35.25V37.875H40.25C40.4821 37.875 40.7046 37.9672 40.8687 38.1313C41.0328 38.2954 41.125 38.5179 41.125 38.75C41.125 38.9821 41.0328 39.2046 40.8687 39.3687C40.7046 39.5328 40.4821 39.625 40.25 39.625Z"
                  fill="#0578F6"
                />
              </svg>
            </div>
            <div className="stat_details">
              <p className="stat_title">
                {loading ? 0 : countFalseStatus(orders)}
              </p>
              <p className="stat_subtitle">Qabul qilinganlar</p>
            </div>
          </div>
          <div className="stat_item">
            <div className="stat_img item_third">
              <svg
                width="62"
                height="35"
                viewBox="0 0 62 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.857 24.3384C19.9646 24.3384 17.7071 26.6664 17.7071 29.4883C17.7071 32.3101 19.9646 34.6382 22.857 34.6382C25.7493 34.6382 28.0068 32.3101 28.0068 29.4883C28.0068 26.6664 25.6788 24.3384 22.857 24.3384ZM22.857 32.0985C21.446 32.0985 20.2467 30.8992 20.2467 29.4883C20.2467 28.0774 21.446 26.9486 22.857 26.9486C24.2679 26.9486 25.3966 28.0774 25.3966 29.4883C25.3966 30.8992 24.2679 32.0985 22.857 32.0985ZM61.7279 20.5289V26.0315C61.7279 27.3719 60.5991 28.5006 59.1882 28.5006H56.578C56.0842 25.185 53.2623 22.6453 49.8056 22.6453C46.3488 22.6453 43.527 25.185 43.0332 28.5006H29.5588C29.1356 25.185 26.2432 22.6453 22.857 22.6453C19.4002 22.6453 16.5783 25.185 16.0845 28.5006H12.7689C11.4285 28.5006 10.2997 27.3719 10.2997 26.0315V20.5289H61.7279ZM49.8056 24.3384C46.9837 24.3384 44.6557 26.6664 44.6557 29.4883C44.6557 32.3101 46.9837 34.6382 49.8056 34.6382C52.6274 34.6382 54.9555 32.3101 54.9555 29.4883C54.9555 26.6664 52.6274 24.3384 49.8056 24.3384ZM49.8056 32.0985C48.3947 32.0985 47.2659 30.8992 47.2659 29.4883C47.2659 28.0774 48.3947 26.9486 49.8056 26.9486C51.2165 26.9486 52.4158 28.0774 52.4158 29.4883C52.4158 30.8992 51.2165 32.0985 49.8056 32.0985ZM60.7402 14.9558L50.9343 5.29096C50.2994 4.72659 49.5234 4.37386 48.6063 4.37386H43.6681V2.53966C43.6681 1.12874 42.6099 0 41.199 0H12.7689C11.4285 0 10.2997 1.12874 10.2997 2.53966V2.89239L0.211638 4.09168L18.0598 6.4197L0 8.18335L17.9893 10.723L0 12.3456L10.2997 14.2503V19.118H61.6573V17.3544C61.7279 16.4373 61.3046 15.5907 60.7402 14.9558ZM56.4369 15.3085H46.9837C46.7721 15.3085 46.631 15.0969 46.631 14.8852V7.61899C46.631 7.40735 46.7721 7.26625 46.9837 7.26625H48.8179C48.8885 7.26625 49.0296 7.26625 49.1001 7.3368L56.7191 14.6031C57.0013 14.8852 56.7897 15.3085 56.4369 15.3085Z"
                  fill="#01BCAD"
                />
              </svg>
            </div>
            <div className="stat_details">
              <p className="stat_title">
                {loading ? 0 : countTrueStatus(orders)}
              </p>
              <p className="stat_subtitle">Yo'lga chiqilgan</p>
            </div>
          </div>
        </div>
      </div>

      <div className="order_table">
        <div className="order_button">
          <input
            type="text"
            placeholder="Ism yoki raqam orqali qidirish"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="all">Hammasi</option>
            <option value="active">Qabul qilinganlar</option>
            <option value="inactive">Yuborilganlar</option>
          </select>
        </div>
        <div className="table">
          <div className="thead">
            <div className="tr">
              <div className="th">Id</div>
              <div className="th">Ism/Familiya</div>
              <div className="th">Telefon raqam</div>
              <div className="th">Vaqt</div>
              <div className="th">Status</div>
              <div className="th">Mahsulot</div>
              <div className="th">Jami</div>
            </div>
          </div>
          <div className="tbody">
            {loading && <div className="loading">Yuklanmoqda...</div>}
            {filteredData?.length ? filteredData?.map((item, index) => (
              <div
                className="tr"
                key={index}
                onClick={() => handleDeleteClick(item._id)}
              >
                <div className="td">{index + 1}</div>
                <div className="td">
                  <Tooltip title={item?.name}>
                    <span>{_.truncate(item?.name, { length: 13 })}</span>
                  </Tooltip>
                </div>
                <div className="td">
                  <Tooltip title={item?.phone_number}>
                    <a>{_.truncate(item?.phone_number, { length: 13 })}</a>
                  </Tooltip>
                </div>
                <div className="td">
                  <Tooltip title={calculateTime(item)}>
                    <span>
                      {_.truncate(calculateTime(item), { length: 10 })}
                    </span>
                  </Tooltip>
                </div>
                <div className="td">
                  {item?.status ? (
                    <p className="red">Qabul qilingan</p>
                  ) : (
                    <p className="green">Yuborilgan</p>
                  )}
                </div>
                <div className="td">
                  {item?.product_id?.name ? (
                    <Tooltip title={item?.product_id?.name}>
                      <span>
                        {_.truncate(item?.product_id?.name, { length: 17 })}
                      </span>
                    </Tooltip>
                  ) : (
                    <p>Mavjud emas</p>
                  )}
                </div>
                <div className="td">{item?.product_id?.price ? item?.product_id?.price : '0'}</div>
              </div>
            )):<p style={{textAlign:"center",fontSize:"22px"}}> {!loading ? 'Zakazlar mavjud emas':''}  </p>}
          </div>
        </div>
      </div>

      {modal && (
        <OrderModal
          id={id}
          onCancel={handleCancelDelete}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Orders;
