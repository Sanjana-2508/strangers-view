function Results({ analysis, onBack }) {
  const score = analysis?.score || {
    total: 0,
    level: "low",
    breakdown: [],
  };

  const photo = analysis?.photo || {
    has_exif: false,
    gps: null,
    taken_at: null,
    device: null,
  };

  const text = analysis?.text || {
    clues: [],
    stranger_summary: "No text was provided to analyze.",
    scam_message: "",
    fixes: [],
  };

  const clues = text.clues || [];

  const level = score.level
    ? score.level.toUpperCase()
    : "LOW";

  // Convert backend clue types into nicer display names/icons
  const clueInfo = {
    college: {
      icon: "🎓",
      title: "College",
    },
    workplace: {
      icon: "💼",
      title: "Workplace",
    },
    home_area: {
      icon: "🏠",
      title: "Home Area",
    },
    city: {
      icon: "📍",
      title: "City",
    },
    routine: {
      icon: "⏰",
      title: "Daily Routine",
    },
    birthday: {
      icon: "🎂",
      title: "Birthday",
    },
    family: {
      icon: "👨‍👩‍👧",
      title: "Family",
    },
    friends: {
      icon: "👥",
      title: "Friends",
    },
    travel_plans: {
      icon: "✈️",
      title: "Travel Plans",
    },
    contact_info: {
      icon: "📞",
      title: "Contact Info",
    },
    other: {
      icon: "🔎",
      title: "Personal Clue",
    },
  };

  // Photo-related fixes
  const photoFixes = [];

  if (photo.gps) {
    photoFixes.push("Turn off location on your camera app");
  }

  if (photo.device) {
    photoFixes.push("Remove hidden photo data before sharing files");
  }

  // Combine backend fixes
  const fixes = [
    ...photoFixes,
    ...(text.fixes || []),
    ...(analysis?.fixes || []),
  ].filter((fix, index, arr) => arr.indexOf(fix) === index);

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

            <div className="score-number">
              {score.total}
            </div>

            <div className="score-total">
              / 100
            </div>

          </div>

          <div>

            <p className="score-label">
              PRIVACY RISK
            </p>

            <h2>
              {level} EXPOSURE
            </h2>

            <p className="score-description">
              {score.total === 0
                ? "Very little personal information was detected."
                : score.total <= 33
                ? "Only a small amount of potentially sensitive information was detected."
                : score.total <= 66
                ? "Some personal clues could be combined by a stranger."
                : "Multiple personal clues can be combined."
              }
            </p>

          </div>

        </div>


        {/* REAL BACKEND BREAKDOWN */}

        <div className="risk-bars">

          {score.breakdown && score.breakdown.length > 0 ? (

            score.breakdown.map((item, index) => {

              const percentage = Math.min(
                (item.points / 30) * 100,
                100
              );

              return (
                <div className="risk-row" key={index}>

                  <span>
                    {item.label}
                  </span>

                  <strong>
                    {item.points}
                  </strong>

                  <div className="bar">

                    <div
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>

                  </div>

                </div>
              );

            })

          ) : (

            <p>
              No specific risk factors detected.
            </p>

          )}

        </div>

      </div>


      {/* STRANGER'S VIEW */}

      <section className="stranger-card">

        <div className="stranger-heading">

          <div className="detective-icon">
            🕵️
          </div>

          <div>

            <p>
              STRANGER'S VIEW
            </p>

            <h2>
              What could someone figure out?
            </h2>

          </div>

        </div>


        <div className="stranger-profile">

          <div className="profile-line">

            <span>👤</span>

            <p>
              {text.stranger_summary ||
                "No significant personal information was detected."}
            </p>

          </div>

          {photo.gps && (
            <div className="profile-line">

              <span>📍</span>

              <p>
                Your photo contains
                <strong> GPS location data</strong>.
              </p>

            </div>
          )}

          {photo.taken_at && (
            <div className="profile-line">

              <span>⏰</span>

              <p>
                Your photo contains
                <strong> date and time information</strong>.
              </p>

            </div>
          )}

          {photo.device && (
            <div className="profile-line">

              <span>📱</span>

              <p>
                Your photo contains
                <strong> device information</strong>.
              </p>

            </div>
          )}

        </div>


        <div className="clue-count">

          <span>
            🧩 {clues.length} CLUE{clues.length !== 1 ? "S" : ""} CONNECTED
          </span>

          <div className="profile-insight">

            <strong>
              What a stranger could infer
            </strong>

            <p>
              {text.stranger_summary ||
                "No significant personal information was detected."}
            </p>

          </div>

        </div>

      </section>


      {/* EXPOSED CLUES */}

      <section className="clues-section">

        <div className="section-heading">

          <p>
            🔎 EXPOSED CLUES
          </p>

          <h2>
            Small clues can add up.
          </h2>

        </div>


        <div className="clue-grid">

          {clues.length > 0 ? (

            clues.map((clue, index) => {

              const info =
                clueInfo[clue.type] || clueInfo.other;

              return (

                <div
                  className="clue-card"
                  key={index}
                >

                  <div className="clue-top">

                    <div className="clue-icon">
                      {info.icon}
                    </div>

                    <span
                      className={`risk ${clue.risk}`}
                    >
                      {clue.risk.toUpperCase()}
                    </span>

                  </div>

                  <h3>
                    {info.title}
                  </h3>

                  <p>
                    {clue.why || clue.evidence}
                  </p>

                  {clue.found && (
                    <small>
                      Found: <strong>{clue.found}</strong>
                    </small>
                  )}

                </div>

              );

            })

          ) : (

            <div className="clue-card">

              <div className="clue-top">

                <div className="clue-icon">
                  🛡️
                </div>

              </div>

              <h3>
                No text clues detected
              </h3>

              <p>
                No potentially identifying clues were found
                in the text you provided.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* CLUE CONNECTION */}

      <section className="connection-section">

        <div className="section-heading">

          <p>
            🧩 CLUE CONNECTION
          </p>

          <h2>
            Small clues become a bigger picture.
          </h2>

        </div>


        <div className="connection-card">

          {clues.length > 0 ? (

            clues.slice(0, 3).map((clue, index) => {

              const info =
                clueInfo[clue.type] || clueInfo.other;

              return (
                <div key={index}>

                  <div className="connection-item">

                    <div className="connection-icon">
                      {info.icon}
                    </div>

                    <div>

                      <strong>
                        {info.title}
                      </strong>

                      <span>
                        {clue.evidence}
                      </span>

                    </div>

                  </div>

                  {index < Math.min(clues.length, 3) - 1 && (
                    <div className="connection-line"></div>
                  )}

                </div>
              );

            })

          ) : (

            <div className="connection-item">

              <div className="connection-icon">
                🛡️
              </div>

              <div>

                <strong>
                  No connected text clues
                </strong>

                <span>
                  Nothing significant was detected.
                </span>

              </div>

            </div>

          )}


          <div className="connection-result">

            <span>
              STRANGER COULD INFER
            </span>

            <strong>
              {text.stranger_summary ||
                "Very little information could be inferred."}
            </strong>

            <p>
              Individually these clues may seem harmless.
              Together they can reveal more information.
            </p>

          </div>

        </div>

      </section>


      {/* SIMULATED THREAT */}

      {text.scam_message && (

        <section className="threat-card">

          <div className="threat-label">
            ⚠️ EXAMPLE SCAM (FOR AWARENESS)
          </div>

          <h2>
            How could these clues be misused?
          </h2>

          <p>
            A scammer could combine publicly visible clues
            to make a targeted message appear more believable.
          </p>


          <div className="threat-example">

            <div className="message-header">

              <span>
                📨 Example message
              </span>

              <span>
                SIMULATION
              </span>

            </div>

            <div className="fake-message">

              <p>
                {text.scam_message}
              </p>

            </div>

          </div>

          <p className="simulation-note">
            This is a simulated example for awareness.
            It does not contain a real link or contact information.
          </p>

        </section>

      )}


      {/* PROTECTION */}

      <section className="protection-section">

        <div className="section-heading">

          <p>
            🛡 PROTECT YOURSELF
          </p>

          <h2>
            Reduce what strangers can discover.
          </h2>

        </div>


        <div className="fix-grid">

          {fixes.length > 0 ? (

            fixes.map((fix, index) => (

              <div
                className="fix-card"
                key={index}
              >

                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>
                  Privacy fix
                </h3>

                <p>
                  {fix}
                </p>

              </div>

            ))

          ) : (

            <div className="fix-card">

              <span>
                ✓
              </span>

              <h3>
                No immediate fixes needed
              </h3>

              <p>
                No specific privacy fixes were generated
                from this analysis.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* BEFORE / AFTER */}

      <section className="before-after">

        <div className="exposure-box">

          <span>
            CURRENT SCORE
          </span>

          <strong>
            {score.total}
          </strong>

          <p>
            {level} EXPOSURE
          </p>

        </div>


        <div className="arrow">
          →
        </div>


        <div className="exposure-box after">

          <span>
            AFTER FIXES
          </span>

          <strong>
            —
          </strong>

          <p>
            Re-analyze after applying fixes
          </p>

        </div>

      </section>


      <div className="results-footer">
        Stranger's View • Privacy awareness simulation
      </div>

    </div>
  );
}

export default Results;