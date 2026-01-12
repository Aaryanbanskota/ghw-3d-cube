import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [note, setNote] = useState("");
  const [notesList, setNotesList] = useState([]);

  const addNote = () => {
    const noteData = { text: note, id: Math.random() };
    socket.emit("send_note", noteData);
    setNotesList((prev) => [...prev, noteData]); 
    setNote("");
  };

  useEffect(() => {
    socket.on("receive_note", (data) => {
      setNotesList((prev) => [...prev, data]);
    });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Live Classroom Wall</h1>
      <input 
        value={note} 
        onChange={(e) => setNote(e.target.value)} 
        placeholder="Type a sticky note..." 
      />
      <button onClick={addNote}>Post to Wall</button>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {notesList.map((n) => (
          <div key={n.id} style={stickyStyle}>
            {n.text}
          </div>
        ))}
      </div>
    </div>
  );
}

const stickyStyle = {
  background: '#fff385',
  padding: '15px',
  margin: '10px',
  width: '150px',
  height: '150px',
  boxShadow: '5px 5px 7px rgba(0,0,0,0.1)',
  transform: 'rotate(-2deg)'
};

export default App;