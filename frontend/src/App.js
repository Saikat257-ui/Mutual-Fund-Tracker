import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FundDetails from './pages/FundDetails';
import SavedFunds from './pages/SavedFunds';
import { LoadingSpinner } from './components/ui';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ErrorBoundary from './components/ErrorBoundary';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function PageTransition({ children }) {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20
    },
    enter: {
      opacity: 1,
      x: 0
    },
    exit: {
      opacity: 0,
      x: 20
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  <Register />
                </PageTransition>
              }
            />
            <Route
              path="/fund/:schemeCode"
              element={
                <PageTransition>
                  <FundDetails />
                </PageTransition>
              }
            />
            <Route
              path="/saved-funds"
              element={
                <PrivateRoute>
                  <PageTransition>
                    <SavedFunds />
                  </PageTransition>
                </PrivateRoute>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
