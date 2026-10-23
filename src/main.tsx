import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard: if index.html standalone app is active, let it drive the UI seamlessly
if (!(window as any)._standaloneAppMounted) {
  const rootEl = document.getElementById('root');
  if (rootEl && !rootEl.hasChildNodes()) {
    createRoot(rootEl).render(<App />);
  }
}
