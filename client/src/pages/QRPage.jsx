import React from "react";
import { useNavigate } from "react-router-dom";
import "./QRPage.css";

export default function QRPage() {
  const navigate = useNavigate();

  // Cache-busting query param so a fresh, random QR image is requested
  // from the server each time this page mounts.
  const qrSrc = "\qrcode_373783327_b5f87535deaf2789a486e0f90d3fe939.png";

  return (
    <div className="qr-page">
      <div className="qr-copy">
        <h2 className="qr-title">End of Transmission.</h2>
        <p>Thank you for participating in one of my many late-night extravaganzas.</p>
        <p>If you've made it this far, congratulations.</p>
        <p>
          You've successfully navigated caffeine-fueled thoughts, questionable humour,
          unnecessary details, and a brain that refuses to stay on one topic for longer than
          thirty seconds.
        </p>
        <p>
          Whether you laughed, judged me, got confused, or accidentally clicked your way
          here&mdash;I hope you found something worth remembering.
        </p>
        <p>The QR code below contains one final thing.</p>
        <p>Maybe it's important.</p>
        <p>Maybe it isn't.</p>
        <p>There's only one way to find out.</p>
        <p>Good luck.</p>
      </div>

      <button
        type="button"
        className="qr-card"
        onClick={() => navigate("/feedback")}
        aria-label="Continue to the feedback page"
      >
        <img src={qrSrc} alt="Scan for one final thing" />
      </button>

      <a
        className="qr-download"
        href={qrSrc}
        download="vaishworld-qr.png"
        onClick={(e) => e.stopPropagation()}
      >
        Download QR code
      </a>
    </div>
  );
}
