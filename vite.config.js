import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      "422a-102-140-196-11.ngrok-free.app",
      "966d-41-212-115-191.ngrok-free.app",
      "8090-41-212-115-191.ngrok-free.app",
      "localhost:3030",
    ],
  },
  preview: {
    allowedHosts: ["riri-cars.onrender.com"],
  },
});
