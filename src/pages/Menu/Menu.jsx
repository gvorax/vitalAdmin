import React from "react";
import Header from "../../components/header/Header";
import "./MenuStyle.scss";
import { useState, useRef } from "react";
import MenuX from "../../components/Modal/MenuX";
import { toast } from "react-toastify";
import EditModal from "../../components/Modal/EditModal";
import { useEffect } from "react";
import { api } from "../../api/api";
import DeleteModal from "../../components/Modal/DeleteModal";

const Menu = () => {
  const [modal, setModal] = useState(false);
  const [modalX, setModalX] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [product, setProduct] = useState([]);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true)
    const getData = async () => {
      let response = await api.get("/api/product/all");

      setProduct(response.data.data.products);
      setLoading(false)
    };

    getData();
  }, [modal, editModal]);

  const handleDeleteClick = (id) => {
    setId(id);
    setModalX(true);
  };

  const handleCancelDelete = () => {
    setId(null);
    setModalX(false);
  };

  const handleConfirmDelete = async () => {
    const pendingToastId = toast.info("O'chirilmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });
    try {
      await api.delete(`https://vital.zirapcha.uz/api/product/${id}`);

      toast.update(pendingToastId, {
        render: "Muvaffaqiyatli o'chirildi",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000, // Automatically close success toast after 3 seconds
      });
      // Refresh the user list after deletion
      const response = await api.get("/api/product/all");
      setProduct(response.data.data.products);
    } catch (error) {
      toast.update(pendingToastId, {
        render: "Nimadir xato ketdi...",
        type: toast.TYPE.ERROR,
        autoClose: 3000, // Automatically close error toast after 3 seconds
      });
    }

    setModalX(false);
    setId(null);
  };

  const editChange = (idx) => {
    setEditModal(true);
    setId(idx);
  };

  return (
    <div className="menu_section">
      <Header title="Mahsulotlar" />
      <div className="menu">
        {!product.length && loading && <p className="loading">Yuklanmoqda...</p> }

        {!loading && !product.length ? (
          <p style={{textAlign:"center",fontSize:"22px"}}> Mahsulot qolmagan</p>
        ) : (
          <>
            {product.map((item, index) => (
              <div className="menu_box" key={index}>
                <div className="box_img">
                  <img
                    src={`https://vital.zirapcha.uz/api/api/file/${item.images[0]}`}
                    alt=""
                  />
                </div>
                <div className="item_edit" onClick={() => editChange(item._id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </div>

                <h2>{item.name}</h2>
                <div className="menu_detail">
                  <p><b>Narx:</b> {item.price}</p>
                  <p className="pro_desc"><b>Izoh:</b> {item.description.uzb}</p>
                  {/* <p>Soni: {item.number}</p> */}

                  <div
                    className="item_delete"
                    onClick={() => handleDeleteClick(item._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        <div className="menu_add">
          <button onClick={() => setModal(true)}>Add menu</button>
        </div>
      </div>

      {modal && <MenuX setModal={setModal} />}
      {editModal && (
        <EditModal
          setEditModal={setEditModal}
          setProduct={setProduct}
          product={product}
          id={id}
        />
      )}
      {modalX && (
        <DeleteModal
          onCancel={handleCancelDelete}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Menu;
