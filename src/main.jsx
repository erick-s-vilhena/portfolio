import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './App.jsx'
import { CertificadoProvider } from './context/Contexto.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CertificadoProvider>
      <App />
    </CertificadoProvider>
  </StrictMode>,
)
