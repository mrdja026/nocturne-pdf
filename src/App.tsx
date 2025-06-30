import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ViewPage from './pages/ViewPage';

const App: React.FC = () => {
  const [imageBitmaps, setImageBitmaps] = useState<ImageBitmap[]>([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage onUploadComplete={setImageBitmaps} />} />
        <Route path="/view" element={<ViewPage imageBitmaps={imageBitmaps} />} />
      </Routes>
    </Router>
  );
};

export default App;
