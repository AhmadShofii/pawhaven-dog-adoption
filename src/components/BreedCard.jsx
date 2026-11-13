import { useState, useEffect } from 'react';
import { getRandomImageByBreed } from '../services/dogService.js';
import { formatBreedName } from '../utils/formatters.js';
import './BreedCard.css';

const BreedCard = ({
  breed = '',
  subBreeds = [],
  image = '',
  onSelectBreed,
}) => {
  const [fetchedImage, setFetchedImage] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(!image);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Jika gambar sudah dioper lewat props, tidak perlu fetch dari API
    if (image || !breed) {
      return;
    }

    let isSubscribed = true;

    getRandomImageByBreed(breed)
      .then((url) => {
        if (isSubscribed) {
          setFetchedImage(url);
          setIsLoadingImage(false);
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          console.warn(`Gagal memuat gambar untuk ras ${breed}:`, err.message);
          setImageError(true);
          setIsLoadingImage(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [breed, image]);

  const displayImage = image || fetchedImage;
  const formattedName = formatBreedName(breed);
  const hasSubBreeds = Array.isArray(subBreeds) && subBreeds.length > 0;

  const handleCardClick = () => {
    if (typeof onSelectBreed === 'function') {
      onSelectBreed(breed, subBreeds, displayImage);
    }
  };

  return (
    <article className="breed-card" onClick={handleCardClick}>
      <div className="breed-card-media">
        {isLoadingImage && (
          <div className="breed-image-skeleton" aria-hidden="true">
            <span className="spinner-mini"></span>
          </div>
        )}

        {imageError ? (
          <div
            className="breed-image-fallback"
            role="img"
            aria-label={`Gambar alternatif ras ${formattedName}`}
          >
            <span className="fallback-icon" aria-hidden="true">
              🐕
            </span>
            <span className="fallback-text">Foto belum tersedia</span>
          </div>
        ) : (
          <img
            src={displayImage}
            alt={`Foto anjing ras ${formattedName}`}
            className={`breed-card-image ${isLoadingImage ? 'loading' : 'loaded'}`}
            onLoad={() => setIsLoadingImage(false)}
            onError={() => {
              setImageError(true);
              setIsLoadingImage(false);
            }}
            loading="lazy"
          />
        )}

        {hasSubBreeds && (
          <span
            className="breed-badge"
            title={`${subBreeds.length} sub-ras ditemukan`}
          >
            {subBreeds.length} Sub-ras
          </span>
        )}
      </div>

      <div className="breed-card-content">
        <h3 className="breed-card-title">{formattedName}</h3>

        {hasSubBreeds && (
          <p className="breed-card-subtypes">
            Tipe:{' '}
            {subBreeds
              .slice(0, 3)
              .map((sub) => formatBreedName(sub))
              .join(', ')}
            {subBreeds.length > 3 && ` +${subBreeds.length - 3} lainnya`}
          </p>
        )}

        <div className="breed-card-footer">
          <button
            type="button"
            className="breed-card-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            aria-label={`Lihat detail ras ${formattedName}`}
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </article>
  );
};

export default BreedCard;
