import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import DetailModal from './components/DetailModal.jsx';
import './App.css';

function App() {
  const [selectedBreed, setSelectedBreed] = useState(null);

  const handleSelectBreed = (breed, subBreeds = [], previewImage = '') => {
    if (typeof breed === 'object' && breed !== null) {
      setSelectedBreed(breed);
    } else {
      setSelectedBreed({ breed, subBreeds, previewImage });
    }
  };

  const handleCloseModal = () => {
    setSelectedBreed(null);
  };

  return (
    <div className="app-layout">
      <Navbar />
      <HomePage onSelectBreed={handleSelectBreed} />
      {selectedBreed && (
        <DetailModal
          breed={selectedBreed.breed}
          subBreeds={selectedBreed.subBreeds}
          previewImage={selectedBreed.previewImage}
          onClose={handleCloseModal}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
