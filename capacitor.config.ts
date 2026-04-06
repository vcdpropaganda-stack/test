import { config as loadEnv } from "dotenv";
import type { CapacitorConfig } from "@capacitor/cli";

loadEnv({ path: ".env.local" });
loadEnv();

const serverUrl =
  process.env.CAPACITOR_SERVER_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
const usesCleartext = serverUrl?.startsWith("http://") ?? false;

const config: CapacitorConfig = {
  appId: "br.com.vlservice.app",
  appName: "VLservice",
  // This app relies on Next.js SSR and server actions, so Android should load
  // a reachable web instance instead of trying to bundle a static export.
  webDir: "capacitor-shell",
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: usesCleartext,
      }
    : undefined,
  android: {
    allowMixedContent: usesCleartext,
  },
};

export default config;
