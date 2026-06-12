import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
      { protocol: "https", hostname: "ledgerlab.tech" },
      { protocol: "https", hostname: "www.ledgerlab.tech" },
      { protocol: "https", hostname: "plameli.com" },
      { protocol: "https", hostname: "www.plameli.com" },
    ],
  },
};

export default nextConfig;
