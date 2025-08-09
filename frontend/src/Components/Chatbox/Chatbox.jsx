import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from "axios";
import './Chatbox.css';

const socket = io('http://localhost:5000');

const ChatBox = ({ taskId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    // This directly scrolls the chat box container instead of using scrollIntoView
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await axios.get(`http://localhost:5000/chat/${taskId}`);
        console.log(response?.data?.chat?.messages);
        setMessages(response?.data?.chat?.messages || []);
      }
      catch(err) {
        console.error('Error fetching messages:', err);
      }
    }
    fetchMessages();
    
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [taskId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const message = {
        taskId: taskId,
        text: input,
        timestamp: new Date().toISOString()
      };
      
      let data = JSON.stringify({
        "taskId": taskId,
        "message": {
          "senderType": "Customer",
          "text": message.text
        }
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:5000/chat',
        headers: { 
          'Content-Type': 'application/json'
        },
        data: data
      };

      async function makeRequest() {
        try {
          const response = await axios.request(config);
          console.log(JSON.stringify(response.data));
        }
        catch (error) {
          console.log(error);
        }
      }

      makeRequest();
      socket.emit('sendMessage', { message });
      setInput('');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box" ref={chatBoxRef}>
        {messages?.map((msg, index) => (
          <div 
            key={index} 
            className="message-container"
            style={{
              justifyContent: msg.senderType === 'Customer' ? 'flex-start' : 'flex-end'
            }}
          >
            <div className={msg.senderType === 'Customer' ? 'my-message' : 'their-message'}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-box">
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button className="button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;