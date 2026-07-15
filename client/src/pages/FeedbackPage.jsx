import React, { useState, useEffect } from "react";
import "./FeedbackPage.css";
import API_BASE_URL from '../config';
import { getUserId, clearUserSession } from '../utils/session';

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
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const initUser = async () => {
      try {
        const id = await getUserId();
        if (id) {
          setUserId(id);
          setStatus("");
        } else {
          // Try one more time with a fresh session
          clearUserSession();
          const retryId = await getUserId();
          if (retryId) {
            setUserId(retryId);
            setStatus("");
          } else {
            setStatus("Unable to create user session. Please refresh the page.");
          }
        }
      } catch (err) {
        console.error("Error initializing user:", err);
        setStatus("Error creating user session. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setStatus("Please enter your feedback.");
      return;
    }

    // If no userId, try to create one
    let currentUserId = userId;
    if (!currentUserId) {
      setStatus("Creating user session...");
      try {
        const id = await getUserId();
        if (id) {
          currentUserId = id;
          setUserId(id);
          setStatus("");
        } else {
          setStatus("Unable to create user session. Please refresh.");
          return;
        }
      } catch (err) {
        setStatus("Error creating user session. Please refresh.");
        return;
      }
    }

    setSubmitting(true);
    setStatus("Sending...");

    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: message.trim(),
          userId: currentUserId
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // If server says user not found, try to recreate user
        if (res.status === 404 && data.error?.includes("User not found")) {
          clearUserSession();
          const newId = await getUserId();
          if (newId) {
            setUserId(newId);
            setStatus("User session recreated. Please try submitting again.");
            setSubmitting(false);
            return;
          }
        }
        throw new Error(data.error || "Request failed");
      }
      
      setStatus("Thank you — your feedback has been received! ❤️");
      setMessage("");
    } catch (err) {
      console.error("Feedback error:", err);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="feedback-page">
        <div className="collage-grid" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: 'white', fontSize: '1.2rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

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