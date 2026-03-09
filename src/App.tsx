import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateGift from './pages/CreateGift';
import OpenGift from './pages/OpenGift';
import GiftReveal from './pages/GiftReveal';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export default function App() {
  return (
    <Router>
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateGift />} />
        <Route path="/open" element={<OpenGift />} />
        <Route path="/gift/:id" element={<GiftReveal />} />
      </Routes>
    </Router>
  );
}
