import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateGift from './pages/CreateGift';
import OpenGift from './pages/OpenGift';
import GiftReveal from './pages/GiftReveal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#fdfcf7]">
        <Navbar />
        <LanguageSwitcher />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateGift />} />
            <Route path="/open" element={<OpenGift />} />
            <Route path="/gift/:id" element={<GiftReveal />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
