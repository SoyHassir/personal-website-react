import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker } from './utils/serviceWorkerRegistration.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registrar Service Worker después de que la app esté montada
if (import.meta.env.PROD) {
  registerServiceWorker();
}
