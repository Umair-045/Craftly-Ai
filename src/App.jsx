import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Plus, Trash2, Edit2, Clock, Star, Sparkles, ChevronRight, Heart, Search, Loader, AlertCircle, CheckCircle } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(135deg, #FFF5F0 0%, #F0F9FF 100%);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .app-container {
          max-width: 430px;
          margin: 0 auto;
          background: white;
          min-height: 100vh;
          position: relative;
          box-shadow: 0 0 60px rgba(0, 0, 0, 0.08);
        }

        .welcome-screen {
          padding: 60px 24px 40px;
          text-align: center;
          background: linear-gradient(180deg, #FFE8DC 0%, #FFFFFF 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .welcome-bg-blob {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(60, 207, 207, 0.15) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }

        .welcome-bg-blob:nth-child(1) { top: -100px; left: -100px; }
        .welcome-bg-blob:nth-child(2) { bottom: -100px; right: -100px; animation-delay: 3s; }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 20px) scale(1.05); }
        }

        .logo-container {
          position: relative;
          z-index: 1;
          margin-bottom: 32px;
        }

        .logo {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #3CCFCF 0%, #FF6F61 100%);
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 20px 40px rgba(60, 207, 207, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .logo-icon {
          width: 60px;
          height: 60px;
          color: white;
        }

        .app-name {
          font-family: 'Fredoka', sans-serif;
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, #3CCFCF 0%, #FF6F61 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }

        .app-tagline {
          font-size: 18px;
          color: #666;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }

        .feature-grid {
          display: grid;
          gap: 16px;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .feature-card {
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          text-align: left;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          border-color: #3CCFCF;
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(60, 207, 207, 0.2);
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FFE8DC 0%, #E0F7FA 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .feature-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .feature-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .primary-button {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #3CCFCF 0%, #2AB8B8 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-family: 'Fredoka', sans-serif;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(60, 207, 207, 0.4);
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(60, 207, 207, 0.5);
        }

        .primary-button:active {
          transform: translateY(0);
        }

        .upload-screen {
          padding: 24px;
          min-height: 100vh;
          background: #FAFAFA;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .back-button {
          background: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .header-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }

        .step-indicator {
          font-size: 14px;
          color: #999;
          background: white;
          padding: 8px 16px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .upload-area {
          background: white;
          border: 3px dashed #3CCFCF;
          border-radius: 24px;
          padding: 48px 24px;
          text-align: center;
          margin-bottom: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-area:hover {
          border-color: #2AB8B8;
          background: #F0FCFC;
          transform: scale(1.02);
        }

        .upload-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 16px;
          color: #3CCFCF;
        }

        .upload-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin-bottom: 8px;
        }

        .upload-subtitle {
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
        }

        .upload-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .upload-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #3CCFCF 0%, #2AB8B8 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .upload-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(60, 207, 207, 0.3);
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 16px;
          overflow: hidden;
          background: #f0f0f0;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.6);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: all 0.3s ease;
        }

        .remove-image:hover {
          background: rgba(255, 0, 0, 0.8);
          transform: scale(1.1);
        }

        .image-count {
          text-align: center;
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
        }

        .material-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .material-chip {
          background: white;
          padding: 16px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .material-chip.confirmed {
          border-color: #3CCFCF;
          background: linear-gradient(135deg, #F0FCFC 0%, #FFFFFF 100%);
        }

        .material-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .material-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #FFE8DC 0%, #E0F7FA 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .material-name {
          font-family: 'Fredoka', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .material-actions {
          display: flex;
          gap: 8px;
        }

        .icon-button {
          background: #f0f0f0;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .icon-button:hover {
          background: #3CCFCF;
          color: white;
          transform: scale(1.1);
        }

        .icon-button.delete:hover {
          background: #FF6F61;
        }

        .add-material-section {
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 24px;
        }

        .section-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }

        .input-with-button {
          display: flex;
          gap: 8px;
        }

        .material-input {
          flex: 1;
          padding: 14px;
          border: 2px solid #E0E0E0;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          outline: none;
          transition: all 0.3s ease;
        }

        .material-input:focus {
          border-color: #3CCFCF;
          background: #F0FCFC;
        }

        .add-button {
          padding: 14px 20px;
          background: #3CCFCF;
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .add-button:hover {
          background: #2AB8B8;
          transform: translateY(-2px);
        }

        .preference-section {
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          margin-bottom: 20px;
        }

        .option-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 12px;
        }

        .option-button {
          padding: 16px;
          background: #F5F5F5;
          border: 2px solid transparent;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .option-button:hover {
          background: #E8F8F8;
          transform: translateY(-2px);
        }

        .option-button.selected {
          background: linear-gradient(135deg, #F0FCFC 0%, #FFFFFF 100%);
          border-color: #3CCFCF;
          font-weight: 600;
          color: #3CCFCF;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 12px;
        }

        .tool-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #F5F5F5;
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tool-checkbox:hover {
          background: #E8F8F8;
        }

        .tool-checkbox.checked {
          background: linear-gradient(135deg, #F0FCFC 0%, #FFFFFF 100%);
          border-color: #3CCFCF;
        }

        .checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #CCC;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .tool-checkbox.checked .checkbox {
          background: #3CCFCF;
          border-color: #3CCFCF;
        }

        .processing-screen {
          padding: 60px 24px;
          min-height: 100vh;
          background: linear-gradient(135deg, #F0FCFC 0%, #FFE8DC 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .spinner-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 32px;
        }

        .spinner {
          width: 120px;
          height: 120px;
          border: 8px solid rgba(60, 207, 207, 0.2);
          border-top-color: #3CCFCF;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #3CCFCF;
        }

        .processing-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 12px;
        }

        .processing-subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 32px;
        }

        .processing-steps {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          text-align: left;
          max-width: 320px;
        }

        .processing-step {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #F0F0F0;
        }

        .processing-step:last-child {
          border-bottom: none;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3CCFCF 0%, #2AB8B8 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .step-text {
          font-size: 15px;
          color: #333;
        }

        .results-header {
          background: linear-gradient(135deg, #3CCFCF 0%, #FF6F61 100%);
          padding: 32px 24px;
          color: white;
          text-align: center;
        }

        .results-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .results-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }

        .craft-grid {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: #FAFAFA;
          min-height: 60vh;
        }

        .craft-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .craft-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(60, 207, 207, 0.2);
          border-color: #3CCFCF;
        }

        .craft-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #FFE8DC 0%, #E0F7FA 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          position: relative;
        }

        .craft-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255, 255, 255, 0.95);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          color: #3CCFCF;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .craft-info {
          padding: 20px;
        }

        .craft-name {
          font-family: 'Fredoka', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin-bottom: 12px;
        }

        .craft-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #666;
        }

        .meta-icon {
          width: 16px;
          height: 16px;
          color: #3CCFCF;
        }

        .materials-used {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }

        .material-tag {
          background: linear-gradient(135deg, #F0FCFC 0%, #FFFFFF 100%);
          border: 1px solid #3CCFCF;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 13px;
          color: #3CCFCF;
          font-weight: 500;
        }

        .craft-actions {
          display: flex;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid #F0F0F0;
        }

        .secondary-button {
          flex: 1;
          padding: 12px;
          background: #F5F5F5;
          border: none;
          border-radius: 12px;
          font-family: 'Fredoka', sans-serif;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .secondary-button:hover {
          background: #3CCFCF;
          color: white;
          transform: translateY(-2px);
        }

        .secondary-button.saved {
          background: linear-gradient(135deg, #FF6F61 0%, #FF8A7A 100%);
          color: white;
        }

        .detail-screen {
          background: #FAFAFA;
          min-height: 100vh;
        }

        .detail-header {
          position: relative;
          height: 240px;
          background: linear-gradient(135deg, #FFE8DC 0%, #E0F7FA 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 96px;
        }

        .detail-back {
          position: absolute;
          top: 24px;
          left: 24px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .detail-save {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .detail-save:hover {
          background: #FF6F61;
          color: white;
          transform: scale(1.1);
        }

        .detail-save.saved {
          background: #FF6F61;
          color: white;
        }

        .detail-content {
          padding: 24px;
          margin-top: -32px;
          position: relative;
          z-index: 1;
        }

        .detail-card {
          background: white;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          margin-bottom: 20px;
        }

        .detail-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 16px;
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: #F9F9F9;
          border-radius: 16px;
          border-left: 4px solid #3CCFCF;
        }

        .step-num {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3CCFCF 0%, #2AB8B8 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content {
          flex: 1;
        }

        .step-title {
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .step-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tip-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: linear-gradient(135deg, #FFF9E6 0%, #FFFFFF 100%);
          border-radius: 12px;
          border: 1px solid #FFD84D;
        }

        .tip-icon {
          color: #FFD84D;
          flex-shrink: 0;
        }

        .tip-text {
          font-size: 14px;
          color: #666;
          line-height: 1.5;
        }

        .alert {
          background: #FFF4F4;
          border: 2px solid #FF6F61;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 20px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .alert-icon {
          color: #FF6F61;
          flex-shrink: 0;
        }

        .alert-text {
          font-size: 14px;
          color: #333;
          line-height: 1.5;
        }

        .empty-state {
          padding: 60px 24px;
          text-align: center;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          color: #CCC;
        }

        .empty-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #999;
          margin-bottom: 12px;
        }

        .empty-subtitle {
          font-size: 16px;
          color: #AAA;
          margin-bottom: 32px;
        }

        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 430px;
          background: white;
          border-top: 1px solid #F0F0F0;
          display: flex;
          padding: 12px 0;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
        }

        .nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #999;
          transition: all 0.3s ease;
        }

        .nav-item.active {
          color: #3CCFCF;
        }

        .nav-icon {
          width: 24px;
          height: 24px;
        }

        .nav-label {
          font-size: 12px;
          font-weight: 600;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .hidden-input {
          display: none;
        }

        @media (max-width: 430px) {
          .option-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

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
            <div className="feature-card">
              <div className="feature-icon">
                <Camera size={24} color="#3CCFCF" />
              </div>
              <div className="feature-title">Snap & Scan</div>
              <div className="feature-desc">
                Take photos of household items or recyclables
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={24} color="#FF6F61" />
              </div>
              <div className="feature-title">AI Magic</div>
              <div className="feature-desc">
                Get personalized craft ideas in seconds
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Star size={24} color="#FFD84D" />
              </div>
              <div className="feature-title">Easy Steps</div>
              <div className="feature-desc">
                Follow simple, kid-friendly instructions
              </div>
            </div>
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
          setIsProcessing={setIsProcessing}
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
      <div className="header">
        <button className="back-button" onClick={() => goToScreen('welcome')}>
          <X size={20} />
        </button>
        <h2 className="header-title">Upload Materials</h2>
        <div className="step-indicator">Step 1/3</div>
      </div>

      {error && (
        <div className="alert">
          <AlertCircle className="alert-icon" size={20} />
          <div className="alert-text">{error}</div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
          <Upload className="upload-icon" />
          <div className="upload-title">Add Your Materials</div>
          <div className="upload-subtitle">Take a photo or choose from gallery</div>
          <div className="upload-buttons">
            <button className="upload-button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              <Camera size={18} />
              Camera
            </button>
            <button className="upload-button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              <Upload size={18} />
              Gallery
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden-input"
          />
        </div>
      ) : (
        <>
          <div className="image-preview-grid">
            {images.map(img => (
              <div key={img.id} className="image-preview">
                <img src={img.url} alt="Material" />
                <button className="remove-image" onClick={() => removeImage(img.id)}>
                  <X size={16} />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <div className="image-preview" style={{ background: '#f0f0f0', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                <Plus size={48} color="#999" />
              </div>
            )}
          </div>
          <div className="image-count">{images.length} of 5 images</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden-input"
          />
        </>
      )}

      <button 
        className="primary-button" 
        onClick={analyzeImages}
        disabled={images.length === 0}
        style={{ opacity: images.length === 0 ? 0.5 : 1 }}
      >
        <Sparkles size={20} />
        Detect Materials
      </button>
    </div>
  );
}

function ReviewScreen({ detectedMaterials, confirmedMaterials, setConfirmedMaterials, goToScreen, error }) {
  const [newMaterial, setNewMaterial] = useState('');

  useEffect(() => {
    if (confirmedMaterials.length === 0) {
      setConfirmedMaterials(detectedMaterials);
    }
  }, [detectedMaterials]);

  const removeMaterial = (name) => {
    setConfirmedMaterials(confirmedMaterials.filter(m => m.name !== name));
  };

  const addMaterial = () => {
    if (!newMaterial.trim()) return;
    
    const material = {
      name: newMaterial.trim().toLowerCase(),
      emoji: '📦'
    };
    
    setConfirmedMaterials([...confirmedMaterials, material]);
    setNewMaterial('');
  };

  const handleContinue = () => {
    if (confirmedMaterials.length === 0) {
      return;
    }
    goToScreen('preferences');
  };

  return (
    <div className="upload-screen fade-in">
      <div className="header">
        <button className="back-button" onClick={() => goToScreen('upload')}>
          <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <h2 className="header-title">Review Materials</h2>
        <div className="step-indicator">Step 2/3</div>
      </div>

      {error && (
        <div className="alert">
          <AlertCircle className="alert-icon" size={20} />
          <div className="alert-text">{error}</div>
        </div>
      )}

      <div className="add-material-section">
        <div className="section-title">✨ Detected Materials</div>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
          Review and edit the materials we found
        </p>
        
        <div className="material-list">
          {confirmedMaterials.map((material, idx) => (
            <div key={idx} className="material-chip confirmed">
              <div className="material-info">
                <div className="material-icon">{material.emoji}</div>
                <div className="material-name">{material.name}</div>
              </div>
              <div className="material-actions">
                <button className="icon-button delete" onClick={() => removeMaterial(material.name)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="add-material-section">
        <div className="section-title">➕ Add More Materials</div>
        <div className="input-with-button">
          <input
            type="text"
            className="material-input"
            placeholder="e.g., toilet paper roll"
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
          />
          <button className="add-button" onClick={addMaterial}>
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      <button 
        className="primary-button" 
        onClick={handleContinue}
        disabled={confirmedMaterials.length === 0}
        style={{ opacity: confirmedMaterials.length === 0 ? 0.5 : 1 }}
      >
        Continue
        <ChevronRight size={20} />
      </button>
    </div>
  );
}

function PreferencesScreen({ preferences, setPreferences, confirmedMaterials, goToScreen, setIsProcessing, setCraftSuggestions, setError }) {
  const handleToolToggle = (tool) => {
    const tools = preferences.tools.includes(tool)
      ? preferences.tools.filter(t => t !== tool)
      : [...preferences.tools, tool];
    setPreferences({ ...preferences, tools });
  };

  const handleGenerateCrafts = async () => {
    setIsProcessing(true);
    goToScreen('processing');

    try {
      const crafts = await generateCrafts(
        confirmedMaterials.map(m => m.name),
        preferences
      );

      setCraftSuggestions(crafts.length > 0 ? crafts : generateFallbackCrafts(confirmedMaterials, preferences));
      setTimeout(() => { setIsProcessing(false); goToScreen('results'); }, 1500);
    } catch (err) {
      console.error('Generation error:', err);
      setCraftSuggestions(generateFallbackCrafts(confirmedMaterials, preferences));
      setTimeout(() => { setIsProcessing(false); goToScreen('results'); }, 1500);
    }
  };

  return (
    <div className="upload-screen fade-in">
      <div className="header">
        <button className="back-button" onClick={() => goToScreen('review')}>
          <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <h2 className="header-title">Your Preferences</h2>
        <div className="step-indicator">Step 3/3</div>
      </div>

      <div className="preference-section">
        <div className="section-title">📊 Skill Level</div>
        <div className="option-grid">
          <button
            className={`option-button ${preferences.skillLevel === 'beginner' ? 'selected' : ''}`}
            onClick={() => setPreferences({ ...preferences, skillLevel: 'beginner' })}
          >
            Beginner
          </button>
          <button
            className={`option-button ${preferences.skillLevel === 'intermediate' ? 'selected' : ''}`}
            onClick={() => setPreferences({ ...preferences, skillLevel: 'intermediate' })}
          >
            Intermediate
          </button>
        </div>
      </div>

      <div className="preference-section">
        <div className="section-title">⏱️ Time Available</div>
        <div className="option-grid">
          <button
            className={`option-button ${preferences.timeAvailable === '5-10' ? 'selected' : ''}`}
            onClick={() => setPreferences({ ...preferences, timeAvailable: '5-10' })}
          >
            5-10 mins
          </button>
          <button
            className={`option-button ${preferences.timeAvailable === '15-30' ? 'selected' : ''}`}
            onClick={() => setPreferences({ ...preferences, timeAvailable: '15-30' })}
          >
            15-30 mins
          </button>
        </div>
      </div>

      <div className="preference-section">
        <div className="section-title">🎯 Purpose</div>
        <div className="option-grid">
          <button
            className={`option-button ${preferences.purpose === 'home-decor' ? 'selected' : ''}`}
            onClick={() => setPreferences({ ...preferences, purpose: 'home-decor' })}
          >
            Home Decor
          </button>
          <button
            className={`option-button ${preferences.purpose === 'gift' ? 'selected' : ''}`}
            onClick={() => setPreferences({ ...preferences, purpose: 'gift' })}
          >
            Gift
          </button>
          <button
            className={`option-button ${preferences.purpose === 'school' ? 'selected' : ''}`}
            onClick={() => setPreferences({ ...preferences, purpose: 'school' })}
          >
            School Project
          </button>
          <button
            className={`option-button ${preferences.purpose === 'kids' ? 'selected' : ''}`}
            onClick={() => setPreferences({ ...preferences, purpose: 'kids' })}
          >
            Kids Craft
          </button>
        </div>
      </div>

      <div className="preference-section">
        <div className="section-title">🛠️ Tools Available</div>
        <div className="tools-grid">
          {['Scissors', 'Glue', 'Paint', 'Tape'].map(tool => (
            <div
              key={tool}
              className={`tool-checkbox ${preferences.tools.includes(tool) ? 'checked' : ''}`}
              onClick={() => handleToolToggle(tool)}
            >
              <div className="checkbox">
                {preferences.tools.includes(tool) && <CheckCircle size={16} color="white" />}
              </div>
              <span>{tool}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="primary-button" onClick={handleGenerateCrafts}>
        <Sparkles size={20} />
        Generate Ideas
      </button>
    </div>
  );
}

function ProcessingScreen() {
  return (
    <div className="processing-screen fade-in">
      <div className="spinner-container">
        <div className="spinner"></div>
        <Sparkles className="spinner-icon" size={48} />
      </div>
      
      <h2 className="processing-title">Creating Your Crafts</h2>
      <p className="processing-subtitle">Our AI is working its magic...</p>

      <div className="processing-steps">
        <div className="processing-step">
          <div className="step-number">1</div>
          <div className="step-text">Analyzing materials</div>
        </div>
        <div className="processing-step">
          <div className="step-number">2</div>
          <div className="step-text">Finding perfect projects</div>
        </div>
        <div className="processing-step">
          <div className="step-number">3</div>
          <div className="step-text">Creating instructions</div>
        </div>
      </div>
    </div>
  );
}

function ResultsScreen({ craftSuggestions, setSelectedCraft, goToScreen, toggleSaveCraft, savedCrafts, resetApp }) {
  const handleCraftClick = (craft) => {
    setSelectedCraft(craft);
    goToScreen('detail');
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '80px' }}>
      <div className="results-header">
        <h1 className="results-title">Your Craft Ideas 🎨</h1>
        <p className="results-subtitle">{craftSuggestions.length} creative projects ready!</p>
      </div>

      <div className="craft-grid">
        {craftSuggestions.map((craft) => (
          <div key={craft.id} className="craft-card" onClick={() => handleCraftClick(craft)}>
            <div className="craft-image">
              <span style={{ fontSize: '96px' }}>{craft.emoji}</span>
              <div className="craft-badge">
                <Star size={14} />
                {craft.difficulty}
              </div>
            </div>
            <div className="craft-info">
              <h3 className="craft-name">{craft.name}</h3>
              <div className="craft-meta">
                <div className="meta-item">
                  <Clock className="meta-icon" />
                  {craft.time}
                </div>
              </div>
              <div className="materials-used">
                {craft.materials.slice(0, 3).map((mat, idx) => (
                  <span key={idx} className="material-tag">{mat}</span>
                ))}
                {craft.materials.length > 3 && (
                  <span className="material-tag">+{craft.materials.length - 3} more</span>
                )}
              </div>
              <div className="craft-actions">
                <button 
                  className="secondary-button"
                  onClick={(e) => { e.stopPropagation(); handleCraftClick(craft); }}
                >
                  View Steps
                  <ChevronRight size={16} />
                </button>
                <button 
                  className={`secondary-button ${savedCrafts.some(c => c.id === craft.id) ? 'saved' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleSaveCraft(craft); }}
                >
                  <Heart size={16} fill={savedCrafts.some(c => c.id === craft.id) ? 'white' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button 
          className="primary-button" 
          onClick={resetApp}
          style={{ marginTop: '20px' }}
        >
          <Plus size={20} />
          Create New Project
        </button>
      </div>
    </div>
  );
}

function DetailScreen({ craft, goToScreen, toggleSaveCraft, savedCrafts }) {
  const isSaved = savedCrafts.some(c => c.id === craft.id);

  return (
    <div className="detail-screen fade-in">
      <div className="detail-header">
        <span style={{ fontSize: '128px' }}>{craft.emoji}</span>
        <button className="detail-back" onClick={() => goToScreen('results')}>
          <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <button 
          className={`detail-save ${isSaved ? 'saved' : ''}`}
          onClick={() => toggleSaveCraft(craft)}
        >
          <Heart size={24} fill={isSaved ? 'white' : 'none'} />
        </button>
      </div>

      <div className="detail-content">
        <div className="detail-card">
          <h1 className="detail-title">{craft.name}</h1>
          <div className="craft-meta" style={{ marginBottom: '16px' }}>
            <div className="meta-item">
              <Star className="meta-icon" />
              {craft.difficulty}
            </div>
            <div className="meta-item">
              <Clock className="meta-icon" />
              {craft.time}
            </div>
          </div>
          <div className="materials-used">
            {craft.materials.map((mat, idx) => (
              <span key={idx} className="material-tag">{mat}</span>
            ))}
          </div>
        </div>

        <div className="detail-card">
          <div className="section-title">📝 Step-by-Step Instructions</div>
          <div className="steps-list">
            {craft.steps.map((step, idx) => (
              <div key={idx} className="step-item">
                <div className="step-num">{idx + 1}</div>
                <div className="step-content">
                  <div className="step-title">{step.title}</div>
                  <div className="step-desc">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {craft.tips && craft.tips.length > 0 && (
          <div className="detail-card">
            <div className="section-title">💡 Pro Tips</div>
            <div className="tips-list">
              {craft.tips.map((tip, idx) => (
                <div key={idx} className="tip-item">
                  <Sparkles className="tip-icon" size={20} />
                  <div className="tip-text">{tip}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SavedScreen({ savedCrafts, setSelectedCraft, goToScreen }) {
  const handleCraftClick = (craft) => {
    setSelectedCraft(craft);
    goToScreen('detail');
  };

  if (savedCrafts.length === 0) {
    return (
      <div className="empty-state fade-in" style={{ paddingBottom: '80px' }}>
        <Heart className="empty-icon" />
        <h2 className="empty-title">No Saved Crafts Yet</h2>
        <p className="empty-subtitle">Save your favorite projects to find them here!</p>
        <button className="primary-button" onClick={() => goToScreen('results')}>
          <Search size={20} />
          Explore Crafts
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ paddingBottom: '80px' }}>
      <div className="results-header">
        <h1 className="results-title">Saved Crafts ❤️</h1>
        <p className="results-subtitle">{savedCrafts.length} project{savedCrafts.length !== 1 ? 's' : ''} saved</p>
      </div>

      <div className="craft-grid">
        {savedCrafts.map((craft) => (
          <div key={craft.id} className="craft-card" onClick={() => handleCraftClick(craft)}>
            <div className="craft-image">
              <span style={{ fontSize: '96px' }}>{craft.emoji}</span>
              <div className="craft-badge">
                <Star size={14} />
                {craft.difficulty}
              </div>
            </div>
            <div className="craft-info">
              <h3 className="craft-name">{craft.name}</h3>
              <div className="craft-meta">
                <div className="meta-item">
                  <Clock className="meta-icon" />
                  {craft.time}
                </div>
              </div>
              <div className="materials-used">
                {craft.materials.slice(0, 3).map((mat, idx) => (
                  <span key={idx} className="material-tag">{mat}</span>
                ))}
                {craft.materials.length > 3 && (
                  <span className="material-tag">+{craft.materials.length - 3} more</span>
                )}
              </div>
              <div className="craft-actions">
                <button 
                  className="secondary-button"
                  onClick={(e) => { e.stopPropagation(); handleCraftClick(craft); }}
                >
                  View Steps
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
    {
      id: `craft-${timestamp}-1`,
      name: 'Colorful Pen Holder',
      emoji: '✏️',
      difficulty: 'Easy ⭐',
      time: '15 mins',
      materials: materialNames.slice(0, 2),
      steps: [
        { title: 'Prepare Container', description: 'Clean and dry your container thoroughly' },
        { title: 'Decorate', description: 'Wrap with paper or paint in your favorite colors' },
        { title: 'Add Details', description: 'Glue on decorations like buttons or ribbon' },
        { title: 'Fill It Up', description: 'Add your pens, pencils, and markers!' }
      ],
      tips: [
        'Use bright colors to make it pop',
        'Add glitter for extra sparkle'
      ]
    },
    {
      id: `craft-${timestamp}-2`,
      name: 'Mini Terrarium Garden',
      emoji: '🌱',
      difficulty: 'Easy ⭐',
      time: '20 mins',
      materials: materialNames.slice(0, 2),
      steps: [
        { title: 'Create Base', description: 'Add small pebbles to the bottom for drainage' },
        { title: 'Add Soil', description: 'Fill halfway with potting soil' },
        { title: 'Plant Succulents', description: 'Arrange your small plants creatively' },
        { title: 'Decorate', description: 'Add tiny decorations like pebbles or figurines' }
      ],
      tips: [
        'Choose drought-resistant plants',
        'Water sparingly once a week'
      ]
    },
    {
      id: `craft-${timestamp}-3`,
      name: 'Decorative Wall Art',
      emoji: '🎨',
      difficulty: 'Easy ⭐',
      time: '25 mins',
      materials: materialNames,
      steps: [
        { title: 'Create Canvas', description: 'Cut cardboard to your desired size' },
        { title: 'Paint Background', description: 'Apply base color with paint or markers' },
        { title: 'Add Texture', description: 'Glue on cut paper, fabric, or natural materials' },
        { title: 'Final Touch', description: 'Add details with markers or stickers' }
      ],
      tips: [
        'Use complementary colors for visual appeal',
        'Layer materials for depth'
      ]
    },
    {
      id: `craft-${timestamp}-4`,
      name: 'Unique Gift Box',
      emoji: '🎁',
      difficulty: 'Easy ⭐',
      time: '18 mins',
      materials: materialNames,
      steps: [
        { title: 'Shape Box', description: 'Fold cardboard into a box shape and secure with tape' },
        { title: 'Cover Exterior', description: 'Wrap with decorative paper or fabric' },
        { title: 'Add Ribbon', description: 'Tie a colorful ribbon around the box' },
        { title: 'Personalize', description: 'Add a handmade tag with a message' }
      ],
      tips: [
        'Use double-sided tape for clean edges',
        'Match ribbon color to wrapping paper'
      ]
    }
  ];

  return allCrafts.slice(0, 4);
}
