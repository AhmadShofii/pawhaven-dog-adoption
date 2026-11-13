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
    <article className="card breed-card" onClick={handleCardClick}>
      <div className="pic breed-card-media">
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
      </div>

      <span className="name breed-card-title">{formattedName}</span>

      {hasSubBreeds && (
        <span className="sub breed-card-subtypes">
          {subBreeds.length} sub-ras
        </span>
      )}
    </article>
  );
};

export default BreedCard;
