import { useState, useEffect } from 'react';
import { getAllBreeds } from '../services/dogService.js';
import BreedCard from '../components/BreedCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatBreedName } from '../utils/formatters.js';
import './HomePage.css';

const HomePage = ({
  onSelectBreed,
  searchSlot,
  filteredBreeds,
  emptyStateSlot,
}) => {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadBreeds = async () => {
      try {
        const data = await getAllBreeds();

        if (isMounted) {
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

  const clientFilteredBreeds = breeds.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    const rawNameMatch = item.name.toLowerCase().includes(query);
    const formattedName = formatBreedName(item.name).toLowerCase();
    const formattedNameMatch = formattedName.includes(query);

    const subBreedMatch =
      Array.isArray(item.subBreeds) &&
      item.subBreeds.some((sub) => {
        const subRaw = sub.toLowerCase();
        const subFormatted = formatBreedName(sub).toLowerCase();
        return subRaw.includes(query) || subFormatted.includes(query);
      });

    return rawNameMatch || formattedNameMatch || subBreedMatch;
  });

  const displayBreeds =
    filteredBreeds !== undefined ? filteredBreeds : clientFilteredBreeds;

  const isSearching = searchQuery.trim().length > 0;

  return (
    <main className="home-container">
      <section className="home-hero-section">
        <span className="hero-pill-badge">🐾 Dog CEO REST API</span>
        <h1 className="home-hero-title">Katalog Ras Anjing Dunia</h1>
        <p className="home-hero-subtitle">
          Temukan dan jelajahi puluhan varietas ras anjing terbaik dengan galeri foto
          berkualitas tinggi dari seluruh penjuru dunia.
        </p>

        <div className="home-search-slot">
          {searchSlot || (
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              totalResults={!loading && !error ? displayBreeds.length : 0}
              disabled={loading || Boolean(error)}
            />
          )}
        </div>
      </section>

      <section
        className="home-catalog-section"
        id="katalog-ras"
        aria-label="Daftar Ras Anjing"
      >
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

        {!loading && !error && displayBreeds.length === 0 && (
          emptyStateSlot || (
            <EmptyState
              searchQuery={searchQuery}
              onReset={() => setSearchQuery('')}
            />
          )
        )}

        {!loading && !error && displayBreeds.length > 0 && (
          <div className="catalog-content">
            <div className="catalog-header-info">
              <span className="catalog-count-badge">
                {isSearching ? (
                  <>
                    Menemukan <strong>{displayBreeds.length}</strong> ras untuk kata kunci{' '}
                    <span className="search-query-tag">"{searchQuery.trim()}"</span>
                  </>
                ) : (
                  <>
                    Menampilkan <strong>{displayBreeds.length}</strong> ras anjing
                  </>
                )}
              </span>

              {isSearching && (
                <button
                  type="button"
                  className="catalog-reset-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Bersihkan pencarian"
                >
                  ✕ Bersihkan Pencarian
                </button>
              )}
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
