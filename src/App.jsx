// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import Mapa from './components/Map';
import Chat from './components/Chat';
import ChatConductor from './components/ChatConductor';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



const App = () => {
  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (userName.trim()) {
      setIsSubmitted(true);
      fetch('http://localhost:8080/start', {
        method: 'GET',
      }).then(() => {
        console.log('Iniciado el envío de coordenadas');
      }).catch((error) => {
        console.error('Error al iniciar el envío de coordenadas:', error);
      });
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/chatConductor" element={<ChatConductor />} />
        <Route path="/" element={
          <div className="app-container">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="form-container">
                <div className="welcome-message">Bienvenido a Ober</div>
                <label htmlFor="username" className="form-label">Ingresa su nombre:</label>
                <input
                  type="text"
                  id="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="form-input"
                />
                <button type="submit" className="form-button">Submit</button>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', height: '100vh' }}>
                <div style={{overflowY: 'auto', borderRight: '1px solid #ccc' }}>
                  <Mapa />
                </div>
                <div style={{ overflowY: 'auto' }}>

                  <Chat userName={userName} />
                </div>
              </div>
            )}
          </div>
        } />
      </Routes>
    </Router>
  );
};
export default App;
