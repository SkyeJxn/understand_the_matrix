import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home.jsx";
import LevelPage from "./routes/LevelPage.jsx";
import LevelView from "./routes/LevelView.jsx";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    document.body.classList.add("theme-green");
  })
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/:mode/:id" element={<LevelPage />} />
      
      <Route path="/:mode" element={<LevelView/>}/>

      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}