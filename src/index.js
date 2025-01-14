import React from 'react';
import ReactDOM from 'react-dom';  // PAS 'react-dom/client'
import App from './App';
// Import le CSS de base si tu veux
import './index.css';

// Méthode React 17 : ReactDOM.render(...)
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


// Enregistre le service worker pour activer la PWA
serviceWorkerRegistration.register();
