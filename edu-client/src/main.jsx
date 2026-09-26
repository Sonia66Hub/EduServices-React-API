import React from 'react';
import ReactDOM from 'react-dom/client';


import 'bootstrap/dist/css/bootstrap.min.css';


import './index.css'; 
import './App.css'; 


import App from './App.jsx';


import { AuthProvider } from './context/AuthProvider';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>  
      <App />
    </AuthProvider>
  </React.StrictMode>
);