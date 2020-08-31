import React, { useState } from "react";
import classes from "./Chat.module.scss";
import socket from "../../socket";

function Chat({ users, messages, roomId, userName, onAddMessage }) {
  const [messageValue, setMessageValue] = useState("");
  const messagesRef = React.useRef(null)
  const onSendMessage = () => {
      if(messageValue.length > 0){
    socket.emit("ROOM:NEW_MESSAGE", {
      userName,
      roomId,
      text: messageValue,
    });
    onAddMessage({
      userName,
      text: messageValue,
    });
    setMessageValue("");
      }
  };

  React.useEffect(()=> {
     messagesRef.current.scrollTo(0, 99999);}, [messages]
  );


  return (
    <div className={classes.chat}>
      <div className={classes.chatContainer}>
        <div className={classes.chatUsers}>
          <b>Комната: {roomId}</b>
          <br />
          <b>Онлайн ({users.length})</b>
          <br />
          <br />
          <ul>
            {users.map((name, index) => (
              <li key={name + index}>{name}</li>
            ))}
          </ul>
        </div>
        <div className={classes.chatDisplay}>
          <div ref={messagesRef} className={classes.chatMessages}>
            {messages.map((message, index) => (
              <div key={index}>
                <div className={classes.message} style={userName===message.userName ? {background: 'wheat', marginLeft: '60px', marginRight: '10px'} : {} }    >
                  <span>{message.text}</span>
                  <div className={classes.userName}>{message.userName}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={classes.chatInput}>
            <div className="form-group">
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                onChange={(event) => setMessageValue(event.target.value)}
                value={messageValue}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={onSendMessage}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Chat };
