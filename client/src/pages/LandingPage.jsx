import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import API_BASE_URL from '../config';
import { getUserId } from '../utils/session';

export default function LandingPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus("");

    const file = fileInputRef.current?.files?.[0];

    try {
      let userIdFromServer = null;
      
      if (file) {
        // Upload image and create user
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Upload failed");
        }
        
        userIdFromServer = data.userId;
      } else {
        // No image - create user without image
        const res = await fetch(`${API_BASE_URL}/api/users/create`, {
          method: "POST",
        });
        const data = await res.json();
        userIdFromServer = data.userId;
      }
      
      // Save userId to localStorage
      localStorage.setItem("vaishworld_userId", userIdFromServer);
      
      // Now use getUserId() to verify the user was created
      const userId = await getUserId();
      console.log("User ID verified:", userId);
      
      navigate("/page-2");
      
    } catch (err) {
      console.error("Error:", err);
      setStatus("Upload failed, but you can still continue.");
      
      // Try to get or create userId even if upload failed
      try {
        const userId = await getUserId();
        if (userId) {
          console.log("User ID recovered:", userId);
        }
      } catch (e) {
        console.error("Failed to recover user ID:", e);
      }
      
      // Try to continue anyway
      navigate("/page-2");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="landing-page">
      <header className="hero">
        <div className="hero-text">
          <h1 className="hero-title">
            VAISH<span className="hero-title-accent">world.exe</span>
          </h1>
          <p className="hero-line" id="line1">There are easier ways to know me.</p>
          <p className="hero-line" id="line2">This ain't one of them.</p>
        </div>
        <div className="hero-image">
          <img src="/myimage.png" alt="" />
        </div>
      </header>

      <section className="agreement">
        <p className="agreement-heading">USER ORIENTATION &amp; PARTICIPATION AGREEMENT</p>
        <p>Version 1.0.0 (Revision Pending)</p>
        <p>Welcome.</p>
        <p>
          By proceeding beyond this point, you acknowledge that you have voluntarily entered an
          interactive environment whose primary purpose, secondary purpose, and actual purpose
          may not necessarily align.
        </p>
        <p>
          Please read the following information carefully. Failure to read these instructions
          does not exempt you from their consequences, nor does successfully reading them
          guarantee that you will understand what is happening.
        </p>

        <p className="section-heading">1. General Notice</p>
        <p>
          This environment has been constructed using a combination of questionable decisions,
          unnecessary attention to detail, caffeine, sleep deprivation, and a concerning amount
          of overthinking.
        </p>
        <p>
          The participant accepts that certain events, interactions, conversations, and
          discoveries may occur in an order that appears intentional despite having originated
          from complete chaos.
        </p>

        <p className="section-heading">2. Eligibility</p>
        <p>Participation is recommended for individuals who:</p>
        <ul>
          <li>possess basic reading ability;</li>
          <li>are capable of pressing buttons without excessive force;</li>
          <li>occasionally make impulsive life decisions;</li>
          <li>
            understand that curiosity frequently creates additional problems instead of solving
            existing ones.
          </li>
        </ul>
        <p>No prior experience is required.</p>
        <p>No preparation will help.</p>

        <p className="section-heading">3. Expected Behaviour</p>
        <p>Participants are encouraged to:</p>
        <ul>
          <li>click things;</li>
          <li>hover over suspicious objects;</li>
          <li>question their own decisions;</li>
          <li>continue despite mild confusion.</li>
        </ul>
        <p>Participants are discouraged from:</p>
        <ul>
          <li>attempting to speedrun the experience;</li>
          <li>assuming every interaction serves a meaningful purpose;</li>
          <li>expecting emotional stability throughout the duration.</li>
        </ul>
        <p>The system reserves the right to judge all responses silently.</p>

        <p className="section-heading">4. Accuracy of Information</p>
        <p>Some statements presented throughout this environment are objectively true.</p>
        <p>Others are emotionally true.</p>
        <p>Several exist purely because they sounded funny.</p>
        <p>The participant assumes full responsibility for determining which category applies.</p>

        <p className="section-heading">5. Emotional Side Effects</p>
        <p>Possible side effects include:</p>
        <ul>
          <li>brief laughter;</li>
          <li>second-hand embarrassment;</li>
          <li>nostalgia;</li>
          <li>curiosity;</li>
          <li>mild frustration;</li>
          <li>excessive confidence immediately followed by complete confusion.</li>
        </ul>
        <p>These effects are temporary in most documented cases.</p>

        <p className="section-heading">6. Technical Difficulties</p>
        <p>
          Should any component fail to function as expected, participants are encouraged to
          consider the following possibilities before reporting an error:
        </p>
        <ol>
          <li>It is intentional.</li>
          <li>It is not intentional but now looks intentional.</li>
          <li>It has become a feature.</li>
        </ol>

        <p className="section-heading">7. Completion</p>
        <p>Reaching the final page should not be interpreted as completion.</p>
        <p>
          Completion is a highly subjective concept and may vary significantly depending on
          personal interpretation, curiosity, available free time, and willingness to click
          suspicious buttons.
        </p>

        <p className="section-heading">8. Final Disclaimer</p>
        <p>No guarantees are provided regarding:</p>
        <ul>
          <li>satisfaction,</li>
          <li>closure,</li>
          <li>understanding,</li>
          <li>personal growth,</li>
          <li>or your ability to explain this experience to another person.</li>
        </ul>
        <p>
          Proceed only if you are comfortable with discovering things that may or may not have
          been meant for you.
        </p>

        <p className="section-heading">Acknowledgement</p>
        <p>By selecting Continue, you confirm that:</p>
        <ul>
          <li>you have skimmed these instructions instead of reading them properly;</li>
          <li>you fully accept responsibility for whatever happens next;</li>
          <li>you understand that turning back is still possible;</li>
          <li>...but considerably less interesting.</li>
        </ul>
      </section>

      <form className="auth-bar" onSubmit={handleSubmit}>
        <label className="auth-label" htmlFor="auth-image">
          For Authentication please upload a picture.
        </label>
        <div className="auth-controls">
          <button
            type="button"
            className="auth-input"
            onClick={() => fileInputRef.current?.click()}
          >
            {fileName || "Choose an image..."}
          </button>
          <input
            id="auth-image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "..." : "SUBMIT"}
          </button>
        </div>
        {status && <p className="auth-status">{status}</p>}
      </form>
    </div>
  );
}