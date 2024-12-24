import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Upload } from './pages/Upload';
import { Analysis } from './pages/Analysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;