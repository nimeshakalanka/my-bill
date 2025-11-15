import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // This points to App.jsx in the SAME folder (src)
import './index.css'        // This points to index.css in the SAME folder (src)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)