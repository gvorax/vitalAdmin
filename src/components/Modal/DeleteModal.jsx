import React from "react";
import "./MenuStyle.scss";

const DeleteModal = ({onCancel, onDelete }) => {

  return (
    <div className="menu_model" onClick={onCancel}>
      <div className="modal_box" onClick={(e) => e.stopPropagation()}>
        <div className="buttons">
          <p>
            {" "}
            <span>O'chirishni</span> xohlaysizmi ?
          </p>
          <div className="flex">
            <button onClick={onCancel}>Yo'q</button>
            <button className="alert" onClick={onDelete}>
              Haa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
