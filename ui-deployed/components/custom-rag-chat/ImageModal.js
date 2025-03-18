import React from "react";
import Image from "next/image";

const ImageModal = ({ selectedImage, onClose }) => {
  if (!selectedImage) return null;

  return (
    <div className="image-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose} title="Close">
          ✖
        </span>
        <Image
          width={500}
          height={300}
          src={selectedImage}
          alt="Expanded View"
          className="modal-image"
        />
      </div>
    </div>
  );
};

export default ImageModal;
