import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AIChatProvider } from './context/AIChatContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AIChatProvider>
          <App />
        </AIChatProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
