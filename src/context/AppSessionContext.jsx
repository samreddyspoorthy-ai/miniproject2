import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppSessionContext = createContext(null);

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppSessionProvider({ children }) {
  const [selectedMode, setSelectedMode] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [status, setStatus] = useState('Ready to classify waste');
  const [error, setError] = useState('');
  const [user, setUser] = useState(() => readStorage('eco_user', null));
  const [history, setHistory] = useState(() => readStorage('eco_history', []));
  const [language, setLanguage] = useState(() => readStorage('eco_language', 'English'));
  const [voiceMode, setVoiceMode] = useState(() => readStorage('eco_voice_mode', true));
  const [arMode, setArMode] = useState(() => readStorage('eco_ar_mode', true));

  useEffect(() => {
    localStorage.setItem('eco_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('eco_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('eco_language', JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    localStorage.setItem('eco_voice_mode', JSON.stringify(voiceMode));
  }, [voiceMode]);

  useEffect(() => {
    localStorage.setItem('eco_ar_mode', JSON.stringify(arMode));
  }, [arMode]);

  useEffect(() => {
    if (!analysis) return;
    setHistory((current) => {
      const next = [
        {
          id: analysis.image_id,
          predictedClass: analysis.predicted_class,
          wasteCategory: analysis.waste_category,
          confidence: analysis.confidence_score,
          ecoPoints: analysis.gamification?.eco_points || 0,
          carbonSaved: analysis.environmental_metrics?.carbon_saved_if_recycled_kg || 0,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ].slice(0, 20);
      return next;
    });
  }, [analysis]);

  const totalEcoScore = history.reduce((sum, row) => sum + (row.ecoPoints || 0), 0);
  const totalCarbonSaved = history.reduce((sum, row) => sum + (row.carbonSaved || 0), 0);

  const value = useMemo(
    () => ({
      selectedMode,
      setSelectedMode,
      analysis,
      setAnalysis,
      previewUrl,
      setPreviewUrl,
      status,
      setStatus,
      error,
      setError,
      user,
      setUser,
      history,
      language,
      setLanguage,
      voiceMode,
      setVoiceMode,
      arMode,
      setArMode,
      totalEcoScore,
      totalCarbonSaved,
      login(profile) {
        setUser(profile);
      },
      logout() {
        setUser(null);
      },
      clearSession() {
        setSelectedMode('');
        setAnalysis(null);
        setPreviewUrl((current) => {
          if (current?.startsWith('blob:')) URL.revokeObjectURL(current);
          return '';
        });
        setStatus('Ready to classify waste');
        setError('');
      },
    }),
    [
      analysis,
      arMode,
      error,
      history,
      language,
      previewUrl,
      selectedMode,
      status,
      totalCarbonSaved,
      totalEcoScore,
      user,
      voiceMode,
    ],
  );

  return <AppSessionContext.Provider value={value}>{children}</AppSessionContext.Provider>;
}

export function useAppSession() {
  const context = useContext(AppSessionContext);
  if (!context) {
    throw new Error('useAppSession must be used within AppSessionProvider');
  }
  return context;
}
