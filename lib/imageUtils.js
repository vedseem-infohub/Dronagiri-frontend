/**
 * Optimizes image URLs on-the-fly, particularly Cloudinary URLs,
 * to deliver modern WebP/AVIF formats, automatic compression, and responsive widths.
 * Reduces 1.5MB+ raw PNGs down to ~40KB WebP files.
 *
 * @param {string} url - Original image URL
 * @param {object} options
 * @param {number} [options.width=600] - Target width in pixels
 * @param {string} [options.quality="auto"] - Compression quality ('auto', 'eco', etc.)
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(url, { width = 600, quality = "auto" } = {}) {
  if (!url || typeof url !== "string") return "";

  // Cloudinary image transformation
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    // If it already has transformation params, return as is
    if (url.includes("/f_auto") || url.includes("f_auto,") || url.includes("/q_auto")) {
      return url;
    }

    // Insert transformations right after /upload/
    const transformation = `f_auto,q_${quality},w_${width}/`;
    return url.replace("/upload/", `/upload/${transformation}`);
  }

  return url;
}
