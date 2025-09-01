import './App.css';
import RegisterForm from './components/RegisterForm';
import HeroSection from './components/HomePage';
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import Dashboard from './components/admin/Dashboard';
import HomePage from './components/HomePage';

// Import router components
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      {/* Define routes here */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Dashboard />} />  
        <Route path="/login" element={<LoginForm />} />  
        <Route path="/register" element={<RegisterForm />} />  
      </Routes>
    </Router>
  );
}

export default App;
