import React from "react";
import classes from "./JoinBlock.module.scss";
import axios from "axios";

function JoinBlock({ onLogin }) {
  const [roomId, setRoomId] = React.useState("");
  const [userName, setUserName] = React.useState("");
  const [isLoading, setLoading] = React.useState(false);

  const onEnter = async () => {
    if (!roomId) {
      return alert("Введите id комнаты");
    } else if (!userName) {
      return alert("Введите ваше имя");
    }
    const chatInfo = { roomId, userName };
    setLoading(true);

    await axios.post("/rooms", chatInfo);
    onLogin(chatInfo);
  };

  return (
    <div>
      <div className={classes.joinBlock}>
        <div className={classes.inputForm}>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput">Room ID</label>
            <input
              type="text"
              className={"form-control" + " " + classes.input}
              id="formGroupExampleInput"
              placeholder="введите ID комнаты"
              value={roomId}
              onChange={(event) => setRoomId(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="formGroupExampleInput2">Ваше имя</label>
            <input
              type="text"
              className={"form-control" + " " + classes.input}
              id="formGroupExampleInput2"
              placeholder="Введите ваше имя"
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>
          <button
            disabled={isLoading}
            onClick={onEnter}
            type="button"
            className="btn btn-success"
          >
            {isLoading ? "ВХОД..." : "ВОЙТИ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export  {JoinBlock};
