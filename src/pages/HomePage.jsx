import { useState, useEffect } from 'react';
import { getAllBreeds } from '../services/dogService.js';
import BreedCard from '../components/BreedCard.jsx';
import './HomePage.css';

/**
 * Komponen HomePage - Anggota 2
 * Menangani fetching data utama, loading state, error state,
 * dan perenderan daftar kartu ras anjing menggunakan map() dengan key unik.
 */
const HomePage = ({
  onSelectBreed,
  searchSlot,
  filteredBreeds,
  emptyStateSlot,
}) => {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadBreeds = async () => {
      try {
        const data = await getAllBreeds();

        if (isMounted) {
          // Transformasi respons object { breed: [subBreeds] } menjadi array
          const formattedBreeds = Object.entries(data).map(([name, subBreeds]) => ({
            name,
            subBreeds: Array.isArray(subBreeds) ? subBreeds : [],
          }));

          setBreeds(formattedBreeds);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error saat mengambil data ras anjing:', err);
          setError(
            err.message || 'Gagal memuat daftar ras anjing. Pastikan koneksi internet stabil.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBreeds();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAllBreeds();
      const formattedBreeds = Object.entries(data).map(([name, subBreeds]) => ({
        name,
        subBreeds: Array.isArray(subBreeds) ? subBreeds : [],
      }));

      setBreeds(formattedBreeds);
    } catch (err) {
      setError(
        err.message || 'Gagal memuat daftar ras anjing. Pastikan koneksi internet stabil.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Tentukan daftar data yang akan dirender (jika ada filtering dari Anggota 3, gunakan filteredBreeds)
  const displayBreeds = filteredBreeds !== undefined ? filteredBreeds : breeds;

  return (
    <main className="home-container">
      {/* Hero / Intro Section */}
      <section className="home-hero-section">
        <span className="hero-pill-badge">🐾 Dog CEO REST API</span>
        <h1 className="home-hero-title">Katalog Ras Anjing Dunia</h1>
        <p className="home-hero-subtitle">
          Temukan dan jelajahi puluhan varietas ras anjing terbaik dengan galeri foto
          berkualitas tinggi dari seluruh penjuru dunia.
        </p>

        {/* Slot Opsional untuk SearchBar (Fitur Anggota 3) */}
        {searchSlot && <div className="home-search-slot">{searchSlot}</div>}
      </section>

      {/* Main Content Section */}
      <section
        className="home-catalog-section"
        id="katalog-ras"
        aria-label="Daftar Ras Anjing"
      >
        {/* 1. Loading State */}
        {loading && (
          <div
            className="status-container status-loading"
            role="status"
            aria-live="polite"
          >
            <div className="spinner-large" aria-hidden="true"></div>
            <p className="status-title">Memuat data ras anjing...</p>
            <p className="status-desc">
              Menghubungi Dog CEO API untuk mengumpulkan data.
            </p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="status-container status-error" role="alert">
            <span className="status-icon" aria-hidden="true">
              ⚠️
            </span>
            <h2 className="status-title">Terjadi Kesalahan</h2>
            <p className="status-desc">{error}</p>
            <button
              type="button"
              className="retry-button"
              onClick={handleRetry}
            >
              🔄 Coba Lagi
            </button>
          </div>
        )}

        {/* 3. Empty State Slot (Penanganan data kosong pencarian Anggota 3) */}
        {!loading && !error && emptyStateSlot && displayBreeds.length === 0 && (
          emptyStateSlot
        )}

        {/* 4. Success State: Render List dengan map() dan key unik */}
        {!loading && !error && displayBreeds.length > 0 && (
          <div className="catalog-content">
            <div className="catalog-header-info">
              <span className="catalog-count-badge">
                Menampilkan <strong>{displayBreeds.length}</strong> ras anjing
              </span>
            </div>

            <div className="breed-grid">
              {displayBreeds.map((item) => (
                <BreedCard
                  key={item.name}
                  breed={item.name}
                  subBreeds={item.subBreeds}
                  onSelectBreed={onSelectBreed}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
