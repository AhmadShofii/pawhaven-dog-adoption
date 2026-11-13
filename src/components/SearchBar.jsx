import './SearchBar.css';

const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Anjing yang mana? Misalnya husky',
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
        <label htmlFor="breed-search-input" className="sr-only">
          Cari ras anjing
        </label>

        <div className={`search-input-wrapper ${disabled ? 'disabled' : ''}`}>
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
      </form>

      <div className="search-tags-container" aria-label="Pencarian Cepat">
        <span className="search-tags-label">Sering dicari:</span>
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
