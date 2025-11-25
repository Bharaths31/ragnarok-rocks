import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Games from './pages/Games';
import News from './pages/News';
import Tools from './pages/Tools';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/games" element={<Games />} />
          <Route path="/news" element={<News />} />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
