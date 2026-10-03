import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // Sin `sharp` en Workers: ver src/shared/lib/image-loader.ts
    loader: "custom",
    loaderFile: "./src/shared/lib/image-loader.ts",
  },
  async redirects() {
    return [
      // Destinos renombrados al cargar la información oficial (301)
      { source: "/destinos/laguna-de-neusa", destination: "/destinos/embalse-del-neusa", permanent: true },
      { source: "/destinos/mina-de-sal-nemocon", destination: "/destinos/mina-de-sal-de-nemocon", permanent: true },
      // Destinos retirados mientras se verifican (302: pueden volver)
      { source: "/destinos/lagunas-de-siecha", destination: "/explorar?municipio=guasca", permanent: false },
      { source: "/destinos/parque-y-templo-de-chia", destination: "/explorar?municipio=chia", permanent: false },
    ];
  },
};

export default nextConfig;

// Expone los bindings de Cloudflare (getCloudflareContext) durante `next dev`.
initOpenNextCloudflareForDev();
