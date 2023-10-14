import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Board from "./pages/Board.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Board/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
