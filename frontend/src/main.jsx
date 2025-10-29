// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';  // ← lấy đúng hàm createRoot
import './index.css';
import App from './App';
import axios from 'axios';

// Giảm thiểu phải viết full URL mỗi lần gọi
axios.defaults.baseURL = 'https://api.dailywithminh.com';
axios.defaults.withCredentials = true;
const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
