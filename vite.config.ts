import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/setupTests.ts",
        css: true,
        reporters: ["verbose"],
        coverage: {
            reporter: ["text", "json", "html"],
            include: ["src/**/*"],
            exclude: [],
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
        extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx"],
    },
    css: {
        modules: {
            localsConvention: "camelCase",
        },
    },
    server: {
        port: 3000,
    },
});
