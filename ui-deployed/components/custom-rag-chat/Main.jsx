"use client";
import React, { useState, useEffect, useMemo } from "react";
import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import ImageModal from "./ImageModal";
import { saveChatToFirestore, getChatHistory } from "./firebaseConfig";
import "./Main.css";

const Main = (props) => {
  // const initialAssistantMessage = {
  //   id: "initialMessage",
  //   sender: "assistant",
  //   message: props.welcomeMessage,
  //   timestamp: new Date().toISOString(),
  // };

  // ✅ Memoize `initialAssistantMessage` to prevent unnecessary re-renders
  const initialAssistantMessage = useMemo(
    () => ({
      id: "initialMessage",
      sender: "assistant",
      message: props.welcomeMessage,
      timestamp: new Date().toISOString(),
    }),
    [props.welcomeMessage]
  ); // ✅ Only changes when `props.welcomeMessage` changes

  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // ✅ Load chat history from Firebase when component mounts
  useEffect(() => {
    const loadChats = async () => {
      console.log(props);
      const savedChats = await getChatHistory(props);

      // ✅ Ensure the initial message is NOT added twice
      const assistantMessageExists = savedChats.some(
        (msg) => msg.id === "initialMessage"
      );

      if (!assistantMessageExists) {
        await saveChatToFirestore(props, initialAssistantMessage);
        setChatHistory([initialAssistantMessage, ...savedChats]); // ✅ Add initial message only once
      } else {
        setChatHistory(savedChats);
      }
    };

    loadChats();
  }, [props, initialAssistantMessage]); // ✅ Runs only once when the component mounts

  const handleSend = async (customInput = null) => {
    const query = customInput || input;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      message: query,
      images: [],
      videoLink: "",
      timestamp: new Date().toISOString(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    saveChatToFirestore(props, userMessage); // ✅ Save to Firestore

    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        props.apiUrl +
          "?instance_name=" +
          props.instanceName +
          "&endPointUrl=" +
          props.endPoint,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        }
      );

      const data = await response.json();
      const newMessage = {
        id: `msg-${Date.now()}`,
        sender: "assistant",
        message: data.answer || "",
        images: data?.images || [],
        videoLink: data?.videoLink || "",
        audioUrl: data?.audio_url || "",
        timestamp: new Date().toISOString(),
      };

      if (data.images?.length) {
        setChatHistory((prev) => [...prev, newMessage]);
        await saveChatToFirestore(props, newMessage); // ✅ Save response to Firestore
      } else {
        let typingMessage = "";
        setChatHistory((prev) => [...prev, { ...newMessage, message: "" }]);
        await saveChatToFirestore(props, newMessage); // ✅ Save response to Firestore
        const interval = setInterval(() => {
          const nextChar = data?.answer?.[typingMessage.length];
          if (nextChar) {
            typingMessage += nextChar;
            setChatHistory((prev) =>
              prev.map((item, idx) =>
                idx === prev.length - 1
                  ? { ...item, message: typingMessage }
                  : item
              )
            );
          } else {
            clearInterval(interval);
            setIsTyping(false);
          }
        }, 0);
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "assistant",
          message: "An error occurred. Please try again.",
        },
      ]);
      setIsTyping(false);
    }
  };

  const cardMapper = {
    page_1_img_1: "Cashback ",
    page_3_img_1: "Platinum ",
    page_4_img_1: "Business ",
  };
  const handleApplyClick = (cardImage) => {
    console.log(cardImage);
    const cardName = cardImage
      .split("/")
      .pop()
      .replace(".jpeg", "")
      .replace("_", " ");
    const applicationQuery = `I want to apply for ${cardName} credit card. What is the process?`;
    console.log(cardMapper[cardImage]);
    setInput(applicationQuery);
    setTimeout(() => {
      handleSend(applicationQuery);
    }, 500);
  };

  const handleUpload = (pdfMessage) => {
    setChatHistory((prev) => [...prev, pdfMessage]);
  };

  return (
    <div className="main">
      <ChatHeader onClose={props.closeClick} userName={props.userName} />
      <div className="chat-container">
        <ChatHistory
          chatHistory={chatHistory}
          isTyping={isTyping}
          openImageModal={setSelectedImage}
          handleApplyClick={handleApplyClick}
          endPoint={props.endPoint}
          responseIcon={props.responseIcon}
        />
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          onUpload={handleUpload}
          endPoint={props.endPoint}
          inputMsgPlaceholder={props.inputMsgPlaceholder}
        />
      </div>
      <ImageModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
      {props.footerMessage}
    </div>
  );
};

export default Main;
