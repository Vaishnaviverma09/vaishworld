import React, { useState, useEffect } from "react";
import "./FeedbackPage.css";

const collageImages = [
  { src: "/vinyl.png", alt: "" },
  { src: "/book.png", alt: "" },
  { src: "/arch.png", alt: "" },
  { src: "/chiffon.png", alt: "" },
  { src: "/mirror.png", alt: "" },
  { src: "/Jaylin.png", alt: "" },
  { src: "/model.png", alt: "" },
  { src: "/car.png", alt: "" },
  { src: "/theatre.png", alt: "" },
  { src: "/sunset.png", alt: "" },
];

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("vaishworld_userId");
    if (storedId) {
      setUserId(storedId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setStatus("Please enter your feedback.");
      return;
    }

    if (!userId) {
      setStatus("User ID not found. Please start from the beginning.");
      return;
    }

    setSubmitting(true);
    setStatus("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: message.trim(),
          userId: userId
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }
      
      setStatus("Thank you — your feedback has been received.");
      setMessage("");
    } catch (err) {
      console.error("Feedback error:", err);
      setStatus("Something went wrong sending that. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="collage-grid">
        {collageImages.map((img, i) => (
          <div className={`collage-tile tile-${i}`} key={i}>
            <img src={img.src} alt={img.alt} />
          </div>
        ))}

        <div className="collage-prompt">
          <p>Now that you know me a little...</p>
          <p>What did you think?</p>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <textarea
            className="feedback-input"
            placeholder="Type your feedback here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            disabled={submitting}
          />
          <button type="submit" className="feedback-submit" disabled={submitting}>
            {submitting ? "Sending..." : "SEND"}
          </button>
          {status && <p className="feedback-status">{status}</p>}
        </form>
      </div>
    </div>
  );
}