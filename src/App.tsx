// src/App.tsx
import { useEffect } from 'react';
import AppRoutes from './app/routes';
import { initLanguage } from './shared/utils/i18n';
import { initTheme } from './shared/utils/theme';

function App() {
  // Initialize language and theme on app start
  useEffect(() => {
    initLanguage();
    initTheme();
  }, []);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;