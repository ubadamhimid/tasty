import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Brides from './pages/Brides';
import HairColor from './pages/HairColor';
import Extensions from './pages/Extensions';
import Gallery from './pages/Gallery';
import Book from './pages/Book';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brides" element={<Brides />} />
            <Route path="/hair-color" element={<HairColor />} />
            <Route path="/extensions" element={<Extensions />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/book" element={<Book />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </Router>
  );
}

export default App;
