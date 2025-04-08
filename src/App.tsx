import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Index from "./pages/Index";
import Play from "./pages/Play";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import QuizDemo from "./pages/QuizDemo";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/play" element={<Play />} />
        <Route path="/search" element={<Search />} />
        <Route path="/quiz-demo" element={<QuizDemo />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
