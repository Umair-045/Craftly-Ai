import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Plus, Trash2, Clock, Star, Sparkles, ChevronRight, Heart, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { detectMaterials, generateCrafts } from './api';

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function CraftlyAI() {
  const [screen, setScreen] = useState('welcome');
  const [images, setImages] = useState([]);
  const [detectedMaterials, setDetectedMaterials] = useState([]);
  const [confirmedMaterials, setConfirmedMaterials] = useState([]);
  const [preferences, setPreferences] = useState({
    skillLevel: 'beginner',
    timeAvailable: '15-30',
    purpose: 'home-decor',
    tools: []
  });
  const [craftSuggestions, setCraftSuggestions] = useState([]);
  const [selectedCraft, setSelectedCraft] = useState(null);
  const [savedCrafts, setSavedCrafts] = useState([]);
  const [error, setError] = useState(null);

  // Screen navigation
  const goToScreen = (screenName) => {
    setScreen(screenName);
    setError(null);
  };

  // Reset app state
  const resetApp = () => {
    setImages([]);
    setDetectedMaterials([]);
    setConfirmedMaterials([]);
    setCraftSuggestions([]);
    setSelectedCraft(null);
    setError(null);
    goToScreen('welcome');
  };

  // Toggle saved craft
  const toggleSaveCraft = (craft) => {
    const isSaved = savedCrafts.some(c => c.id === craft.id);
    if (isSaved) {
      setSavedCrafts(savedCrafts.filter(c => c.id !== craft.id));
    } else {
      setSavedCrafts([...savedCrafts, craft]);
    }
  };

  return (
    <div className="app-container">
      {/* Inline styles remain the same as your original code */}

      {screen === 'welcome' && (
        <div className="welcome-screen fade-in">
          <div className="welcome-bg-blob"></div>
          <div className="welcome-bg-blob"></div>
          <div className="logo-container">
            <div className="logo">
              <Sparkles className="logo-icon" />
            </div>
            <h1 className="app-name">Craftly AI</h1>
            <p className="app-tagline">Turn Waste into Wonder ✨</p>
          </div>
          <div className="feature-grid">
            {/* feature cards */}
          </div>
          <button className="primary-button" onClick={() => goToScreen('upload')}>
            <Sparkles size={20} />
            Start Creating
          </button>
        </div>
      )}

      {screen === 'upload' && (
        <UploadScreen
          images={images}
          setImages={setImages}
          goToScreen={goToScreen}
          setDetectedMaterials={setDetectedMaterials}
          setError={setError}
          error={error}
        />
      )}

      {screen === 'review' && (
        <ReviewScreen
          detectedMaterials={detectedMaterials}
          confirmedMaterials={confirmedMaterials}
          setConfirmedMaterials={setConfirmedMaterials}
          goToScreen={goToScreen}
          error={error}
        />
      )}

      {screen === 'preferences' && (
        <PreferencesScreen
          preferences={preferences}
          setPreferences={setPreferences}
          confirmedMaterials={confirmedMaterials}
          goToScreen={goToScreen}
          setCraftSuggestions={setCraftSuggestions}
          setError={setError}
        />
      )}

      {screen === 'processing' && <ProcessingScreen />}

      {screen === 'results' && (
        <ResultsScreen
          craftSuggestions={craftSuggestions}
          setSelectedCraft={setSelectedCraft}
          goToScreen={goToScreen}
          toggleSaveCraft={toggleSaveCraft}
          savedCrafts={savedCrafts}
          resetApp={resetApp}
        />
      )}

      {screen === 'detail' && selectedCraft && (
        <DetailScreen
          craft={selectedCraft}
          goToScreen={goToScreen}
          toggleSaveCraft={toggleSaveCraft}
          savedCrafts={savedCrafts}
        />
      )}

      {screen === 'saved' && (
        <SavedScreen
          savedCrafts={savedCrafts}
          setSelectedCraft={setSelectedCraft}
          goToScreen={goToScreen}
        />
      )}

      {(screen === 'results' || screen === 'saved') && (
        <div className="bottom-nav">
          <button
            className={`nav-item ${screen === 'results' ? 'active' : ''}`}
            onClick={() => goToScreen('results')}
          >
            <Search className="nav-icon" />
            <span className="nav-label">Explore</span>
          </button>
          <button
            className={`nav-item ${screen === 'saved' ? 'active' : ''}`}
            onClick={() => goToScreen('saved')}
          >
            <Heart className="nav-icon" />
            <span className="nav-label">Saved</span>
          </button>
          <button className="nav-item" onClick={resetApp}>
            <Plus className="nav-icon" />
            <span className="nav-label">New</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// CHILD COMPONENTS
// ============================================================================

function UploadScreen({ images, setImages, goToScreen, setDetectedMaterials, setError, error }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newImages = [];
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push({
          id: Date.now() + Math.random(),
          url: event.target.result,
          file: file
        });
        if (newImages.length === files.length) {
          setImages([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const analyzeImages = async () => {
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setError(null);

    try {
      const img = images[0];
      const materials = await detectMaterials(img.url.split(',')[1], img.file.type);

      if (materials.length === 0) {
        setError('No craft materials detected. Try a clearer image.');
        return;
      }

      setDetectedMaterials(materials);
      goToScreen('review');
    } catch (err) {
      console.error('Detection error:', err);
      setError('AI error: ' + err.message);
    }
  };

  return (
    <div className="upload-screen fade-in">
      {/* Rest of UploadScreen JSX unchanged */}
    </div>
  );
}

function ReviewScreen({ detectedMaterials, confirmedMaterials, setConfirmedMaterials, goToScreen, error }) {
  const [newMaterial, setNewMaterial] = useState('');

  useEffect(() => {
    setConfirmedMaterials(detectedMaterials);
  }, [detectedMaterials, setConfirmedMaterials]);

  const removeMaterial = (name) => {
    setConfirmedMaterials(confirmedMaterials.filter(m => m.name !== name));
  };

  const addMaterial = () => {
    if (!newMaterial.trim()) return;
    const material = { name: newMaterial.trim().toLowerCase(), emoji: '📦' };
    setConfirmedMaterials([...confirmedMaterials, material]);
    setNewMaterial('');
  };

  const handleContinue = () => {
    if (confirmedMaterials.length === 0) return;
    goToScreen('preferences');
  };

  return (
    <div className="upload-screen fade-in">
      {/* Rest of ReviewScreen JSX unchanged */}
    </div>
  );
}

function PreferencesScreen({ preferences, setPreferences, confirmedMaterials, goToScreen, setCraftSuggestions, setError }) {
  const handleToolToggle = (tool) => {
    const tools = preferences.tools.includes(tool)
      ? preferences.tools.filter(t => t !== tool)
      : [...preferences.tools, tool];
    setPreferences({ ...preferences, tools });
  };

  const handleGenerateCrafts = async () => {
    goToScreen('processing');

    try {
      const crafts = await generateCrafts(
        confirmedMaterials.map(m => m.name),
        preferences
      );

      setCraftSuggestions(crafts.length > 0 ? crafts : generateFallbackCrafts(confirmedMaterials, preferences));
      setTimeout(() => { goToScreen('results'); }, 1500);
    } catch (err) {
      console.error('Generation error:', err);
      setCraftSuggestions(generateFallbackCrafts(confirmedMaterials, preferences));
      setTimeout(() => { goToScreen('results'); }, 1500);
    }
  };

  return (
    <div className="upload-screen fade-in">
      {/* PreferencesScreen JSX unchanged */}
    </div>
  );
}

function ProcessingScreen() {
  return (
    <div className="processing-screen fade-in">
      {/* ProcessingScreen JSX unchanged */}
    </div>
  );
}

function ResultsScreen({ craftSuggestions, setSelectedCraft, goToScreen, toggleSaveCraft, savedCrafts, resetApp }) {
  return (
    <div className="fade-in" style={{ paddingBottom: '80px' }}>
      {/* ResultsScreen JSX unchanged */}
    </div>
  );
}

function DetailScreen({ craft, goToScreen, toggleSaveCraft, savedCrafts }) {
  return (
    <div className="detail-screen fade-in">
      {/* DetailScreen JSX unchanged */}
    </div>
  );
}

function SavedScreen({ savedCrafts, setSelectedCraft, goToScreen }) {
  return (
    <div className="fade-in" style={{ paddingBottom: '80px' }}>
      {/* SavedScreen JSX unchanged */}
    </div>
  );
}

// ============================================================================
// HELPER FUNCTION
// ============================================================================

function generateFallbackCrafts(materials, preferences) {
  const materialNames = materials.map(m => m.name);
  const timestamp = Date.now();
  
  const allCrafts = [
    // fallback crafts remain unchanged
  ];

  return allCrafts.slice(0, 4);
}
