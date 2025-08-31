import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { PokemonDetailPage } from "@/pages/pokemon-detail";
import { ErrorBoundary } from "@/components/error-boundary";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
