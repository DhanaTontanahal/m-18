import React from "react";
import "./TypingIndicator.css";

const TypingIndicator = ({ isTyping }) => {
  return (
    isTyping && (
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    )
  );
};

export default TypingIndicator;
