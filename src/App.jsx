import { useState } from "react";
import Home from "./pages/Home";
import Results from "./pages/Results";
import "./App.css";

function App() {
  const [showResults, setShowResults] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (userData) => {
    setError("");

    try {
      const formData = new FormData();

      if (userData.photo) {
        formData.append("photo", userData.photo);
      }

      const combinedText = [
        userData.bio?.trim() ? `Bio:\n${userData.bio.trim()}` : "",
        userData.posts?.trim() ? `Posts:\n${userData.posts.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      if (combinedText) {
        formData.append("text", combinedText);
      }

      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      console.log("Backend analysis:", data);

      setAnalysis(data);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Something went wrong while analyzing your content."
      );
    }
  };

  return (
    <>
      {!showResults ? (
        <>
          <Home onAnalyze={handleAnalyze} />

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}
        </>
      ) : (
        <Results
          analysis={analysis}
          onBack={() => {
            setShowResults(false);
            setAnalysis(null);
          }}
        />
      )}
    </>
  );
}

export default App;