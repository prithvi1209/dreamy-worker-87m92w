import React, { useState } from "react";
import {
  Flashcard,
  FlashcardCollection,
  GenerationOptions,
  User,
} from "../types";
import { generateFlashcardsWithAI } from "../utils/aiService";
import "../styles/FlashcardGenerator.css";

interface FlashcardGeneratorProps {
  onSaveCollection: (collection: FlashcardCollection) => void;
  user: User | null;
  onShowAuth: () => void;
}

export const FlashcardGenerator: React.FC<FlashcardGeneratorProps> = ({
  onSaveCollection,
  user,
  onShowAuth,
}) => {
  const [inputText, setInputText] = useState("");
  const [generatedCards, setGeneratedCards] = useState<Flashcard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<GenerationOptions>({
    includeBasic: true,
    includeApplication: true,
    includeQuiz: false,
    includeMCQ: false,
    includeFillBlank: false,
    numberOfCards: 10,
    difficulty: "mixed",
  });
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [revisionInterval, setRevisionInterval] = useState(3);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCard, setManualCard] = useState({
    front: "",
    back: "",
    type: "basic" as const,
  });

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      alert("Please enter some notes to analyze!");
      return;
    }

    setIsGenerating(true);
    try {
      const cards = await generateFlashcardsWithAI(inputText, options);
      setGeneratedCards(cards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddManualCard = () => {
    if (!manualCard.front.trim() || !manualCard.back.trim()) {
      alert("Please fill in both front and back of the card!");
      return;
    }

    const newCard: Flashcard = {
      id: `manual-${Date.now()}`,
      type: manualCard.type,
      front: manualCard.front,
      back: manualCard.back,
    };

    setGeneratedCards([...generatedCards, newCard]);
    setManualCard({ front: "", back: "", type: "basic" });
    setShowManualInput(false);
  };

  const handleSaveCollection = () => {
    if (!user) {
      onShowAuth();
      return;
    }

    if (!collectionName.trim()) {
      alert("Please enter a collection name!");
      return;
    }

    if (generatedCards.length === 0) {
      alert("Generate or add some flashcards first!");
      return;
    }

    const collection: FlashcardCollection = {
      id: Date.now().toString(),
      name: collectionName,
      description: collectionDescription,
      flashcards: generatedCards,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      revisionSchedule: {
        interval: revisionInterval,
        nextRevision: new Date(
          Date.now() + revisionInterval * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    };

    onSaveCollection(collection);
    alert("Collection saved successfully!");

    // Reset form
    setInputText("");
    setGeneratedCards([]);
    setCollectionName("");
    setCollectionDescription("");
  };

  const handleExportText = () => {
    let text = `Collection: ${collectionName || "Untitled"}\n`;
    text += `Description: ${collectionDescription || "N/A"}\n`;
    text += `\n${"=".repeat(50)}\n\n`;

    generatedCards.forEach((card, index) => {
      text += `Card ${index + 1} [${card.type.toUpperCase()}]\n`;
      text += `Front: ${card.front}\n`;
      text += `Back: ${card.back}\n`;
      if (card.options) {
        text += `Options: ${card.options.join(", ")}\n`;
      }
      if (card.correctAnswer) {
        text += `Correct Answer: ${card.correctAnswer}\n`;
      }
      text += `\n${"-".repeat(50)}\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${collectionName || "flashcards"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    const { exportToPDF } = await import("../utils/pdfExport");
    await exportToPDF(generatedCards, collectionName || "Flashcards");
  };

  const removeCard = (cardId: string) => {
    setGeneratedCards(generatedCards.filter((card) => card.id !== cardId));
  };

  return (
    <div className="generator">
      <div className="generator-header">
        <h1 className="generator-title">Generate Flashcards</h1>
        <p className="generator-subtitle">
          Transform your notes into powerful study tools
        </p>
      </div>

      <div className="generator-content">
        <div className="input-section">
          <div className="section-header">
            <h2>1. Input Your Notes</h2>
            <button
              className="secondary-btn"
              onClick={() => setShowManualInput(!showManualInput)}
            >
              {showManualInput ? "Hide Manual Input" : "Add Card Manually"}
            </button>
          </div>

          {showManualInput && (
            <div className="manual-input-box">
              <h3>Add Custom Flashcard</h3>
              <select
                value={manualCard.type}
                onChange={(e) =>
                  setManualCard({ ...manualCard, type: e.target.value as any })
                }
                className="card-type-select"
              >
                <option value="basic">Basic Concept</option>
                <option value="application">Application</option>
                <option value="quiz">Quiz</option>
              </select>
              <textarea
                placeholder="Front of card (Question/Prompt)"
                value={manualCard.front}
                onChange={(e) =>
                  setManualCard({ ...manualCard, front: e.target.value })
                }
                className="manual-textarea"
                rows={3}
              />
              <textarea
                placeholder="Back of card (Answer/Explanation)"
                value={manualCard.back}
                onChange={(e) =>
                  setManualCard({ ...manualCard, back: e.target.value })
                }
                className="manual-textarea"
                rows={3}
              />
              <button className="primary-btn" onClick={handleAddManualCard}>
                Add Card
              </button>
            </div>
          )}

          <textarea
            className="notes-input"
            placeholder="Paste your notes here... The AI will analyze and generate relevant flashcards from your content."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
          />

          <div className="options-grid">
            <div className="option-group">
              <h3>Card Types</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.includeBasic}
                  onChange={(e) =>
                    setOptions({ ...options, includeBasic: e.target.checked })
                  }
                />
                <span>Basic Concepts</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.includeApplication}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      includeApplication: e.target.checked,
                    })
                  }
                />
                <span>Application Questions</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.includeQuiz}
                  onChange={(e) =>
                    setOptions({ ...options, includeQuiz: e.target.checked })
                  }
                />
                <span>Quiz Style</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.includeMCQ}
                  onChange={(e) =>
                    setOptions({ ...options, includeMCQ: e.target.checked })
                  }
                />
                <span>Multiple Choice</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={options.includeFillBlank}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      includeFillBlank: e.target.checked,
                    })
                  }
                />
                <span>Fill in the Blanks</span>
              </label>
            </div>

            <div className="option-group">
              <h3>Settings</h3>
              <label className="input-label">
                <span>Number of Cards</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={options.numberOfCards}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      numberOfCards: parseInt(e.target.value),
                    })
                  }
                  className="number-input"
                />
              </label>
              <label className="input-label">
                <span>Difficulty</span>
                <select
                  value={options.difficulty}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      difficulty: e.target.value as any,
                    })
                  }
                  className="select-input"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </select>
              </label>
            </div>
          </div>

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating with AI...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Flashcards
              </>
            )}
          </button>
        </div>

        {generatedCards.length > 0 && (
          <div className="results-section">
            <div className="section-header">
              <h2>2. Review Generated Cards ({generatedCards.length})</h2>
              <div className="export-buttons">
                <button className="secondary-btn" onClick={handleExportText}>
                  📄 Export as Text
                </button>
                <button className="secondary-btn" onClick={handleExportPDF}>
                  📑 Export as PDF
                </button>
              </div>
            </div>

            <div className="cards-preview">
              {generatedCards.map((card, index) => (
                <div
                  key={card.id}
                  className={`card-preview card-type-${card.type}`}
                >
                  <div className="card-preview-header">
                    <span className="card-number">Card {index + 1}</span>
                    <span className="card-type-badge">{card.type}</span>
                    <button
                      className="remove-card-btn"
                      onClick={() => removeCard(card.id)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="card-preview-content">
                    <div className="card-side">
                      <h4>Front</h4>
                      <p dangerouslySetInnerHTML={{ __html: card.front }}></p>
                    </div>
                    <div className="card-divider"></div>
                    <div className="card-side">
                      <h4>Back</h4>
                      <p dangerouslySetInnerHTML={{ __html: card.back }}></p>
                    </div>
                  </div>
                  {card.options && (
                    <div className="card-options">
                      <strong>Options:</strong>
                      <ul>
                        {card.options.map((opt, i) => (
                          <li
                            key={i}
                            className={
                              opt === card.correctAnswer ? "correct" : ""
                            }
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="save-section">
              <h2>3. Save Collection</h2>
              <div className="save-form">
                <input
                  type="text"
                  placeholder="Collection Name (e.g., Biology Chapter 3)"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="text-input"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={collectionDescription}
                  onChange={(e) => setCollectionDescription(e.target.value)}
                  className="textarea-input"
                  rows={2}
                />
                <label className="input-label">
                  <span>Revision Schedule</span>
                  <select
                    value={revisionInterval}
                    onChange={(e) =>
                      setRevisionInterval(parseInt(e.target.value))
                    }
                    className="select-input"
                  >
                    <option value={1}>Daily</option>
                    <option value={3}>Every 3 days</option>
                    <option value={5}>Every 5 days</option>
                    <option value={7}>Weekly</option>
                    <option value={14}>Bi-weekly</option>
                  </select>
                </label>
                <div className="warning-box">
                  <span className="warning-icon">⚠️</span>
                  <p>
                    <strong>Important:</strong> If you don't review your
                    collection within 24 hours of the due date, it will be
                    locked for 1 day. Regular revision is key to retention!
                  </p>
                </div>
                <button className="save-btn" onClick={handleSaveCollection}>
                  💾 Save Collection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
