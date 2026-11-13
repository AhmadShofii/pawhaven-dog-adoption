import './SearchBar.css';

const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Cari ras anjing (misal: golden, husky, beagle)...',
  totalResults,
  disabled = false,
}) => {
  const popularKeywords = ['Golden', 'Husky', 'Bulldog', 'Corgi', 'Poodle', 'Terrier'];

  const handleInputChange = (event) => {
    if (typeof onChange === 'function') {
      onChange(event.target.value);
    }
  };

  const handleClear = () => {
    if (typeof onChange === 'function') {
      onChange('');
    }
  };

  const handleTagClick = (keyword) => {
    if (typeof onChange === 'function') {
      if (value.toLowerCase() === keyword.toLowerCase()) {
        onChange('');
      } else {
        onChange(keyword);
      }
    }
  };

  return (
    <div className="search-bar-container">
      <form
        className="search-bar-form"
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="breed-search-input" className="search-label">
          <span className="search-label-header">
            <span className="search-label-title">Cari Ras Anjing</span>
            {value.trim() && typeof totalResults === 'number' && (
              <span className="search-results-pill">
                {totalResults} ras ditemukan
              </span>
            )}
          </span>
          <span className="search-label-desc">
            Filter ras atau sub-ras berdasarkan nama
          </span>
        </label>

        <div className={`search-input-wrapper ${disabled ? 'disabled' : ''}`}>
          <span className="search-input-icon" aria-hidden="true">
            🔍
          </span>

          <input
            id="breed-search-input"
            name="breed-search"
            type="search"
            className="search-input"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="off"
            spellCheck="false"
            aria-describedby="search-hint"
          />

          {value && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Hapus kata kunci pencarian"
              title="Hapus pencarian"
            >
              ✕
            </button>
          )}
        </div>

        <p id="search-hint" className="sr-only">
          Ketik nama ras atau sub-ras anjing untuk menyaring hasil katalog secara langsung.
        </p>
      </form>

      <div className="search-tags-container" aria-label="Pencarian Cepat">
        <span className="search-tags-label">Populer:</span>
        <div className="search-tags-list">
          {popularKeywords.map((keyword) => {
            const isActive = value.toLowerCase() === keyword.toLowerCase();
            return (
              <button
                key={keyword}
                type="button"
                className={`search-tag-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleTagClick(keyword)}
                disabled={disabled}
                aria-pressed={isActive}
              >
                {isActive && <span className="tag-check" aria-hidden="true">✓ </span>}
                {keyword}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
