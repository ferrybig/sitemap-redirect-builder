import React from 'react'
import App from './App.tsx'
import './index.css'

export function createApp() {
  return {
    jsx: (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  };
}
