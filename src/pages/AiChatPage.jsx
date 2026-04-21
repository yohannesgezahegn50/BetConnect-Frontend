// import React, { useState, useRef, useEffect } from 'react';
// import API from '../services/api';

// const Navbar = () => (
//   <nav className="navbar">
//     <div className="navbar-brand">
//       <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
//       <span>BetConnect</span>
//     </div>
//     <div className="navbar-links">
//       <a href="#">Browse Properties</a>
//       <a href="#" className="bold">Login</a>
//       <button className="signup-btn">Sign Up</button>
//     </div>
//   </nav>
// );

// const MessageBubble = ({ message }) => (
//   <>
//     <div className="message-row">
//       <div className="avatar">
//         <svg viewBox="0 0 24 24">
//           <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm7.5-1.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM8 15h8v2H8v-2z"/>
//         </svg>
//       </div>
//       <div className="bubble">{message.text}</div>
//     </div>
//     <div className="timestamp">{message.time}</div>
//   </>
// );

// const AIChatPage = () => {
//   const [messages, setMessages] = useState([{
//     id: 1,
//     sender: 'ai',
//     text: "Hello! I'm your AI real estate assistant. I can help you find the perfect property in Addis Ababa. What are you looking for? You can tell me about your budget, preferred location, number of bedrooms, or any other requirements.",
//     time: '09:55 AM',
//   }]);
//   const [inputValue, setInputValue] = useState('');
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const getCurrentTime = () =>
//     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   const handleSend = async () => {
//     if (!inputValue.trim()) return;

//     const userMsg = { id: Date.now(), sender: 'user', text: inputValue, time: getCurrentTime() };
//     setMessages(prev => [...prev, userMsg]);
//      const currentInput = inputValue;
//     setInputValue('');

//     try {
//         const res = await API.post('/ai/chat', { message: currentInput });
        
//         const aiMsg = {
//           id: Date.now() + 1,
//           sender: 'ai',
//           text: res.data.response, 
//           time: getCurrentTime(),
//         };
//         setMessages(prev => [...prev, aiMsg]);
//       } catch (err) {
//           const errorMsg = {
//             id: Date.now() + 1,
//             sender: 'ai',
//             text: "I'm sorry, I'm having trouble connecting to my brain. Please try again.",
//             time: getCurrentTime(),
//           };
//           setMessages(prev => [...prev, errorMsg]);
//       }
//   };

//   return (
//     <div className="page">
//       <Navbar />

//       <div className="page-header">
//         <div className="page-header-icon">
//           <svg viewBox="0 0 24 24">
//             <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74z"/>
//           </svg>
//         </div>
//         <div>
//           <h1>AI Property Assistant</h1>
//           <p>Tell me what you're looking for, and I'll help you find it</p>
//         </div>
//       </div>

//       <div className="chat-area">
//         {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="input-bar">
//         <div className="input-row">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={e => setInputValue(e.target.value)}
//             onKeyDown={e => e.key === 'Enter' && handleSend()}
//             placeholder="Type your message... (e.g., 'I need a 3 bedroom house in Bole')"
//           />
//           <button className="send-btn" onClick={handleSend}>
//             <svg viewBox="0 0 24 24">
//               <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
//             </svg>
//           </button>
//         </div>
//         <p className="input-hint">💡 Try: "Show me apartments in Bole", "I need a house to buy", "3 bedroom properties"</p>
//       </div>
//     </div>
//   );
// };

// export default AIChatPage;


import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Search, MessageSquare } from 'lucide-react';
import API from '../services/api';

const MessageBubble = ({ message }) => {
  const isAi = message.sender === 'ai';

  return (
    <div className={`flex flex-col mb-6 ${isAi ? 'items-start' : 'items-end'}`}>
      <div className={`flex items-start gap-3 max-w-[85%] md:max-w-[70%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
          isAi ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'
        }`}>
          {isAi ? <Bot size={20} /> : <User size={20} />}
        </div>

        {/* Bubble */}
        <div className={`p-4 rounded-2xl shadow-xs text-[15px] leading-relaxed ${
          isAi 
            ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' 
            : 'bg-blue-600 text-white rounded-tr-none'
        }`}>
          {message.text}
        </div>
      </div>
      <span className="text-[11px] text-gray-400 mt-2 px-14 font-medium uppercase tracking-tighter">
        {message.time}
      </span>
    </div>
  );
};

const AIChatPage = () => {
  const [messages, setMessages] = useState([{
    id: 1,
    sender: 'ai',
    text: "Hello! I'm your BetConnect AI Assistant. Tell me what kind of home you are looking for in Addis, and I'll search our database for you instantly.",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), sender: 'user', text: inputValue, time: userTime };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Connect to our real Node.js Backend AI route
      const res = await API.post('/ai/chat', { message: currentInput });
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.data.response, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I'm sorry, I'm having trouble searching the database right now. Please try again later.",
        time: userTime,
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* AI Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Sparkles size={28} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">AI Smart Search</h1>
            <p className="text-gray-500 font-medium">Powered by Llama-3 & BetConnect Real Estate Data</p>
          </div>
        </div>
      </div>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200">
        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-400 text-sm animate-pulse ml-14 mb-6">
            <Bot size={16} />
            <span>AI is searching listings...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar Section */}
      <div className="pt-6">
        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="e.g., 'Find a 2 bedroom apartment in Bole under 20,000 ETB'"
              className="flex-1 bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 border border-transparent focus:border-indigo-100 text-gray-700 transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-4 rounded-2xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center"
            >
              <Send size={24} />
            </button>
          </div>
          
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
            {['Apartments in Bole', 'Cheap rent near CMC', 'G+2 for sale'].map((suggestion) => (
              <button 
                key={suggestion}
                onClick={() => setInputValue(suggestion)}
                className="text-[11px] font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors whitespace-nowrap uppercase tracking-wider"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;