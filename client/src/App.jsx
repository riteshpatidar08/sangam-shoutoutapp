import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Send, Megaphone, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_URL = 'http://localhost:5000/api/shoutouts';

function App() {
  const [shoutouts, setShoutouts] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState('#fbbf24');

  const colors = ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa'];

  useEffect(() => {
   
  }, []);

  const fetchShoutouts = async () => {
 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      const res = await axios.post(API_URL, { message, color: selectedColor });
      setShoutouts([res.data, ...shoutouts]);
      setMessage('');
    } catch (err) {
      alert("Oops! Post failed. Try again.");
    }
  };

  const handleLike = async (id) => {
    try {
        await axios.post(`${API_URL}/${id}/like`);
        setShoutouts(shoutouts.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
    } catch (err) {
        console.error("Like failed:", err);
    }
  };

  return (
    <div className="app-container">
      <header>
        <motion.div 
            initial={{ x: -100, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
        >
            <h1>SHOUT! <Megaphone size={60} style={{ verticalAlign: 'middle', transform: 'rotate(-15deg)' }} /></h1>
            <br />
            <p>Speak your mind anonymously. No filters. Just vibes.</p>
        </motion.div>
      </header>

      <section className="shoutout-form">
        <form onSubmit={}>
          <textarea
            placeholder="What's on your mind?"
            rows="3"
            value={message}
            onChange={}
          />
          <div className="form-footer">
            <div className="color-picker">
              {colors.map(color => (
                <div
                  key={color}
                  className={`color-dot ${selectedColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            <button type="submit" className="post-btn">
              SEND <Send size={24} />
            </button>
          </div>
        </form>
      </section>

      <div className="shoutouts-grid">
        <AnimatePresence>
          {shoutouts.map((s, index) => (
            <motion.div
              key={s.id || s._id}
              initial={{ y: 50, opacity: 0, rotate: index % 2 === 0 ? -2 : 2 }}
              animate={{ y: 0, opacity: 1, rotate: index % 2 === 0 ? -2 : 2 }}
              whileHover={{ scale: 1.02, rotate: 0 }}
              className="shoutout-card"
              style={{ backgroundColor: s.color }}
            >
              <p className="message">{s.message}</p>
              <div className="footer">
                <span>{new Date(s.timestamp).toLocaleDateString()}</span>
                <button 
                    className="like-btn"
                    onClick={() => handleLike(s.id || s._id)}
                >
                  <Heart size={20} fill={s.likes > 0 ? "#000" : "none"} /> {s.likes}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <footer style={{ marginTop: '5rem', textAlign: 'center', fontWeight: 'bold' }}>
        <p>© 2026 SHOUT! BY RITESH</p>
      </footer>
    </div>
  );
}

export default App;
