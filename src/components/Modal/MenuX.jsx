import React from "react";
import "./MenuStyle.scss";
import Icon from "../../assets/file_icon.png";
import Correct from "../../assets/correct.png";
import { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../api/api";

const MenuX = ({ setModal }) => {
  const [state, setState] = useState({
    name: "",
    description: {
      uzb: "",
      rus: "",
      eng: "",
    },
    price: "",
    type: "cooler",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "description_uzb") {
      setState((state) => ({
        ...state,
        description: {
          ...state.description,
          uzb: value,
        },
      }));
    } else if (name == "description_rus") {
      setState((state) => ({
        ...state,
        description: {
          ...state.description,
          rus: value,
        },
      }));
    } else if (name == "description_eng") {
      setState((state) => ({
        ...state,
        description: {
          ...state.description,
          eng: value,
        },
      }));
    } else {
      setState((state) => ({
        ...state,
        [name]: value,
      }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async (e) => {
    const pendingToastId = toast.info("Yuklanmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });
    e.preventDefault();

    const formData = new FormData();

    const { name, price, description,type } = state;
    const desc = JSON.stringify(description);

    formData.append("images", selectedImage);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", desc);
    formData.append("type", type);

    try {
      if (
        selectedImage &&
        name &&
        price &&
        description.uzb &&
        description.rus &&
        description.eng
      ) {
        let response = await api.post(
          "https://vital.zirapcha.uz/api/product/create",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );


        await toast.update(pendingToastId, {
          render: "Muvaffaqiyatli yuklandi!",
          type: toast.TYPE.SUCCESS,
          autoClose: 3000, // Automatically close success toast after 3 seconds
        });

        setState({
          name: "",
          description: {
            uzb: "",
            rus: "",
            eng: "",
          },
          price: "",
          type: 'cooler',
        });
        setModal(false);
      } else {
        toast.warn("Ma'lumotlarni to'liq to'ldiring...", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      toast.update(pendingToastId, {
        render: "Nimadir xato ketdi...",
        type: toast.TYPE.ERROR,
        autoClose: 3000, // Automatically close error toast after 3 seconds
      });
      console.log(error);
    }
  };
  return (
    <div className="menu_model" onClick={() => setModal(false)}>
      <div className="modal_box_1" onClick={(e) => e.stopPropagation()}>
        <form>
          <div className="flex_form">
            <div className="modal_img">
              <input
                type="file"
                className="input_file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {selectedImage ? (
                <img src={Correct} alt="Rasm yuklandi..." />
              ) : (
                <img src={Icon} alt="" />
              )}
            </div>

            <div className="data_box">
              <label>Mahsulot nomi:</label>
              <input
                type="text"
                value={state.name}
                name="name"
                onChange={(e) => handleChange(e)}
              />
              <div className="modal_num">
                <div>
                  <label>Mahsulot narxi:</label>
                  <input
                    type="text"
                    value={state.price}
                    name="price"
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div>
                  <label>Mahsulot turi:</label>
                  <select name="type" value={state.type} onChange={(e)=>handleChange(e)}>
                    <option value="cooler">Kuler</option> 
                    <option value="water">Suv</option>
                  </select>
                </div>
              </div>

              <div>
                <label>Izoh:</label>
                <p>Uzb</p>
                <input
                  type="text"
                  value={state?.description.uzb}
                  name="description_uzb"
                  onChange={(e) => handleChange(e)}
                />
                <p>pyc</p>
                <input
                  type="text"
                  value={state?.description.rus}
                  name="description_rus"
                  onChange={(e) => handleChange(e)}
                />
                <p>eng</p>
                <input
                  type="text"
                  value={state?.description.eng}
                  name="description_eng"
                  onChange={(e) => handleChange(e)}
                />
                <button className="modal_btn" onClick={handleSubmit}>
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuX;

