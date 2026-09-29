import { useState } from "react";
import Home from "./pages/Home";
import Results from "./pages/Results";
import "./App.css";

function App() {
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = (userData) => {
  console.log("User input:", userData);

  setShowResults(true);
};

  return (
    <>
      {!showResults ? (
        <Home onAnalyze={handleAnalyze} />
      ) : (
        <Results
          onBack={() => setShowResults(false)}
        />
      )}
    </>
  );
}

export default App;