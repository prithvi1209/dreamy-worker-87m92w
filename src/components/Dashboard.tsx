import React, { useState, useEffect } from "react";
import { FlashcardCollection, User } from "../types";
import "../styles/Dashboard.css";

interface DashboardProps {
  collections: FlashcardCollection[];
  onViewCollection: (collection: FlashcardCollection) => void;
  onDeleteCollection: (collectionId: string) => void;
  user: User | null;
  onShowAuth: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  collections,
  onViewCollection,
  onDeleteCollection,
  user,
  onShowAuth,
}) => {
  const [filter, setFilter] = useState<"all" | "due" | "locked">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check for due revisions and send notifications
    checkRevisionSchedules();
  }, [collections]);

  const checkRevisionSchedules = () => {
    const now = new Date();
    collections.forEach((collection) => {
      if (collection.revisionSchedule) {
        const nextRevision = new Date(collection.revisionSchedule.nextRevision);
        if (nextRevision <= now && !collection.isLocked) {
          // Send notification (in a real app, this would be a push notification or email)
          console.log(`Reminder: Time to review "${collection.name}"!`);
        }
      }
    });
  };

  const filteredCollections = collections.filter((collection) => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "due") {
      const now = new Date();
      return (
        matchesSearch &&
        collection.revisionSchedule &&
        new Date(collection.revisionSchedule.nextRevision) <= now
      );
    }
    if (filter === "locked") return matchesSearch && collection.isLocked;
    return matchesSearch;
  });

  const getDaysUntilRevision = (collection: FlashcardCollection): string => {
    if (!collection.revisionSchedule) return "No schedule";
    const now = new Date();
    const next = new Date(collection.revisionSchedule.nextRevision);
    const diff = Math.ceil(
      (next.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return "Overdue!";
    if (diff === 0) return "Due today";
    return `${diff} days`;
  };

  const getStats = () => {
    const total = collections.length;
    const totalCards = collections.reduce(
      (sum, c) => sum + c.flashcards.length,
      0
    );
    const due = collections.filter((c) => {
      if (!c.revisionSchedule) return false;
      return new Date(c.revisionSchedule.nextRevision) <= new Date();
    }).length;

    return { total, totalCards, due };
  };

  const stats = getStats();

  if (!user) {
    return (
      <div className="dashboard-empty">
        <div className="empty-state">
          <span className="empty-icon">🔐</span>
          <h2>Sign in to get started</h2>
          <p>
            Create an account to save your flashcard collections and track your
            progress.
          </p>
          <button className="primary-btn" onClick={onShowAuth}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Your Collections</h1>
          <p className="dashboard-subtitle">
            Organize and review your study materials
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <p className="stat-value">{stats.total}</p>
            <p className="stat-label">Collections</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎴</div>
          <div className="stat-content">
            <p className="stat-value">{stats.totalCards}</p>
            <p className="stat-label">Total Cards</p>
          </div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <p className="stat-value">{stats.due}</p>
            <p className="stat-label">Due for Review</p>
          </div>
        </div>
      </div>

      <div className="dashboard-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "due" ? "active" : ""}`}
            onClick={() => setFilter("due")}
          >
            Due
          </button>
          <button
            className={`filter-btn ${filter === "locked" ? "active" : ""}`}
            onClick={() => setFilter("locked")}
          >
            Locked
          </button>
        </div>
      </div>

      <div className="collections-grid">
        {filteredCollections.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No collections found</h3>
            <p>Start by generating your first flashcard collection!</p>
          </div>
        ) : (
          filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className={`collection-card ${
                collection.isLocked ? "locked" : ""
              }`}
            >
              {collection.isLocked && (
                <div className="locked-badge">
                  <span>🔒 Locked</span>
                </div>
              )}

              <div className="collection-header">
                <h3 className="collection-name">{collection.name}</h3>
                {collection.tags && collection.tags.length > 0 && (
                  <div className="collection-tags">
                    {collection.tags.map((tag, idx) => (
                      <span key={idx} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {collection.description && (
                <p className="collection-description">
                  {collection.description}
                </p>
              )}

              <div className="collection-info">
                <span className="info-item">
                  <span className="info-icon">🎴</span>
                  {collection.flashcards.length} cards
                </span>
                {collection.revisionSchedule && (
                  <span className="info-item revision">
                    <span className="info-icon">⏰</span>
                    {getDaysUntilRevision(collection)}
                  </span>
                )}
              </div>

              <div className="collection-actions">
                <button
                  className="action-btn primary"
                  onClick={() => onViewCollection(collection)}
                  disabled={collection.isLocked}
                >
                  {collection.isLocked ? "🔒 Locked" : "Study"}
                </button>
                <button
                  className="action-btn danger"
                  onClick={() => {
                    if (confirm(`Delete "${collection.name}"?`)) {
                      onDeleteCollection(collection.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>

              {collection.isLocked && collection.lockedUntil && (
                <p className="locked-message">
                  Available after:{" "}
                  {new Date(collection.lockedUntil).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
