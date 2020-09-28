import React from "react";
import { JoinBlock } from "./components/JoinBlock/JoinBlock";
import socket from "./socket";
import reducer from "./reducer";
import { Chat } from "./components/Chat/Chat";
import axios from 'axios'

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    userName: null,
    roomId: null,
    users: [],
    messages: [],
  });

  const onLogin = async (chatInfo) => {
    dispatch({
      type: "JOINED",
      payload: chatInfo,
    });
    socket.emit("ROOM:JOIN", chatInfo);
    const {data} = await axios.get(`/rooms/${chatInfo.roomId}`);
    dispatch({
      type: 'SET_DATA',
      payload: data
    })
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users
    });
  };

  const addMessage = (message) => {
    dispatch({
      type: 'SET_MESSAGE',
      payload: message
    });
  };




  React.useEffect(() => {
    socket.on("ROOM:SET_USERS", setUsers);
    socket.on("ROOM:NEW_MESSAGE", addMessage);
  }, []);

  window.socket = socket;
  

  return (
    <div className={"wrapper"}>
      {!state.joined ? <JoinBlock onLogin={onLogin} /> : <Chat {...state} onAddMessage={addMessage}/>}
    </div>
  );
}

export default App;
