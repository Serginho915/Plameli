import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "node:path";

const rootDir = path.resolve(process.cwd(), "..");
loadEnvConfig(rootDir);

const isDev = process.env.NODE_ENV !== "production";
const isDockerRuntime = process.cwd() === "/app";
const devBackendPort = process.env.BACKEND_PORT || "8000";
const devFrontendPort = process.env.FRONTEND_PORT || "3000";
const devApiOrigin = isDockerRuntime ? "http://backend:8000" : `http://localhost:${devBackendPort}`;
const devApiUrl = `${devApiOrigin}/api`;
const devBrowserApiUrl = `http://localhost:${devBackendPort}/api`;
const devBaseUrl = `http://localhost:${devFrontendPort}`;
const prodBaseUrl = "https://ledgerlab.tech";

function resolveInternalOrigin() {
  const raw = process.env.INTERNAL_API_URL || "http://backend:8000/api";

  try {
    return new URL(raw).origin;
  } catch {
    return "http://backend:8000";
  }
}

if (isDev) {
  process.env.NEXT_PUBLIC_API_URL = devBrowserApiUrl;
  process.env.NEXT_PUBLIC_BASE_URL = devBaseUrl;
  process.env.INTERNAL_API_URL = devApiUrl;
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_API_URL: isDev
      ? devBrowserApiUrl
      : process.env.NEXT_PUBLIC_API_URL || `${prodBaseUrl}/api`,
    NEXT_PUBLIC_BASE_URL: isDev
      ? devBaseUrl
      : process.env.NEXT_PUBLIC_BASE_URL || prodBaseUrl,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY || "",
  },
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
  async rewrites() {
    if (!isDev) {
      return [
        {
          source: "/media/:path*",
          destination: `${resolveInternalOrigin()}/media/:path*`,
        },
      ];
    }

    return [
      {
        source: "/media/:path*",
        destination: `${devApiOrigin}/media/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${devApiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
