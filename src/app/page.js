"use client";
import Image from "next/image";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o'); // Default to GPT-4o
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [assistantId, setAssistantId] = useState(null);
  const [threadId, setThreadId] = useState(null); 

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const createAssistant = async () => {
    const response = await fetch('/api/assistant', {
      method: 'POST',
   });
   const data = await response.json();
   setAssistantId(data.assistantId); // Store the assistant ID
  };

  // Call this function when switching to the assistant mode
  useEffect(() => {
    if (selectedModel === 'assistant' && !assistantId) {
     createAssistant(); // Create assistant when needed
    }
  }, [selectedModel, assistantId]);

  // When making the call to run the assistant
  const runAssistant = async (threadId) => {
    const runResponse = await fetch('/api/thread/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ threadId, assistantId }), // Use the stored assistant ID here
    });

    const data = await runResponse.json();
    return data;
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Update message list with user message
    const updatedMessages = [...messages, { sender: 'user', text: input }];
    setMessages(updatedMessages);
    setInput('');

    
    try {
      if (selectedModel == 'gpt-4o') {
        // Make a POST request to your API endpoint
          const response = await fetch('api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }), // Send the user input to the backend
        });

        const data = await response.json(); // Get the GPT response

        // Update message list with GPT's response
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'bot', text: data.text }, // The bot's reply from the API
        ]);
      } else if (selectedModel == 'assistant') {
        // Make a POST request to your Assistant API endpoint
        let currentThreadId = threadId;
        if (!currentThreadId) {
         const threadResponse = await fetch('/api/thread', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
         });
        
          const { threadId: newThreadId } = await threadResponse.json();
          setThreadId(newThreadId);
          currentThreadId = newThreadId;
        }
        await fetch('/api/thread/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ threadId: currentThreadId, message: input }),
        });
        
        const runResponse = await runAssistant(currentThreadId);
        
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', text: runResponse },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'error', text: 'Sorry, there was an error!' },
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

      {/* Model Selection */}
      <div className="p-4">
        <label htmlFor="model-select" className="mr-2">Select Model:</label>
        <select id="model-select" value={selectedModel} onChange={handleModelChange} className="p-2 bg-gray-800 text-white rounded-md">
          <option value="gpt-4o">GPT-4o</option>
          <option value="assistant">Assistant</option>
        </select>
      </div>

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
