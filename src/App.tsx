import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EnokiProvider, useEnoki } from './context/EnokiContext';
import Home from './components/Home';
import ArticlePage from './components/ArticlePage';
import './App.css';
import { useEffect } from 'react';

// Wrapper to handle auth callback
function AppContent() {
  const { handleCallback } = useEnoki();

  useEffect(() => {
    // Enoki passes the token in the URL fragment or query
    if (window.location.hash.includes('id_token') || window.location.search.includes('code')) {
      handleCallback();
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/article/:id" element={<ArticlePage />} />
    </Routes>
  );
}

function App() {
  return (
    <EnokiProvider>
      <Router>
        <AppContent />
      </Router>
    </EnokiProvider>
  );
}

export default App;
