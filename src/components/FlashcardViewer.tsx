import React, { useState, useEffect } from "react";
import { FlashcardCollection, Flashcard } from "../types";
import "../styles/FlashcardViewer.css";

interface FlashcardViewerProps {
  collection: FlashcardCollection;
  onBack: () => void;
  onUpdateCollection: (collection: FlashcardCollection) => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({
  collection,
  onBack,
  onUpdateCollection,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<"study" | "grid">("study");
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = collection.flashcards[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
    setShowAnswer(false);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < collection.flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(true);
  };

  const handleMastered = (cardId: string) => {
    const newMastered = new Set(masteredCards);
    if (newMastered.has(cardId)) {
      newMastered.delete(cardId);
    } else {
      newMastered.add(cardId);
    }
    setMasteredCards(newMastered);
  };

  const handleCompleteReview = () => {
    const now = new Date();
    const updatedCollection: FlashcardCollection = {
      ...collection,
      revisionSchedule: collection.revisionSchedule
        ? {
            ...collection.revisionSchedule,
            lastRevised: now.toISOString(),
            nextRevision: new Date(
              now.getTime() +
                collection.revisionSchedule.interval * 24 * 60 * 60 * 1000
            ).toISOString(),
          }
        : undefined,
      isLocked: false,
      updatedAt: now.toISOString(),
    };

    onUpdateCollection(updatedCollection);
    alert("Great job! Review completed. See you next time!");
    onBack();
  };

  const renderMCQOptions = (card: Flashcard) => {
    if (!card.options) return null;

    return (
      <div className="mcq-options">
        {card.options.map((option, index) => (
          <button
            key={index}
            className={`mcq-option ${
              showAnswer
                ? option === card.correctAnswer
                  ? "correct"
                  : "incorrect"
                : ""
            }`}
            onClick={() => setShowAnswer(true)}
          >
            <span className="option-letter">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderStudyMode = () => (
    <div className="study-mode">
      <div className="study-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <div className="progress-info">
          <span className="progress-text">
            Card {currentIndex + 1} of {collection.flashcards.length}
          </span>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((currentIndex + 1) / collection.flashcards.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>
        <button className="view-toggle-btn" onClick={() => setViewMode("grid")}>
          Grid View
        </button>
      </div>

      <div className={`flashcard-container ${isFlipped ? "flipped" : ""}`}>
        <div className="flashcard" onClick={handleFlip}>
          <div className="flashcard-front">
            <div className="card-type-indicator">{currentCard.type}</div>
            <div className="card-content">
              <div
                dangerouslySetInnerHTML={{ __html: currentCard.front }}
              ></div>
            </div>
            {currentCard.type === "mcq" &&
              !isFlipped &&
              renderMCQOptions(currentCard)}
            <div className="flip-hint">Click to flip</div>
          </div>
          <div className="flashcard-back">
            <div className="card-type-indicator">{currentCard.type}</div>
            <div className="card-content">
              <div dangerouslySetInnerHTML={{ __html: currentCard.back }}></div>
            </div>
            {currentCard.explanation && (
              <div className="explanation">
                <strong>Explanation:</strong>
                <p>{currentCard.explanation}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="study-controls">
        <button
          className="nav-btn"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        <div className="card-actions">
          <button
            className={`mastery-btn ${
              masteredCards.has(currentCard.id) ? "mastered" : ""
            }`}
            onClick={() => handleMastered(currentCard.id)}
          >
            {masteredCards.has(currentCard.id)
              ? "✓ Mastered"
              : "Mark as Mastered"}
          </button>
        </div>

        <button
          className="nav-btn"
          onClick={handleNext}
          disabled={currentIndex === collection.flashcards.length - 1}
        >
          Next →
        </button>
      </div>

      <div className="mastery-stats">
        <p>
          Mastered: {masteredCards.size} / {collection.flashcards.length} cards
        </p>
        {masteredCards.size === collection.flashcards.length && (
          <button className="complete-btn" onClick={handleCompleteReview}>
            🎉 Complete Review
          </button>
        )}
      </div>
    </div>
  );

  const renderGridMode = () => (
    <div className="grid-mode">
      <div className="grid-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h2>{collection.name}</h2>
        <button
          className="view-toggle-btn"
          onClick={() => setViewMode("study")}
        >
          Study Mode
        </button>
      </div>

      <div className="cards-grid">
        {collection.flashcards.map((card, index) => (
          <div
            key={card.id}
            className={`grid-card ${
              masteredCards.has(card.id) ? "mastered" : ""
            }`}
            onClick={() => {
              setCurrentIndex(index);
              setViewMode("study");
            }}
          >
            <div className="grid-card-header">
              <span className="grid-card-number">#{index + 1}</span>
              <span className="grid-card-type">{card.type}</span>
            </div>
            <div className="grid-card-content">
              <div dangerouslySetInnerHTML={{ __html: card.front }}></div>
            </div>
            {masteredCards.has(card.id) && (
              <div className="mastered-badge">✓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flashcard-viewer">
      {viewMode === "study" ? renderStudyMode() : renderGridMode()}
    </div>
  );
};
