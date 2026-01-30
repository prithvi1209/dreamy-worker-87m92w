import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { FlashcardGenerator } from "./components/FlashcardGenerator";
import { FlashcardViewer } from "./components/FlashcardViewer";
import { ProfileSettings } from "./components/ProfileSettings";
import { AuthModal } from "./components/AuthModal";
import { Flashcard, FlashcardCollection, User } from "./types";
import "./styles_1/App.css";

declare global {
  interface Window {
    puter: any;
  }
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "generator" | "viewer" | "settings"
  >("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [collections, setCollections] = useState<FlashcardCollection[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState<FlashcardCollection | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializePuter();
    loadUserData();
  }, []);

  const initializePuter = async () => {
    try {
      // Puter.js initialization
      if (window.puter) {
        await window.puter.init();
        console.log("Puter initialized successfully");
      }
    } catch (error) {
      console.error("Failed to initialize Puter:", error);
    }
  };

  const loadUserData = () => {
    const savedUser = localStorage.getItem("flashcard_user");
    const savedCollections = localStorage.getItem("flashcard_collections");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
    setIsLoading(false);
  };

  const handleLogin = (email: string, phone: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      phone,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("flashcard_user", JSON.stringify(newUser));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("flashcard_user");
    setCurrentView("dashboard");
  };

  const saveCollection = (collection: FlashcardCollection) => {
    const updatedCollections = [...collections];
    const existingIndex = updatedCollections.findIndex(
      (c) => c.id === collection.id
    );

    if (existingIndex >= 0) {
      updatedCollections[existingIndex] = collection;
    } else {
      updatedCollections.push(collection);
    }

    setCollections(updatedCollections);
    localStorage.setItem(
      "flashcard_collections",
      JSON.stringify(updatedCollections)
    );
  };

  const deleteCollection = (collectionId: string) => {
    const updatedCollections = collections.filter((c) => c.id !== collectionId);
    setCollections(updatedCollections);
    localStorage.setItem(
      "flashcard_collections",
      JSON.stringify(updatedCollections)
    );
    if (selectedCollection?.id === collectionId) {
      setSelectedCollection(null);
    }
  };

  const handleViewCollection = (collection: FlashcardCollection) => {
    setSelectedCollection(collection);
    setCurrentView("viewer");
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading FlashGenius...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onLogout={handleLogout}
        onShowAuth={() => setShowAuthModal(true)}
      />

      <main className="main-content">
        {currentView === "dashboard" && (
          <Dashboard
            collections={collections}
            onViewCollection={handleViewCollection}
            onDeleteCollection={deleteCollection}
            user={user}
            onShowAuth={() => setShowAuthModal(true)}
          />
        )}

        {currentView === "generator" && (
          <FlashcardGenerator
            onSaveCollection={saveCollection}
            user={user}
            onShowAuth={() => setShowAuthModal(true)}
          />
        )}

        {currentView === "viewer" && selectedCollection && (
          <FlashcardViewer
            collection={selectedCollection}
            onBack={() => setCurrentView("dashboard")}
            onUpdateCollection={saveCollection}
          />
        )}

        {currentView === "settings" && user && (
          <ProfileSettings user={user} onUpdateUser={setUser} />
        )}
      </main>

      {showAuthModal && (
        <AuthModal
          onLogin={handleLogin}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default App;
