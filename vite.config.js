import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    {
      name: "copy-pwa-static-files",
      closeBundle() {
        const dist = resolve("dist");
        const assets = resolve(dist, "assets");
        mkdirSync(assets, { recursive: true });
        copyFileSync(resolve("service-worker.js"), resolve(dist, "service-worker.js"));
        copyFileSync(resolve("assets/icon-192.svg"), resolve(assets, "icon-192.svg"));
        copyFileSync(resolve("assets/icon-512.svg"), resolve(assets, "icon-512.svg"));
        for (const file of readdirSync(assets)) {
          if (!file.endsWith(".webmanifest")) continue;
          const manifestPath = resolve(assets, file);
          const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
          manifest.start_url = "../index.html";
          manifest.scope = "../";
          manifest.icons = manifest.icons?.map((item) => ({
            ...item,
            src: item.src?.split("/").pop() ?? item.src
          }));
          writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
        }
      }
    }
  ]
});
