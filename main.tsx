import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Landing from './Landing.tsx';
import './index.css';

function Root() {
  const [entered, setEntered] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('app_entered') === '1';
  });
  useEffect(() => {
    if (entered) localStorage.setItem('app_entered', '1');
  }, [entered]);

  if (!entered) return <Landing onStart={() => setEntered(true)} />;
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
