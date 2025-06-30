import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ViewPage from './pages/ViewPage';
import Header from './components/Header';
import type { TextLayer } from './types';

const App: React.FC = () => {
  const [imageBitmaps, setImageBitmaps] = useState<ImageBitmap[]>([]);
  const [textLayers, setTextLayers] = useState<TextLayer[][]>([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleUploadComplete = (bitmaps: ImageBitmap[], layers: TextLayer[][]) => {
    setImageBitmaps(bitmaps);
    setTextLayers(layers);
  };

  return (
    <Router>
      <Header theme={theme} onThemeChange={setTheme} />
      <Routes>
        <Route path="/" element={<HomePage onUploadComplete={handleUploadComplete} theme={theme} />} />
        <Route
          path="/view"
          element={<ViewPage imageBitmaps={imageBitmaps} textLayers={textLayers} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
