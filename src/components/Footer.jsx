import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand-section">
          <div className="footer-brand-header">
            <span className="footer-logo" aria-hidden="true">
              🐶
            </span>
            <span className="footer-title">PawHaven</span>
          </div>
          <p className="footer-description">
            Katalog eksplorasi seluruh ras anjing di dunia dengan data dan galeri
            gambar resmi dari API publik.
          </p>
        </div>

        <div className="footer-meta-section">
          <h4 className="footer-heading">Informasi Proyek</h4>
          <p className="footer-meta-text">
            Tugas Praktikum Perancangan & Pemrograman Web (COTS 1)
          </p>
          <p className="footer-meta-text">
            Sumber Data:{' '}
            <a
              href="https://dog.ceo/dog-api/"
              target="_blank"
              rel="noreferrer noopener"
              className="footer-link"
            >
              Dog CEO REST API
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; {currentYear} PawHaven. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
