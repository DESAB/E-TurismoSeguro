import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Sin `sharp` en Workers: el loader delega el redimensionado al origen (CDN de Unsplash, etc.).
    loader: "custom",
    loaderFile: "./src/shared/lib/image-loader.ts",
  },
};

export default nextConfig;

// Expone los bindings de Cloudflare (getCloudflareContext) durante `next dev`.
initOpenNextCloudflareForDev();
