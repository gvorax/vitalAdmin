import React from "react";
import Icon from "../../assets/file_icon.png";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { api } from "../../api/api";
import "./MenuStyle.scss";

const EditModal = ({ setEditModal, id }) => {
  const [check, setCheck] = useState(false);
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState('')
  const [state, setState] = useState({
    images: '',
    name: "",
    description: {
      uzb: "",
      rus: "",
      eng: "",
    },
    price: "",
    type:""
  });

  useEffect(() => {
    const getData = async () => {
      const response = await api.get(`/api/product/${id}`);

      setState(response.data.data.product);
      
    };

    getData();
  }, [check]);


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
    setImage('');
    const pendingToastId = toast.info("Yuklanyapti...", {
      autoClose: false, // Do not automatically close the pending toast
    });
    const formData = new FormData();
    const file = e.target.files[0];
    setImage(file);
    const { name, price, description } = state;

    const desc = JSON.stringify(description);

    formData.append("images", file);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", desc);

    try {
      let res = await api.patch(`https://vital.zirapcha.uz/api/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await toast.update(pendingToastId, {
        render: "Yuklandi!",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000, // Automatically close success toast after 3 seconds
      });

      setCheck(!check);
    } catch (error) {
      console.log(error,"error");
      
      toast.update(pendingToastId, {
        render: "Nimadir xato ketdi...",
        type: toast.TYPE.ERROR,
        autoClose: 3000, // Automatically close error toast after 3 seconds
      });
    }
  };



  const handleSubmit = async (e) => {
    const pendingToastId = toast.info("O'zgartirilmoqda...", {
      autoClose: false, // Do not automatically close the pending toast
    });
    e.preventDefault();
    const formData = new FormData();

    const {images, name, price, description,type } = state;
    const desc = JSON.stringify(description);
    formData.append("images", images);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", desc);
    formData.append("type", type);

    try {
      if (name && price && description) {
        let res = await api.patch(`/api/product/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await toast.update(pendingToastId, {
          render: "Muvaffaqiyatli o'zgartirildi",
          type: toast.TYPE.SUCCESS,
          autoClose: 3000, // Automatically close success toast after 3 seconds
        });

        toast.success("Muvaffaqiyatli o'zgartirildi ...", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setEditModal(false);
      } else {
        toast.warning("Ma'lumotlarni to'ldiring ...", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
      toast.update(pendingToastId, {
        render: "Nimadir xato ketdi...",
        type: toast.TYPE.ERROR,
        autoClose: 3000, // Automatically close error toast after 3 seconds
      });
    }
  };

  return (
    <div className="menu_model" onClick={() => setEditModal(false)}>
      <div className="modal_box_1" onClick={(e) => e.stopPropagation()}>
        <form>
          <div className="flex_form">
            <div className="modal_img">
              <input
                type="file"
                className="input_file"
                onChange={handleFileChange}
              />
              {state?.images ? (
                <img
                  src={`https://vital.zirapcha.uz/api/api/file/${state.images[0]}`}
                  alt="Rasm yuklandi..."
                />
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
                  <select name="type" value={state.type == 'water' ? 'water':'cooler'} onChange={(e)=>handleChange(e)}>
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

export default EditModal;
