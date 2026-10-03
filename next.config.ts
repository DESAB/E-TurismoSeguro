import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Expone los bindings de Cloudflare (getCloudflareContext) durante `next dev`.
initOpenNextCloudflareForDev();
