function Results({ onBack }) {
  const clues = [
    {
      icon: "📍",
      title: "Location",
      text: "Your content suggests you are around Bengaluru.",
      risk: "HIGH"
    },
    {
      icon: "🎓",
      title: "Education",
      text: "Your college or student identity may be identifiable.",
      risk: "MEDIUM"
    },
    {
      icon: "⏰",
      title: "Daily Routine",
      text: "A post suggests you may leave for college around 8 AM.",
      risk: "HIGH"
    },
    {
      icon: "📸",
      title: "Photo Clues",
      text: "Background details may reveal where the photo was taken.",
      risk: "MEDIUM"
    }
  ];

  return (
    <div className="results-page">

      {/* TOP BAR */}

      <div className="results-nav">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div className="results-logo">
          ◇ STRANGER'S VIEW
        </div>

        <div className="privacy-status">
          ● ANALYSIS COMPLETE
        </div>
      </div>


      {/* HEADER */}

      <div className="results-header">

        <div className="result-label">
          YOUR PRIVACY EXPOSURE
        </div>

        <h1>
          What could a stranger
          <br />
          <span>learn about you?</span>
        </h1>

        <p>
          We connected small clues across your photo, bio and posts
          to show what information could become visible.
        </p>

      </div>


      {/* RISK SCORE */}

      <div className="risk-section">

        <div className="score-area">

          <div className="score-circle">
            <div className="score-number">76</div>
            <div className="score-total">/ 100</div>
          </div>

          <div>
            <p className="score-label">PRIVACY RISK</p>

            <h2>HIGH EXPOSURE</h2>

            <p className="score-description">
              Multiple personal clues can be combined.
            </p>
          </div>

        </div>


        <div className="risk-bars">

          <div className="risk-row">
            <span>Location</span>
            <strong>85</strong>

            <div className="bar">
              <div style={{ width: "85%" }}></div>
            </div>
          </div>

          <div className="risk-row">
            <span>Identity</span>
            <strong>70</strong>

            <div className="bar">
              <div style={{ width: "70%" }}></div>
            </div>
          </div>

          <div className="risk-row">
            <span>Routine</span>
            <strong>90</strong>

            <div className="bar">
              <div style={{ width: "90%" }}></div>
            </div>
          </div>

          <div className="risk-row">
            <span>Personal</span>
            <strong>50</strong>

            <div className="bar">
              <div style={{ width: "50%" }}></div>
            </div>
          </div>

        </div>

      </div>


      {/* STRANGER'S VIEW */}

      <section className="stranger-card">

        <div className="stranger-heading">

          <div className="detective-icon">
            🕵️
          </div>

          <div>
            <p>STRANGER'S VIEW</p>
            <h2>What could someone figure out?</h2>
          </div>

        </div>


        <div className="stranger-profile">

          <div className="profile-line">
            <span>👤</span>
            <p>
              Likely a <strong>college student</strong>
              studying computer science.
            </p>
          </div>

          <div className="profile-line">
            <span>📍</span>
            <p>
              Appears to spend time around
              <strong> Bengaluru</strong>.
            </p>
          </div>

          <div className="profile-line">
            <span>⏰</span>
            <p>
              May have a predictable
              <strong> morning college routine</strong>.
            </p>
          </div>

          <div className="profile-line">
            <span>🎓</span>
            <p>
              College identity may be inferred
              from combined clues.
            </p>
          </div>

        </div>


                <div className="clue-count">

          <span>🧩 4 CLUES CONNECTED</span>

          <div className="profile-insight">

            <strong>What a stranger could infer</strong>

            <p>
              College student in Bengaluru with a potentially
              predictable morning routine.
            </p>

          </div>

        </div>

      </section>


      {/* EXPOSED CLUES */}

      <section className="clues-section">

        <div className="section-heading">
          <p>🔎 EXPOSED CLUES</p>
          <h2>Small clues can add up.</h2>
        </div>


        <div className="clue-grid">

          {clues.map((clue, index) => (

            <div className="clue-card" key={index}>

              <div className="clue-top">

                <div className="clue-icon">
                  {clue.icon}
                </div>

                <span className={`risk ${clue.risk.toLowerCase()}`}>
                  {clue.risk}
                </span>

              </div>

              <h3>{clue.title}</h3>

              <p>{clue.text}</p>

            </div>

          ))}

        </div>

      </section>

            {/* CLUE CONNECTION */}

      <section className="connection-section">

        <div className="section-heading">
          <p>🧩 CLUE CONNECTION</p>
          <h2>Small clues become a bigger picture.</h2>
        </div>

        <div className="connection-card">

          <div className="connection-item">
            <div className="connection-icon">🎓</div>
            <div>
              <strong>College identity</strong>
              <span>CSE student + college references</span>
            </div>
          </div>

          <div className="connection-line"></div>

          <div className="connection-item">
            <div className="connection-icon">📍</div>
            <div>
              <strong>Location</strong>
              <span>Photo + location-related clues</span>
            </div>
          </div>

          <div className="connection-line"></div>

          <div className="connection-item">
            <div className="connection-icon">⏰</div>
            <div>
              <strong>Routine</strong>
              <span>Repeated timing or schedule clues</span>
            </div>
          </div>

          <div className="connection-result">
            <span>STRANGER COULD INFER</span>

            <strong>
              Student identity + location + routine
            </strong>

            <p>
              Individually these clues may seem harmless.
              Together they reveal a much more detailed profile.
            </p>
          </div>

        </div>

      </section>


      {/* SIMULATED THREAT */}

      <section className="threat-card">

        <div className="threat-label">
          ⚠️ SIMULATED MISUSE SCENARIO
        </div>

        <h2>
          How could these clues be combined?
        </h2>

        <p>
          A scammer could combine your college, location and
          routine information to make a targeted message appear
          more believable.
        </p>


        <div className="threat-example">

          <div className="message-header">
            <span>📨 Example message</span>
            <span>SIMULATION</span>
          </div>

          <div className="fake-message">
            <strong>College Notice</strong>

            <p>
              Your college account requires verification.
              Please complete the verification process...
            </p>

            <button>
              Example suspicious link
            </button>
          </div>

        </div>

        <p className="simulation-note">
          This is a simulated example showing why combining
          seemingly harmless clues can increase risk.
        </p>

      </section>


      {/* PROTECTION */}

      <section className="protection-section">

        <div className="section-heading">
          <p>🛡 PROTECT YOURSELF</p>
          <h2>Reduce what strangers can discover.</h2>
        </div>


        <div className="fix-grid">

          <div className="fix-card">
            <span>01</span>
            <h3>Remove photo metadata</h3>
            <p>
              Strip GPS information before uploading photos.
            </p>
          </div>

          <div className="fix-card">
            <span>02</span>
            <h3>Hide exact routines</h3>
            <p>
              Avoid posting schedules or locations in real time.
            </p>
          </div>

          <div className="fix-card">
            <span>03</span>
            <h3>Review old posts</h3>
            <p>
              Remove unnecessary personal information from older content.
            </p>
          </div>

        </div>

      </section>


      {/* BEFORE / AFTER */}

      <section className="before-after">

        <div className="exposure-box">

          <span>BEFORE</span>

          <strong>76</strong>

          <p>HIGH EXPOSURE</p>

        </div>


        <div className="arrow">
          →
        </div>


        <div className="exposure-box after">

          <span>AFTER FIXES</span>

          <strong>31</strong>

          <p>LOWER EXPOSURE</p>

        </div>

      </section>


      <div className="results-footer">
        Stranger's View • Privacy awareness simulation
      </div>

    </div>
  );
}

export default Results;