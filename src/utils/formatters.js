/**
 * Format nama ras anjing menjadi huruf kapital rapi pada setiap kata.
 * Menghilangkan pemisah strip/underscore dan mengubahnya menjadi spasi.
 * Contoh: "germanshepherd" -> "German Shepherd"
 *         "collie-border" -> "Border Collie"
 * 
 * @param {string} name - Nama ras dari API
 * @returns {string} Nama ras yang diformat
 */
export const formatBreedName = (name = '') => {
  if (!name || typeof name !== 'string') return '';

  return name
    .split(/[-_ ]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
