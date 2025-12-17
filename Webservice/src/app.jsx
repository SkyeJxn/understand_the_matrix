import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import LevelPage from "./routes/LevelPage";
import LevelView from "./routes/LevelView";
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