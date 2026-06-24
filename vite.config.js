import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "copy-pwa-static-files",
      closeBundle() {
        const dist = resolve("dist");
        const assets = resolve(dist, "assets");
        mkdirSync(assets, { recursive: true });
        copyFileSync(resolve("service-worker.js"), resolve(dist, "service-worker.js"));
        copyFileSync(resolve("assets/icon-192.svg"), resolve(assets, "icon-192.svg"));
        copyFileSync(resolve("assets/icon-512.svg"), resolve(assets, "icon-512.svg"));
      }
    }
  ]
});
