import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import fs from "node:fs";
import type { ServerOptions } from "https";

const developmentCertificateName = "/home/vscode/.aspnet/https/dotnetcert.pfx";
const httpsSettings: ServerOptions = fs.existsSync(developmentCertificateName)
  ? {
      pfx: fs.readFileSync(developmentCertificateName),
      passphrase: "",
    }
  : {};

  console.log(httpsSettings);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: httpsSettings,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});





