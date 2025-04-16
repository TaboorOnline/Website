import React, { useEffect } from 'react';
import AppRoutes from './routes';
import { initLanguage } from './utils/i18n/i18n';
import { initTheme } from './utils/theme';

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