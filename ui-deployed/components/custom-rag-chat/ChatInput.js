import React, { useState } from "react";
import Image from "next/image";
import SpeechRecorder from "./SpeechRecorder";
import PDFUploader from "./PDFUploader";

const ChatInput = ({
  input,
  setInput,
  handleSend,
  onUpload,
  endPoint,
  inputMsgPlaceholder,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <SpeechRecorder
        setInput={setInput}
        handleSend={handleSend}
        endPoint={endPoint}
      />{" "}
      {/* 🎙️ Auto-send enabled */}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={inputMsgPlaceholder}
      />
      {/* Attach button */}
      <button onClick={() => setShowModal(true)}>
        <Image
          src={"/icons/attch-icon.png"}
          alt="attach"
          width={30}
          height={30}
        />
      </button>
      {/* Send button */}
      <button onClick={handleSend}>
        <Image src={"/icons/send_icon.png"} alt="send" width={30} height={30} />
      </button>
      {showModal && (
        <PDFUploader onClose={() => setShowModal(false)} onUpload={onUpload} />
      )}
    </div>
  );
};

export default ChatInput;
