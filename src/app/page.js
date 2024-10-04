"use client";
import Image from "next/image";
import React, { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Update message list with user message
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    
    try {
      // Make a POST request to your API endpoint
      const response = await fetch('api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }), // Send the user input to the backend
      });

      const data = await response.json(); // Get the GPT response

      // Update message list with GPT's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: data.text }, // The bot's reply from the API
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Sorry, there was an error!' },
      ]);
    }
    // Example backend call placeholder, add GPT response logic here
    //setTimeout(() => {
     // setMessages((prevMessages) => [
        //...prevMessages,
       // { sender: 'bot', text: 'This is a bot response.' },
     // ]);
   // }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-4 text-center bg-gray-800 shadow">
        <h1 className="text-xl font-semibold">ChatGPT Clone</h1>
      </header>

      {/* Chat Messages */}
      <div className="flex-grow p-6 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-lg ${
                message.sender === 'user' ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-800">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-grow p-2 rounded-l-md text-black"
            placeholder="Message ChatGPT"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button
            className="p-2 bg-blue-600 rounded-r-md"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  ); 
  
}
