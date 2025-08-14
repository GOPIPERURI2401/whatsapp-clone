import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Picker from 'emoji-picker-react';
import './App.css';

// --- Icon Components (No changes needed here) ---
const UserIcon = () => (<svg width="60%" height="60%" viewBox="0 0 24 24" fill="#FFF" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12ZM12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z" fill="white"/></svg>);
const EmojiIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM8.5 9.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S7 11.83 7 11s.67-1.5 1.5-1.5zm7 0c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S14 11.83 14 11s.67-1.5 1.5-1.5zm-3.5 4c-1.48 0-2.75.81-3.45 2H15.9c-.7-1.19-1.97-2-3.45-2z"></path></svg>);
const AttachIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>);
const SendIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>);
const MicIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24"><path fill="currentColor" d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"></path></svg>);
const MoreIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path></svg>);
const NewChatIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>);
const ChatsIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>);
const StatusIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-4-8a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg>);
const SettingsIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.44,0.17-0.48,0.41L9.22,5.25C8.63,5.49,8.1,5.81,7.6,6.19L5.21,5.23C4.99,5.16,4.74,5.22,4.62,5.44L2.7,8.76 C2.59,8.96,2.64,9.23,2.82,9.37l2.03,1.58C4.82,11.36,4.8,11.68,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.38,2.44 c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.48-0.41l0.38-2.44c0.59-0.24,1.12-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0.02,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path></svg>);
const BackIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>);
const EditIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>);
const AccountIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>);
const PrivacyIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"></path></svg>);
const HelpIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"></path></svg>);
const LockIcon = () => (<svg viewBox="0 0 24 24" height="16" width="16" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm1-9h-2V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2h-4z"></path></svg>);
const NewGroupIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path></svg>);
const StarIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>);
const LogoutIcon = () => (<svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path></svg>);

const formatTimestamp = (unixTimestamp) => {
  if (!unixTimestamp) return '';
  const messageDate = new Date(unixTimestamp * 1000);
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return messageDate.toLocaleDateString();
};

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeView, setActiveView] = useState('chats');
  const emojiPickerRef = useRef(null);

  const handleViewChange = (view) => {
    setActiveView(view);
    setProfileOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/conversations`)
      .then(res => setConversations(res.data))
      .catch(err => console.error("Error fetching conversations:", err));
  }, []);

  useEffect(() => {
    if (!activeChat) return;
    setShowEmojiPicker(false);
    setProfileOpen(false);
    const fetchMessages = async () => {
      try {
       const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${activeChat._id}`);
        const messagesWithSeparators = []; let lastDate = null;
        response.data.forEach(msg => {
          const messageDate = new Date(msg.timestamp * 1000).toDateString();
          if (messageDate !== lastDate) { messagesWithSeparators.push({ type: 'date_separator', date: messageDate, _id: messageDate }); lastDate = messageDate; }
          messagesWithSeparators.push(msg);
        });
        setMessages(messagesWithSeparators);
      } catch (error) { console.error("Error fetching messages:", error); }
    };
    fetchMessages();
  }, [activeChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const optimisticMessage = { 
        _id: Date.now(), 
        body: newMessage, 
        fromMe: true, 
        status: 'sent', 
        timestamp: currentTimestamp 
    };
    
    // --- FIX STARTS HERE ---

    // 1. Optimistically update the local message list for a fast UI
    setMessages(prev => [...prev, optimisticMessage]);
    
    // 2. Optimistically update the main conversations list
    const updatedConversations = conversations
      .map(convo => {
        if (convo._id === activeChat._id) {
          return {
            ...convo,
            lastMessage: newMessage,
            lastMessageTimestamp: currentTimestamp,
          };
        }
        return convo;
      })
      // Sort to bring the most recent chat to the top
      .sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    
    setConversations(updatedConversations);

    // 3. Clear the input field
    setNewMessage('');

    // 4. Send the message to the backend (Corrected API Call)
    try {
      // The data payload should be the second argument of axios.post
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages/send`,
        {
          body: newMessage,
          wa_id: activeChat._id,
          name: activeChat.name,
        }
      );
      // You could update the message status from 'sent' to 'delivered' here if needed
    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: Logic to show a 'failed to send' status on the UI
    }
    // --- FIX ENDS HERE ---
  };
  
  const handleMicClick = () => { console.log("Microphone clicked! (This is a simulation)"); };

  const filteredConversations = conversations.filter(convo =>
    convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderSidebarContent = () => {
    switch (activeView) {
      case 'status':
        return <StatusPanel onBack={() => handleViewChange('chats')} />;
      case 'settings':
        return <SettingsPanel onBack={() => handleViewChange('chats')} />;
      case 'myProfile':
        return <MyProfilePanel onBack={() => handleViewChange('chats')} />;
      case 'chats':
      default:
        return <ChatsPanel conversations={filteredConversations} activeChat={activeChat} setActiveChat={setActiveChat} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
    }
  };

  const renderMainContent = () => {
    if (activeView === 'chats' && activeChat) {
      return (
        <>
          <div className="chat-header" onClick={() => setProfileOpen(true)}>
            <button className="back-btn-mobile" onClick={(e) => { e.stopPropagation(); setActiveChat(null); }}><BackIcon /></button>
            <div className="avatar-placeholder"><UserIcon /></div>
            <div className="chat-header-info">
              <h3>{activeChat.name}</h3>
              <p className="chat-header-subtitle">click for contact info</p>
            </div>
          </div>
          <div className="message-list">
            {messages.map((msg) => {
              if (msg.type === 'date_separator') { const separatorDate = new Date(msg.date); const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate() - 1); const isToday = separatorDate.toDateString() === today.toDateString(); const isYesterday = separatorDate.toDateString() === yesterday.toDateString(); return (<div key={msg._id} className="date-separator"><span>{isToday ? 'Today' : isYesterday ? 'Yesterday' : separatorDate.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>); }
              return (<div key={msg._id} className={`message-bubble ${msg.fromMe ? 'from-me' : 'from-them'}`}><p className="message-body">{msg.body}</p><div className="message-meta"><span className="message-timestamp">{new Date(msg.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>{msg.fromMe && <span className={`status-ticks ${msg.status}`}>✓✓</span>}</div></div>);
            })}
          </div>
          <div className="chat-footer">
            {showEmojiPicker && <div className="emoji-picker-container" ref={emojiPickerRef}><Picker onEmojiClick={onEmojiClick} /></div>}
            <div className="input-container"><button type="button" className="icon-btn" onClick={() => setShowEmojiPicker(val => !val)}><EmojiIcon /></button><label htmlFor="file-upload" className="icon-btn"><AttachIcon /></label><input id="file-upload" type="file" style={{ display: 'none' }} /><form onSubmit={handleSendMessage} className="message-form"><input type="text" className="message-input" placeholder="Type a message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} /></form></div>
            {newMessage ? (<button type="button" className="mic-send-btn" onClick={handleSendMessage}><SendIcon /></button>) : (<button type="button" className="mic-send-btn" onClick={handleMicClick}><MicIcon /></button>)}
          </div>
        </>
      );
    }
    switch (activeView) {
      case 'status':
        return <StatusPlaceholder />;
      case 'settings':
        return <SettingsPlaceholder />;
      case 'myProfile':
        return <ProfilePlaceholder />;
      default:
        return <div className="placeholder"><div className="placeholder-icon large"><ChatsIcon/></div><h2>WhatsApp Web</h2><p>Send and receive messages without keeping your phone online.<br/>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p><div className="encrypted-message"><LockIcon /> Your personal messages are end-to-end encrypted</div></div>;
    }
  };

  return (
    <div className={`App ${activeChat ? 'show-chat-window' : ''}`}>
      <div className="far-left-sidebar">
        <div className="far-left-icon-group">
          <button className={`icon-btn ${activeView === 'chats' ? 'active' : ''}`} onClick={() => handleViewChange('chats')}><ChatsIcon /></button>
          <button className={`icon-btn ${activeView === 'status' ? 'active' : ''}`} onClick={() => handleViewChange('status')}><StatusIcon /></button>
        </div>
        <div className="far-left-icon-group">
          <button className={`icon-btn ${activeView === 'settings' ? 'active' : ''}`} onClick={() => handleViewChange('settings')}><SettingsIcon /></button>
          <div className={`avatar-placeholder self ${activeView === 'myProfile' ? 'active' : ''}`} onClick={() => handleViewChange('myProfile')}><UserIcon/></div>
        </div>
      </div>
      <div className="main-interface">
        <div className="sidebar">
          {renderSidebarContent()}
        </div>
        <div className="chat-window">
          {renderMainContent()}
        </div>
      </div>
      {isProfileOpen && activeChat && (<div className="profile-sidebar"><div className="profile-header"><button onClick={() => setProfileOpen(false)} className="close-btn">X</button><h3>Contact info</h3></div><div className="profile-content"><div className="profile-avatar-section"><div className="profile-avatar"><UserIcon /></div><h2 className="profile-name">{activeChat.name}</h2><p className="profile-number">{`+${activeChat._id}`}</p></div><div className="profile-section"><h4>About</h4><p>Can't talk, WhatsApp only</p></div></div></div>)}
    </div>
  );
}

// --- Sidebar Content Components (No changes needed here) ---
const ChatsPanel = ({ conversations, activeChat, setActiveChat, searchQuery, setSearchQuery }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moreMenuRef]);

  return (
    <>
      <div className="main-sidebar-header"><h1 className="main-title">WhatsApp</h1><div className="header-icons"><button className="icon-btn"><NewChatIcon /></button><div className="more-menu-container" ref={moreMenuRef}><button className="icon-btn" onClick={() => setShowMoreMenu(val => !val)}><MoreIcon /></button>{showMoreMenu && (<div className="more-menu"><div className="menu-item"><NewGroupIcon /><span>New group</span></div><div className="menu-item"><StarIcon /><span>Starred messages</span></div><div className="menu-item"><LogoutIcon /><span>Log out</span></div></div>)}</div></div></div>
      <div className="sidebar-search"><div className="search-container"><input type="text" placeholder="Search or start a new chat" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div></div>
      <div className="filter-buttons-container"><button className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`} onClick={() => setActiveFilter('All')}>All</button><button className={`filter-btn ${activeFilter === 'Unread' ? 'active' : ''}`} onClick={() => setActiveFilter('Unread')}>Unread</button><button className={`filter-btn ${activeFilter === 'Groups' ? 'active' : ''}`} onClick={() => setActiveFilter('Groups')}>Groups</button></div>
      <div className="conversation-list">
        {conversations.length > 0 ? (
          conversations.map((convo) => (<div key={convo._id} className={`conversation-item ${activeChat?._id === convo._id ? 'active' : ''}`} onClick={() => setActiveChat(convo)}><div className="avatar-placeholder"><UserIcon /></div><div className="convo-details"><div className="convo-top-line"><span className="convo-name">{convo.name}</span><span className="convo-timestamp">{formatTimestamp(convo.lastMessageTimestamp)}</span></div><div className="convo-bottom-line"><p className="convo-message">{convo.lastMessage}</p></div></div></div>))
        ) : ( searchQuery && (<div className="no-results"><p>No chats found</p></div>) )}
      </div>
    </>
  );
};
const StatusPanel = ({ onBack }) => ( <div className="panel"><div className="panel-header"><button className="icon-btn" onClick={onBack}><BackIcon /></button><h2>Status</h2></div><div className="panel-content"><div className="status-item my-status"><div className="avatar-placeholder"><UserIcon /></div><div className="status-info"><h3>My status</h3><p>Click to add status update</p></div></div><h4 className="panel-subtitle">Recent updates</h4><div className="status-item"><div className="avatar-placeholder"><UserIcon /></div><div className="status-info"><h3>John Doe</h3><p>Today at 8:30 PM</p></div></div></div></div>);
const SettingsPanel = ({ onBack }) => ( <div className="panel"><div className="panel-header"><button className="icon-btn" onClick={onBack}><BackIcon /></button><h2>Settings</h2></div><div className="panel-content"><div className="settings-profile-summary"><div className="avatar-placeholder"><UserIcon /></div><div className="settings-info"><h3>Your Name</h3><p>Can't talk, WhatsApp only</p></div></div><div className="settings-list"><div className="settings-item"><AccountIcon /><span>Account</span></div><div className="settings-item"><PrivacyIcon /><span>Privacy</span></div><div className="settings-item"><ChatsIcon /><span>Chats</span></div><div className="settings-item"><HelpIcon /><span>Help</span></div></div></div></div>);
const MyProfilePanel = ({ onBack }) => ( <div className="panel"><div className="panel-header"><button className="icon-btn" onClick={onBack}><BackIcon /></button><h2>Profile</h2></div><div className="panel-content profile-page"><div className="profile-page-avatar"><div className="avatar-placeholder large"><UserIcon /></div></div><div className="profile-page-section"><label>Your name</label><div className="editable-field"><span>Your Name</span><EditIcon /></div></div><div className="profile-page-section"><label>About</label><div className="editable-field"><span>Can't talk, WhatsApp only</span><EditIcon /></div></div></div></div>);

// --- Placeholder Components (No changes needed here) ---
const StatusPlaceholder = () => (<div className="placeholder-container"><div className="placeholder-icon large"><StatusIcon /></div><h2>Share status updates</h2><p>Share photos, videos and text that disappear after 24 hours.</p><div className="encrypted-message"><LockIcon /> Your status updates are end-to-end encrypted</div></div>);
const SettingsPlaceholder = () => (<div className="placeholder-container"><div className="placeholder-icon large"><SettingsIcon /></div><h2>Settings</h2></div>);
const ProfilePlaceholder = () => (<div className="placeholder-container"><div className="placeholder-icon large"><UserIcon /></div><h2>Profile</h2></div>);

export default App;