import React from "react";

const ChatArea = ({selectedUser, chatBoxRef, chat, username, message, handleSendMessage, setMessage}) => {
  return(
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
  )
};

export default ChatArea;