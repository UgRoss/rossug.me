export const imageConfig = {
  avif: {
    lossless: false,
    quality: 85,
    speed: 5
  },
  jpeg: {
    mozjpeg: true,
    optimizeScans: true,
    progressive: true,
    quality: 85
  },
  // Enhanced image optimization settings
  limitInputPixels: 268402689, // ~16K x 16K pixels
  png: {
    adaptiveFiltering: true,
    compressionLevel: 9,
    progressive: true,
    quality: 85
  },
  webp: {
    lossless: false,
    nearLossless: true,
    quality: 85,
    smartSubsample: true
  }
}
