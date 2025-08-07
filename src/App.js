import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Dashboard from './pages/Dashboard';
import Calls from './pages/Calls';
import Campaigns from './pages/Campaigns';
import Settings from './pages/Settings';
import LiveMonitor from './pages/LiveMonitor';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OpenAITester from './pages/OpenAITester'; // ✅ NEW
import TrelloTest from './pages/TrelloTest';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Sidebar */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 p-6 bg-gray-100">
                <Routes>
                  
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/calls" element={<Calls />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/live" element={<LiveMonitor />} />
                  <Route path="/test-openai" element={<OpenAITester />} /> {/* ✅ NEW */}
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                  <Route path="/trello" element={<TrelloTest />} />
                </Routes>
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
