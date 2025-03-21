import React, { useState } from "react";
import Main from "./Main";
import Image from "next/image";
import "./App.css";

const App = (props) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const closeClick = () => {
    setIsChatOpen(false);
  };
  return (
    <>
      {/* <SpeechRecognitionComponent /> */}
      {isChatOpen && (
        <div
          style={{
            borderTopRightRadius: "25px",
            borderTopLeftRadius: "25px",
            backgroundColor: "none",
          }}
          className="chat-popup"
        >
          <Main
            closeClick={closeClick}
            apiUrl={props.apiUrl}
            instanceName={props.instanceName}
            endPoint={props.endPoint}
            userName={props.userName}
            inputMsgPlaceholder={props.inputMsgPlaceholder}
            footerMessage={props.footerMessage}
            responseIcon={props.responseIcon}
            welcomeMessage={props.welcomeMessage}
          />
        </div>
      )}
      {!isChatOpen ? (
        <>
          <div className="chat-icon" onClick={toggleChat}>
            <Image
              width={40}
              height={40}
              style={{ borderRadius: "60px", width: "60px", height: "60px" }}
              src={"/icons/lloyds_response_icon.png"}
              alt="Chat Icon"
            />
          </div>
        </>
      ) : (
        <div className="chat-icon1" onClick={toggleChat}>
          <Image
            width={40}
            height={40}
            style={{ borderRadius: "35px", width: "35px", height: "35px" }}
            src={"/icons/close_icon.png"}
            alt="Close Icon"
          />
        </div>
      )}
    </>
  );
};

export default App;
