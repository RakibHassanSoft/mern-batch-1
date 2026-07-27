/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images loaded from picsum.photos (the sample image source).
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
