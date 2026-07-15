import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Level1Page.css";
import API_BASE_URL from '../config';
import { getUserId } from '../utils/session';

const questions = [
  {
    question: "What is a hobby she has never taken?",
    options: ["Ballet", "Fashion", "Dancing", "Music"],
    correct: "Dancing",
    correctImage: "/hailey_meme.jpg",
    wrongImage: "/kendal_meme_2.jpg",
  },
  {
    question: "How does she like her coffee?",
    options: ["Cappuccino", "Black", "Iced", "Mocha"],
    correct: "Black",
    correctImage: "/billie_meme.jpg",
    wrongImage: "/baby_meme.png",
  },
  {
    question: "What is her comfort movie?",
    options: ["ZNMD", "Highway", "Dear Zindagi", "Laila Majnu"],
    correct: "Dear Zindagi",
    correctImage: "/kris_meme.jpg",
    wrongImage: "/meme.png",
  },
  {
    question: "What is her ideal date idea?",
    options: ["Movie night", "Bookstore", "Shopping", "Picnic"],
    correct: "Bookstore",
    correctImage: "/kendal_meme_1.png",
    wrongImage: "/steve_meme.png",
  },
  {
    question: "Which outfit is her go-to?",
    options: [
      "Baggy jeans and oversized shirt",
      "A dress",
      "Kurti and jeans",
      "Baggy jeans crop top",
    ],
    correct: "Baggy jeans crop top",
    correctImage: "/hailey_meme_2.jpg",
    wrongImage: "/kid_meme.jpg",
  },
];

const FLIP_HOLD_MS = 1800;

const SHUFFLE_QUOTES = [
  '"I need coffee in an IV." — Gilmore Girls',
  "Odette deserved better.",
  "Every city has a personality. Mine just happens to wear a trench coat.",
  "Pizza is proof that happiness can, in fact, be sliced.",
  '"It is so much safer not to feel, not to let the world touch me."',
  "You thought this was going to be easy?",
  "You're surprisingly committed to this.",
  "I'm judging your quiz answers.",
  '"I thought five chances at a boyfriend was better odds!" – Kitty Song-Covey',
  "I drink only on two occasions ... when I'm in love and when I'm not - kaira",
  "Rahul Mishra Couture Fall 2026 collection, 'Devi', showcase at the Haute Couture Week, Paris",
];

const SHUFFLE_MOVE_MS = 700;
const SHUFFLE_FLIP_MS = 600;
const SHUFFLE_HOLD_MS = 5000;

export default function Level1Page() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [backImage, setBackImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [shufflePhase, setShufflePhase] = useState("idle");
  const [shuffleQuote, setShuffleQuote] = useState(null);

  // Get userId using the session helper
  useEffect(() => {
    const initUser = async () => {
      const id = await getUserId();
      setUserId(id);
      setLoading(false);
    };
    initUser();
  }, []);

  const handleShuffleClick = () => {
    if (shufflePhase !== "idle") return;

    const quote = SHUFFLE_QUOTES[Math.floor(Math.random() * SHUFFLE_QUOTES.length)];
    setShuffleQuote(quote);
    setShufflePhase("moving");

    let elapsed = SHUFFLE_MOVE_MS;
    setTimeout(() => setShufflePhase("flipped"), elapsed);

    elapsed += SHUFFLE_FLIP_MS + SHUFFLE_HOLD_MS;
    setTimeout(() => setShufflePhase("unflipping"), elapsed);

    elapsed += SHUFFLE_FLIP_MS;
    setTimeout(() => setShufflePhase("returning"), elapsed);

    elapsed += SHUFFLE_MOVE_MS;
    setTimeout(() => setShufflePhase("idle"), elapsed);
  };

  const shuffleCentered =
    shufflePhase === "moving" ||
    shufflePhase === "flipped" ||
    shufflePhase === "unflipping";
  const shuffleFlipped = shufflePhase === "flipped";

  const isLastQuestion = qIndex === questions.length - 1;

  const handleBegin = () => {
    if (!started) setStarted(true);
  };

  const saveQuizAnswer = async (questionIndex, question, selectedOption, isCorrect) => {
    if (!userId) {
      console.warn("No userId found, skipping save");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${API_BASE_URL}/api/quiz/${userId}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionIndex,
          question: question.question,
          selectedOption,
          isCorrect,
          correctAnswer: question.correct,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save answer");
      }

      const data = await res.json();
      console.log("Answer saved:", data);
      return data;
    } catch (err) {
      console.error("Error saving quiz answer:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAnswer = async (selectedOption) => {
    if (flipped || saving) return;

    const currentQuestion = questions[qIndex];
    const isCorrect = selectedOption === currentQuestion.correct;
    setBackImage(isCorrect ? currentQuestion.correctImage : currentQuestion.wrongImage);
    setFlipped(true);

    // Save the answer to database
    await saveQuizAnswer(qIndex, currentQuestion, selectedOption, isCorrect);

    setTimeout(() => {
      if (isLastQuestion) {
        // Quiz complete - navigate to pacman
        setTimeout(() => {
          navigate("/pacman");
        }, FLIP_HOLD_MS);
      } else {
        // Move to next question
        setFlipped(false);
        setQIndex((i) => i + 1);
      }
    }, FLIP_HOLD_MS);
  };

  if (loading) {
    return (
      <div className="level1-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p style={{ color: 'var(--sand)', fontSize: '1.2rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="level1-page">
      <div className="level1-copy">
        <p className="level1-eyebrow">LEVEL 1</p>
        <h2 className="level1-title">
          How well
          <br />
          do you know her?
        </h2>
        <p className="level1-sub">5 cards.</p>
        <p className="level1-sub">No second chances.</p>
        <button
          type="button"
          className={`level1-begin ${started ? "is-hidden" : ""}`}
          onClick={handleBegin}
        >
          Click to begin.
        </button>
      </div>

      <div className="card-stack">
        <img
          className="deco-card card-jack"
          src="/jack-spades.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="deco-card card-queen"
          src="/queen-hearts.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="deco-card card-back-1"
          src="/card-back.png"
          alt=""
          aria-hidden="true"
        />
        <img
          className="deco-card card-back-2"
          src="/card-back.png"
          alt=""
          aria-hidden="true"
        />

        <div
          className="quiz-card"
          onClick={!started ? handleBegin : undefined}
          role={!started ? "button" : undefined}
          tabIndex={!started ? 0 : undefined}
        >
          <div className={`quiz-card-inner ${flipped ? "is-flipped" : ""}`}>
            <div className="quiz-card-face quiz-card-front">
              {started && (
                <fieldset className="quiz-question">
                  <legend>{questions[qIndex].question}</legend>
                  {questions[qIndex].options.map((option, i) => (
                    <label className="quiz-option" key={option}>
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        onChange={() => handleAnswer(option)}
                        disabled={flipped || saving}
                      />
                      <span>
                        {String.fromCharCode(97 + i)}. {option}
                      </span>
                    </label>
                  ))}
                </fieldset>
              )}
            </div>
            <div className="quiz-card-face quiz-card-back">
              {backImage && <img src={backImage} alt="" />}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`shuffle-card ${shuffleCentered ? "is-centered" : ""}`}
        onClick={handleShuffleClick}
        aria-label="Shuffle for a random note"
      >
        <div className={`shuffle-card-inner ${shuffleFlipped ? "is-flipped" : ""}`}>
          <div className="shuffle-face shuffle-face-back">
            <img src="/shuffle-card-back.png" alt="" />
          </div>
          <div className="shuffle-face shuffle-face-front">
            <img src="/shuffle-card-front.jpg" alt="" />
            {shuffleQuote && <p className="shuffle-quote">{shuffleQuote}</p>}
          </div>
        </div>
      </button>
    </div>
  );
}