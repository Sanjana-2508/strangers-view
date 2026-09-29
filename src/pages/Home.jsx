import { useState } from "react";

function Home({ onAnalyze }) {
  const [photo, setPhoto] = useState(null);
  const [bio, setBio] = useState("");
  const [posts, setPosts] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
  setLoading(true);

  setTimeout(() => {
    onAnalyze({
      photo,
      bio,
      posts
    });

    setLoading(false);
  }, 1500);
};

  return (
    <div className="home">
        <div className="navbar">
          <div className="logo">
            ◇ STRANGER'S VIEW
    </div>

  <div className="nav-status">
    ● Privacy Check
  </div>
</div>

      <div className="hero">
        <p className="small-title">🛡 STRANGER'S VIEW</p>

        <h1>
          See yourself
          <br />
          through a stranger's eyes.
        </h1>

        <p className="subtitle">
          Discover what someone could learn about you
          from one photo and a few posts.
        </p>
      </div>

      <div className="input-card">

        <h2>Upload your content</h2>

        <p className="card-description">
          See what a stranger could discover from it.
        </p>

        <label>📸 Upload a photo</label>

        <div className="upload-box">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
          />

          {photo && (
            <p>Selected: {photo.name}</p>
          )}
        </div>

        <label>👤 Your bio</label>

        <textarea
          placeholder="Example: CSE student | BMSIT | Bangalore"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <label>📝 Your posts</label>

        <textarea
          className="posts-input"
          placeholder="Example: Leaving for college at 8 AM tomorrow..."
          value={posts}
          onChange={(e) => setPosts(e.target.value)}
        />

        <button onClick={handleAnalyze} disabled={loading}>
           {loading ? "🔍 Analyzing your exposure..." : "🔍 Analyze My Exposure"}
        </button>

      </div>

    </div>
  );
}

export default Home;