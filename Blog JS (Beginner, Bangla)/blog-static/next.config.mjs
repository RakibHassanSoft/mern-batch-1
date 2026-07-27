/** @type {import('next').NextConfig} */
// ছবিগুলো picsum.photos থেকে আসে, তাই এই ডোমেইন allow করা হলো।
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
