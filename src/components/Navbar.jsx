import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo" aria-hidden="true">
            🐾
          </span>
          <div className="navbar-title-group">
            <span className="navbar-title">PawHaven</span>
            <span className="navbar-tagline">Dog CEO Breed Explorer</span>
          </div>
        </div>

        <nav className="navbar-nav" aria-label="Navigasi Utama">
          <ul className="nav-links">
            <li>
              <a href="#katalog-ras" className="nav-link active">
                Daftar Ras
              </a>
            </li>
            <li>
              <a
                href="https://dog.ceo/dog-api/"
                target="_blank"
                rel="noreferrer noopener"
                className="nav-link external-link"
              >
                Dokumentasi API ↗
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
