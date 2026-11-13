import './EmptyState.css';

const EmptyState = ({
  searchQuery = '',
  onReset,
  title = 'Tidak Ada Ras Anjing yang Cocok',
  message,
}) => {
  const displayQuery = searchQuery.trim();

  return (
    <section
      className="empty-state-container"
      role="status"
      aria-live="polite"
      aria-label="Pemberitahuan data kosong"
    >
      <div className="empty-state-icon-wrapper" aria-hidden="true">
        <span className="empty-state-icon">🐕🔍</span>
      </div>

      <h2 className="empty-state-title">{title}</h2>

      <p className="empty-state-description">
        {message ? (
          message
        ) : displayQuery ? (
          <>
            Tidak ditemukan ras anjing dengan kata kunci{' '}
            <strong className="empty-highlight">"{displayQuery}"</strong>.
          </>
        ) : (
          'Saat ini belum ada data ras anjing yang dapat ditampilkan.'
        )}
      </p>

      <div className="empty-state-tips">
        <h4 className="empty-tips-title">💡 Tips Pencarian:</h4>
        <ul className="empty-tips-list">
          <li>Pastikan ejaan nama ras sudah sesuai.</li>
          <li>
            Gunakan nama ras dalam bahasa Inggris (misalnya:{' '}
            <em>retriever</em>, <em>hound</em>, <em>husky</em>, atau <em>corgi</em>).
          </li>
          <li>Coba gunakan kata kunci yang lebih singkat atau umum.</li>
        </ul>
      </div>

      {typeof onReset === 'function' && (
        <button
          type="button"
          className="empty-state-action-btn"
          onClick={onReset}
          aria-label="Reset pencarian dan tampilkan semua ras anjing"
        >
          <span aria-hidden="true">🔄</span> Tampilkan Semua Ras Anjing
        </button>
      )}
    </section>
  );
};

export default EmptyState;
