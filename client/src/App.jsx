import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import Level1Page from "./pages/Level1Page.jsx";
import PacmanPage from "./pages/PacmanPage.jsx";
import QRPage from "./pages/QRPage.jsx";
import FeedbackPage from "./pages/FeedbackPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/page-2" element={<Level1Page />} />
      <Route path="/pacman" element={<PacmanPage />} />
      <Route path="/qr" element={<QRPage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
    </Routes>
  );
}
