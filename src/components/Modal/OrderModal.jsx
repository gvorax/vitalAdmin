import React, { useState } from "react";
import { useEffect } from "react";
import { api } from "../../api/api";
import "./MenuStyle.scss";
import { toast } from "react-toastify";

const OrderModal = ({ onCancel, onDelete, id }) => {
  const [item, setItem] = useState();
  const [product, setProduct] = useState([]);
  const [selectItem, setSelectItem] = useState();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      let data = await api.get(`/api/order/${id}`);

      const info = Object.assign(data.data.data.order);

      setItem(info);

      setSelectItem({
        product_id: info?.product_id,
        status: info?.status,
        comment: info?.comment,
      });
    };

    const getFood = async () => {
      let response = await api.get("/api/product/all");
      const info = Object.assign(response.data.data.products);
      setProduct(info);
    };

    getUser();
    getFood();
  }, []);

  const extractNumbersFromString = (item) => {
    const regex = /\d+(\.\d+)?/g; // Regular expression to match numbers (including decimals)
    const str = item?.food_id?.price;
    const numbersArray = str?.match(regex);

    if (numbersArray) {
      let price = numbersArray.map(Number); // Convert the matched strings to actual numbers
      let number = item.number;

      if (price[0] * number > 999) {
        let num = (price[0] * number) / 1000;
        return `${num} mln so'm`;
      } else {
        return `${price[0] * number} ming so'm`;
      }
    }

    return [];
  };

  const calculateTime = (items) => {
    const regex = /\d+(\.\d+)?/g;
    const str = items?.created_at;
    const numbersArray = str?.match(regex);

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

  const handleChangeProduct = (e) => {
    if(e.target.name == "product_id"){
      setSelectItem({ ...selectItem, product_id:{
        ...selectItem.product_id,
        _id:e.target.value
      }});
    }else{
      setSelectItem({ ...selectItem, [e.target.name]: e.target.value });
    }
  };

  const handleSave = async () => {
    const pendingToastId = toast.info("O'zgartirilmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });
    try {
      let res = await api.patch(`/api/order/${id}`, selectItem);
      await toast.update(pendingToastId, {
        render: "Muvaffaqiyatli o'zgartirildi",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000, // Automatically close success toast after 3 seconds
      });

      setDisabled(true);
    } catch (error) {
      toast.update(pendingToastId, {
        render: "Nimadir xato ketdi...",
        type: toast.TYPE.ERROR,
        autoClose: 3000, // Automatically close error toast after 3 seconds
      });
    }
  };

  const onSubmit = async () => {
    const pendingToastId = toast.info("Yuborilmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });

      try {
        let data = {
          ...selectItem,
          status: false,
        };
        let info = await api.patch(`/api/order/${id}`, JSON.stringify(data));
        onCancel();
        await toast.update(pendingToastId, {
          render: "Yuborildi!",
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
        });
      } catch (error) {
        toast.update(pendingToastId, {
          render: "Nimadir xato ketdi...",
          type: toast.TYPE.ERROR,
          autoClose: 3000,
        });
      }
    
  };

  const onAbort = async () => {
    const pendingToastId = toast.info("Bekor qilinmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });

      try {
        let data = {
          ...selectItem,
          status: true,
        };

        let info = await api.patch(`/api/order/${id}`, JSON.stringify(data));
        onCancel();
        await toast.update(pendingToastId, {
          render: "Bekor qilindi",
          type: toast.TYPE.SUCCESS,
          autoClose: 3000,
        });
      } catch (error) {
        toast.update(pendingToastId, {
          render: "Nimadir xato ketdi...",
          type: toast.TYPE.ERROR,
          autoClose: 3000,
        });
      }
  };

  return (
    <div className="menu_model" onClick={onCancel}>
      <div className="modal_box" onClick={(e) => e.stopPropagation()}>
        <div className="buttons">
          <form>
            <label>Mijoz ismi:</label>
            <input
              type="text"
              defaultValue={item?.name}
              disabled={true}
            />

            <label>Buyurtma qabul qilingan vaqt:</label>
            <input
              type="text"
              defaultValue={calculateTime(item)}
              disabled={true}
            />

            <label>Mahsulot nomi:</label>
            <select
              value={selectItem?.product_id?._id}
              onChange={(e) => handleChangeProduct(e)}
              disabled={disabled}
              name="product_id"
            >
              <option disabled>Select a product</option>
              {product?.map((items, index) => (
                <option value={items?._id} key={index}>
                  {items?.name}
                </option>
              ))}
            </select>

            <label>Jami:</label>
            <input
              type="text"
              defaultValue={item?.product_id?.price}
              disabled={true}
            />

            <label>Comment</label>
            <textarea
              name="comment"
              onChange={(e) => handleChangeProduct(e)}
              required={true}
              value={selectItem?.comment}
            />
          </form>

          <div className="flex">
            {disabled ? (
              <button onClick={() => setDisabled(false)} className="edit">
                {" "}
                O'zgartirish
              </button>
            ) : (
              <button className="save" onClick={() => handleSave()}>
                Saqlash
              </button>
            )}
          </div>

          <div className="flex">
            <button onClick={onCancel} className="quit">
              Ortga
            </button>
            <button className="alert" onClick={onDelete}>
              O'chirish
            </button>
            {item?.status ? (
              <button className="save" onClick={onSubmit}>
                Yuborish
              </button>
            ) : (
              <button className="red" onClick={onAbort}>
                Bekor qilish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
