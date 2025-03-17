import React from "react";

const ChatHeader = ({ userName, onClose }) => {
  return (
    <div style={{ backgroundColor: "#11b67a" }} className="chat-header">
      <h3>Hi, {userName}!</h3>
      <div style={{ display: "flex" }}>
        <div onClick={onClose} className="close-icon">
          x
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

{
  /* <div style={{ backgroundColor: "#2a5298" }} className="chat-header">
<h3>Hi, {userName}!</h3>
<div style={{ display: "flex" }}>
<div onClick={onClose} className="close-icon">
 x
</div>
</div>
</div> */
}
