import React, {useState, useEffect, useRef} from "react";
import io from 'socket.io-client';
import ChatSidebar from "../../components/ChatSidebar/ChatSidebar";
import ChatArea from "../../components/ChatArea/ChatArea";
import './chat.css'
import LoginForm from "../../components/LoginForm/LoginForm";


const socket = io('http://localhost:3001');

const ChatPage = () =>{

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
      <ChatSidebar onlineUsers={onlineUsers} startChat={startChat} selectedUser={selectedUser}/>
      <ChatArea selectedUser={selectedUser} chatBoxRef={chatBoxRef} chat={chat} username={username} message={message} handleSendMessage={handleSendMessage} setMessage={setMessage}/>
    </div>
  )
};

export default ChatPage;