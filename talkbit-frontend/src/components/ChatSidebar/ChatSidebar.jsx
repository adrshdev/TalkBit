import React from "react";
import '../../pages/ChatPage/chat.css'

const ChatSidebar = ({onlineUsers, startChat, selectedUser}) => {
  return(
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
  )
};

export default ChatSidebar;