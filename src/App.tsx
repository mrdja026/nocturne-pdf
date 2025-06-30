import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ViewPage from './pages/ViewPage';
import Header from './components/Header';

const App: React.FC = () => {
  const [imageBitmaps, setImageBitmaps] = useState<ImageBitmap[]>([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <Router>
      <Header theme={theme} onThemeChange={setTheme} />
      <Routes>
        <Route path="/" element={<HomePage onUploadComplete={setImageBitmaps} theme={theme} />} />
        <Route path="/view" element={<ViewPage imageBitmaps={imageBitmaps} />} />
      </Routes>
    </Router>
  );
};

export default App;
