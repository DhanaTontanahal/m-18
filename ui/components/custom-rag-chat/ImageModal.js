import React from "react";

const ImageModal = ({ selectedImage, onClose }) => {
  if (!selectedImage) return null;

  return (
    <div className="image-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose} title="Close">
          ✖
        </span>
        <img src={selectedImage} alt="Expanded View" className="modal-image" />
      </div>
    </div>
  );
};

export default ImageModal;
