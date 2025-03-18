import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ChatResponse from "./ChatResponse";
import responseIconLocal from "../../public/icons/lloyds_response_icon.png";
import userIcon from "../../public/icons/user_icon.png";
import "./ChatHistory.css";
import TypingIndicator from "./typing-indicator/TypingIndicator";

const ChatHistory = ({
  chatHistory,
  isTyping,
  openImageModal,
  handleApplyClick,
  endPoint,
  responseIcon,
}) => {
  const [lastAssistantMessage, setLastAssistantMessage] = useState(null);

  const chatContainerRef = useRef(null); // ✅ Create a ref for the chat container

  useEffect(() => {
    // Find the latest assistant message
    const lastMessage = chatHistory
      .slice()
      .reverse()
      .find((chat) => chat.sender === "assistant");

    if (lastMessage && lastMessage.message !== lastAssistantMessage) {
      setLastAssistantMessage(lastMessage.message);
    }
  }, [lastAssistantMessage, chatHistory, isTyping]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // ✅ Remove duplicate messages based on `chat.message`
  const uniqueChatHistory = Array.from(
    new Map(chatHistory.map((chat) => [chat.message, chat])).values()
  );

  return (
    <div className="chat-history" ref={chatContainerRef}>
      {uniqueChatHistory.length > 0 ? (
        uniqueChatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-message ${
              chat.sender === "user" ? "user-message" : "assistant-message"
            }`}
          >
            {/* User or Assistant Avatar */}
            <Image
              width={40}
              height={40}
              src={chat.sender === "user" ? userIcon : responseIconLocal}
              alt={`${chat.sender} icon`}
              className="chat-icon1"
            />

            {/* Response Message */}
            <ChatResponse
              uniqueChatHistoryLength={uniqueChatHistory?.length}
              message={chat?.pdfUrl ? "" : chat?.message}
              audioUrl={chat?.audioUrl}
              videoLink={chat?.videoLink}
              isAssistant={chat?.sender === "assistant"}
              autoPlay={chat?.message === lastAssistantMessage}
              endPoint={endPoint}
            />

            {chat?.pdfUrl && (
              <div
                style={{ width: "300px", marginRight: "50px" }}
                className="pdf-container"
              >
                <a
                  style={{ color: "blue", textDecoration: "underline" }}
                  href={chat.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 {chat?.fileName}
                </a>
              </div>
            )}

            {chat.images && (
              <div className="image-container">
                {/* <>...</> */}
                {chat.images.map((img, idx) => (
                  <div key={idx} className="card-container">
                    <br />
                    <Image
                      src={img}
                      alt="Credit Card"
                      width={250}
                      height={250}
                      className="chat-image"
                      // onMouseEnter={() => openImageModal(img)}
                      onClick={() => openImageModal(img)}
                    />
                    <button
                      className="apply-button"
                      onClick={() => handleApplyClick(img)}
                    >
                      Know more
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div>Please wait...Loading...</div>
      )}

      {/* {isTyping && (
        <div className="chat-message assistant-message">
          <p>...</p>
        </div>
      )} */}

      <TypingIndicator isTyping={isTyping} />
    </div>
  );
};

export default ChatHistory;
