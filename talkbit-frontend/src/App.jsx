import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import io from 'socket.io-client';
import './chat.css'
import './app.css';
import LoginForm from "./components/LoginForm/LoginForm";

const socket = io('http://localhost:3001');

function App() {

  const [username, setUsername] = useState('');
  const [entered, setEntered] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');

  const chatBoxRef = useRef(null);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [chat]);


  useEffect(() => {

    socket.on('online-users', (users) => {
      setOnlineUsers(users.filter((user) => user!==username));
    })

    socket.on('chat-message', ({from, content, time}) => {
      setChat((prev) => [...prev, {from, content, time}]);
    });

    socket.on('chat-history', (messages) => {
      const formatted = messages.map((m) => ({
        from: m.sender,
        content: m.content,
        time: new Date(m.createdAt).toLocaleTimeString(),
      }));
      setChat(formatted);
    })

    return () => {
      socket.off('online-users');
      socket.off('chat-message');
      socket.off('chat-history');
    };

  }, [username]);

  const handleSendMessage = () => {
    if(message.trim() && selectedUser){
      socket.emit('private-message', {from: username, to: selectedUser, content: message});
      setMessage('');
    }
  };

  const handleEnterChat = () => {
    if(username.trim()){
      socket.emit('join', username);
      setEntered(true);
    }
  };

  const startChat = (to) => {
    setSelectedUser(to);
    setChat([]);
    socket.emit('start-chat', {from: username, to})
  }

  if(!entered){
    return(
      <LoginForm username={username} setUsername={setUsername} handleEnter={handleEnterChat}/>
    )
  }

  return(
    <div className="chat-wrapper">
      <div className="sidebar">
        <h3>Online Users</h3>
        {onlineUsers.length === 0 && <p>No users Online</p>}
        <ul>
          {onlineUsers.map((user) => (
            <li key={user} onClick={() => startChat(user)} className={selectedUser === user? 'active' : ''}>
              <div className="user-row">
                <div className="avatar">{user.charAt(0).toUpperCase()}</div>
                <span>{user}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        {selectedUser ? (
          <>
            <h3>Chatting with {selectedUser}</h3>
            <div className="chat-box" ref={chatBoxRef}>
              {chat.map((msg, idx) => (
                <div key={idx} className={`message-bubble ${msg.from === username? 'me' : 'other'}`}>
                  <div className="message-content">{msg.content}</div>
                  <div className="message-meta">{msg.time}</div>
                </div>
              ))}
            </div>
            <div className="input-group">
              <input type="text" placeholder="Type a Message" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div style={{padding: '20px'}}>
            <p>Select a user from the list to start a chat</p>
          </div>
        )}
      </div>
    </div>
  )
};

export default App;