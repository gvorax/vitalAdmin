import React, { useState } from "react";
import "./ModalStyle.css";
import { Button, Modal, Input, Space } from "antd";
import { useContext } from "react";
import { UserContext } from "../../context/UseContext";
import { api } from "../../api/api";
import { toast } from "react-toastify";
const ModalProfile = ({ isModalOpen, setIsModalOpen }) => {
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({
    name: "",
    number: "",
    password: "",
  });

  const handleCancel = () => {
    setIsModalOpen(false);
    setData({
      name: "",
      number: "",
      password: "",
    });
  };
  const handleOk = async (e) => {
    e.preventDefault();
    setIsModalOpen(false);

    const pendingToastId = toast.info("Tekshirilmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });

    let response = await api.patch(`/api/admin/${user.id}`, {
      name: data.name,
      phone_number: Number(data.number),
      password: data.password,
    });

    if (response.status == 200) {
      toast.update(pendingToastId, {
        render: "Muvaffaqiyatli o'zgartirildi!",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000, // Automatically close success toast after 3 seconds
      });
    }else{
      toast.update(pendingToastId, {
        render: "Nimadir xato ketdi...",
        type: toast.TYPE.ERROR,
        autoClose: 3000, // Automatically close error toast after 3 seconds
      });
    }

    setUser({
      id: user.id,
      name: data.name,
      password: data.password,
      number: data.number,
    });

    setData({
      name: "",
      number: "",
      password: "",
    });
  };

  const onChangeInput = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Modal
        title="Ma'lumotlarni o'zgartirish"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div>
          <Input
            placeholder="Ismingizni kiriting"
            className="modal_input"
            value={data.name}
            name="name"
            onChange={onChangeInput}
          />
          <Input
            placeholder="99 999 99 99"
            type="number"
            className="modal_input"
            value={data.number}
            name="number"
            onChange={onChangeInput}
          />
          <Space direction="vertical">
            <Input.Password
              placeholder="Parolni kiriting"
              className="modal_input"
              value={data.password}
              name="password"
              onChange={onChangeInput}
            />
          </Space>
        </div>
      </Modal>
    </>
  );
};
export default ModalProfile;
