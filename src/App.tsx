import React from 'react';
import { NavigationProvider, usePathname } from './lib/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SimulationPage from './pages/SimulationPage';
import ExercisesPage from './pages/ExercisesPage';
import MethodologyPage from './pages/MethodologyPage';
import AudioDispatchPage from './pages/AudioDispatchPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ReplayPage from './pages/ReplayPage';
import LoginPage from './pages/LoginPage';
import AIPage from './pages/AIPage';

function RouteSwitch() {
  const pathname = usePathname();

  const renderContent = () => {
    if (pathname === '/ai' || pathname === '/search' || pathname === '/bubbles-ai') {
      return <AIPage />;
    }
    if (pathname === '/exercises') {
      return <ExercisesPage />;
    }
    if (pathname === '/simulation') {
      return <SimulationPage />;
    }
    if (pathname === '/methodology') {
      return <MethodologyPage />;
    }
    if (pathname === '/audio-dispatch') {
      return <AudioDispatchPage />;
    }
    if (pathname === '/contact') {
      return <ContactPage />;
    }
    if (pathname === '/terms') {
      return <TermsPage />;
    }
    if (pathname === '/privacy') {
      return <PrivacyPage />;
    }
    if (pathname === '/replay') {
      return <ReplayPage />;
    }
    if (pathname === '/login') {
      return <LoginPage />;
    }
    // Default to Home Page ('/')
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 font-sans">
      <Navbar />
      <main className="flex-1">{renderContent()}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <NavigationProvider>
      <RouteSwitch />
    </NavigationProvider>
  );
}
