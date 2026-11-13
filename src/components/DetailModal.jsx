import { useState, useEffect, useCallback } from 'react';
import { getBreedImages } from '../services/dogService.js';
import { formatBreedName } from '../utils/formatters.js';
import './DetailModal.css';

const DetailModal = ({
  breed = '',
  subBreeds = [],
  previewImage = '',
  onClose,
}) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(previewImage || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(24);

  const formattedName = formatBreedName(breed);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      if (!breed) return;

      try {
        const data = await getBreedImages(breed);
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          setImages(list);
          if (list.length > 0 && !previewImage) {
            setSelectedImage(list[0]);
          }
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || 'Gagal memuat galeri foto ras anjing. Periksa koneksi Anda.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
  }, [breed, previewImage]);

  const handleRetry = async () => {
    if (!breed) return;
    setLoading(true);
    setError(null);

    try {
      const data = await getBreedImages(breed);
      const list = Array.isArray(data) ? data : [];
      setImages(list);
      if (list.length > 0) {
        setSelectedImage(list[0]);
      }
    } catch (err) {
      setError(
        err.message || 'Gagal memuat galeri foto ras anjing. Periksa koneksi Anda.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter((url) => {
    if (activeFilter === 'all') return true;
    const lowerUrl = url.toLowerCase();
    const query = `${breed.toLowerCase()}-${activeFilter.toLowerCase()}`;
    return lowerUrl.includes(query) || lowerUrl.includes(`/${activeFilter.toLowerCase()}/`);
  });

  const activeImageList = filteredImages.length > 0 ? filteredImages : images;

  const currentSelectedImage =
    selectedImage && activeImageList.includes(selectedImage)
      ? selectedImage
      : activeImageList[0] || previewImage || '';

  const currentIndex = activeImageList.indexOf(currentSelectedImage);

  const handlePrevImage = useCallback(() => {
    if (activeImageList.length === 0) return;
    const nextIdx = currentIndex <= 0 ? activeImageList.length - 1 : currentIndex - 1;
    setSelectedImage(activeImageList[nextIdx]);
  }, [activeImageList, currentIndex]);

  const handleNextImage = useCallback(() => {
    if (activeImageList.length === 0) return;
    const nextIdx = currentIndex >= activeImageList.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(activeImageList[nextIdx]);
  }, [activeImageList, currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (typeof onClose === 'function') onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, handlePrevImage, handleNextImage]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && typeof onClose === 'function') {
      onClose();
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 24);
  };

  const displayedThumbnails = activeImageList.slice(0, visibleCount);
  const hasMore = visibleCount < activeImageList.length;

  return (
    <div
      className="detail-modal-overlay"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <section
        className="detail-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-breed-title"
      >
        <header className="detail-modal-header">
          <div className="modal-header-info">
            <span className="modal-badge-pill">🐾 Detail Ras Anjing</span>
            <h2 id="modal-breed-title" className="modal-breed-title">
              {formattedName}
            </h2>
            <p className="modal-breed-meta">
              {!loading && !error && (
                <>
                  Total koleksi: <strong>{images.length}</strong> foto
                  {subBreeds.length > 0 && ` • ${subBreeds.length} Sub-ras`}
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup jendela detail ras"
            title="Tutup (Esc)"
          >
            ✕
          </button>
        </header>

        <main className="detail-modal-body">
          {subBreeds && subBreeds.length > 0 && (
            <div className="modal-subbreeds-container">
              <span className="modal-subbreeds-label">Filter Sub-ras:</span>
              <div className="modal-subbreeds-list" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === 'all'}
                  className={`subbreed-chip ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('all');
                    setVisibleCount(24);
                  }}
                >
                  Semua ({images.length})
                </button>
                {subBreeds.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    role="tab"
                    aria-selected={activeFilter === sub}
                    className={`subbreed-chip ${activeFilter === sub ? 'active' : ''}`}
                    onClick={() => {
                      setActiveFilter(sub);
                      setVisibleCount(24);
                    }}
                  >
                    {formatBreedName(sub)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div
              className="modal-state-container modal-loading"
              role="status"
              aria-live="polite"
            >
              <div className="modal-spinner" aria-hidden="true"></div>
              <p className="modal-state-title">Memuat galeri foto...</p>
              <p className="modal-state-desc">
                Mengambil koleksi gambar lengkap untuk ras {formattedName} dari Dog CEO API.
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="modal-state-container modal-error" role="alert">
              <span className="modal-state-icon" aria-hidden="true">
                ⚠️
              </span>
              <h3 className="modal-state-title">Gagal Memuat Galeri</h3>
              <p className="modal-state-desc">{error}</p>
              <button
                type="button"
                className="modal-retry-btn"
                onClick={handleRetry}
              >
                🔄 Coba Lagi
              </button>
            </div>
          )}

          {!loading && !error && activeImageList.length === 0 && (
            <div className="modal-state-container modal-empty">
              <span className="modal-state-icon" aria-hidden="true">
                📷
              </span>
              <h3 className="modal-state-title">Tidak Ada Foto</h3>
              <p className="modal-state-desc">
                Belum ada foto galeri yang tersedia untuk kategori ras {formattedName} ini.
              </p>
            </div>
          )}

          {!loading && !error && activeImageList.length > 0 && (
            <>
              <article className="modal-spotlight-wrapper">
                <div className="modal-spotlight-media">
                  <img
                    src={currentSelectedImage}
                    alt={`Foto utama ras ${formattedName}`}
                    className="modal-spotlight-img"
                  />

                  {activeImageList.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="spotlight-nav-btn nav-prev"
                        onClick={handlePrevImage}
                        aria-label="Foto sebelumnya"
                        title="Foto Sebelumnya (Panah Kiri)"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="spotlight-nav-btn nav-next"
                        onClick={handleNextImage}
                        aria-label="Foto selanjutnya"
                        title="Foto Selanjutnya (Panah Kanan)"
                      >
                        ›
                      </button>
                    </>
                  )}

                  <div className="spotlight-bottom-bar">
                    <span className="spotlight-counter">
                      Foto {currentIndex >= 0 ? currentIndex + 1 : 1} dari{' '}
                      {activeImageList.length}
                    </span>

                    <a
                      href={currentSelectedImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="spotlight-raw-link"
                      title="Buka gambar resolusi penuh di tab baru"
                    >
                      Buka Penuh ↗
                    </a>
                  </div>
                </div>
              </article>

              <section
                className="modal-gallery-section"
                aria-label="Koleksi Galeri Foto"
              >
                <div className="gallery-header-bar">
                  <h3 className="gallery-section-title">
                    Koleksi Galeri Foto ({activeImageList.length})
                  </h3>
                  <span className="gallery-section-hint">
                    Klik salah satu thumbnail untuk memperbesar
                  </span>
                </div>

                <div className="modal-thumbnails-grid">
                  {displayedThumbnails.map((imgUrl, index) => {
                    const isSelected = imgUrl === currentSelectedImage;
                    return (
                      <button
                        key={imgUrl}
                        type="button"
                        className={`thumbnail-card-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedImage(imgUrl)}
                        aria-label={`Pilih foto ${formattedName} nomor ${index + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail foto ${formattedName} ke-${index + 1}`}
                          className="thumbnail-img"
                          loading="lazy"
                        />
                        {isSelected && (
                          <span className="thumbnail-selected-tag">Aktif</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasMore && (
                  <div className="modal-loadmore-wrapper">
                    <button
                      type="button"
                      className="modal-loadmore-btn"
                      onClick={handleLoadMore}
                    >
                      Muat Lebih Banyak ({activeImageList.length - visibleCount} sisa)
                    </button>
                  </div>
                )}
              </section>
            </>
          )}
        </main>

        <footer className="detail-modal-footer">
          <span className="modal-footer-caption">
            Sumber Data: Dog CEO REST API
          </span>
          <button
            type="button"
            className="modal-footer-close-btn"
            onClick={onClose}
          >
            Tutup Jendela
          </button>
        </footer>
      </section>
    </div>
  );
};

export default DetailModal;
