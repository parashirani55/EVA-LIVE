import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Dashboard from './pages/Dashboard';
import Calls from './pages/Calls';
import Campaigns from './pages/Campaigns';
import Settings from './pages/Settings';
import LiveMonitor from './pages/LiveMonitor';
import Home from './pages/Home';
import Features from './pages/Features';
import Login from './pages/Login';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Register from './pages/Register';
import ContactPage from './pages/Contact';
import OpenAITester from './pages/OpenAITester';
// import TrelloTest from './pages/TrelloTest';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import PublicRoute from './components/publicRoute';
import ConversationTester from "./pages/ConversationTester";
import Profile from './components/Profile'; // Your Profile component
import { Contact } from 'lucide-react';
import ConversationCampaigns from "./pages/ConversationCampaigns";
import ConversationCalls from "./pages/ConversationCalls";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/conversation-tester" element={<ConversationTester />} />

<Route path="/conversation-campaigns" element={<ConversationCampaigns />} />
<Route path="/conversation-calls" element={<ConversationCalls />} />
<Route
          path="/Features"
          element={
            <PublicRoute>
              <Features />
            </PublicRoute>
          }
        />

        <Route path="/Pricing" element={
          <PublicRoute>
            <Pricing />
          </PublicRoute>
        }
/>

<Route path="/About" element={
          <PublicRoute>
            <About />
          </PublicRoute>
        }
/>

<Route path="/contact" element={
          <PublicRoute>
            <ContactPage />
          </PublicRoute>
        }
/>
        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 bg-gray-100">
                  
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calls" element={<Calls />} />
                    <Route path="/campaigns" element={<Campaigns />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/live" element={<LiveMonitor />} />
                    <Route path="/test-openai" element={<OpenAITester />} />
                    {/* <Route path="/trello" element={<TrelloTest />} /> */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                  <ToastContainer />
                </main>
              </div>
            </ProtectedRoute>
            
          }
        />
      </Routes>
    </Router>
  );
}

export default App;