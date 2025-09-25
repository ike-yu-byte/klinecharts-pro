/// <reference types="vite/client" />

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import path from "path";

// solidPlugin: Vite 的 Solid.js 插件，用于处理 Solid.js 特有的语法（如 JSX 转换、响应式语法编译等），是 Solid 项目必备插件。
const lifeCycle = process.env.npm_lifecycle_event;
const isH5 = lifeCycle?.includes("h5") ? true : false;
const libConfig = {
  build: {
    cssTarget: "chrome61",
    sourcemap: true,
    rollupOptions: {
      external: ["klinecharts"], // 声明 klinecharts 为外部依赖，打包时不会将其包含到最终产物中。
      output: {
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.name === "style.css") {
            return "klinecharts-pro.css";
          }
        },
        globals: {
          klinecharts: "klinecharts", // 仅在 UMD 模块格式下生效，指定外部依赖 klinecharts 在全局环境中的变量名
        },
      },
    },
    lib: {
      // 构件库模式
      entry: "./src/index.ts",
      name: "klinechartspro", // 库的全局变量名称（UMD 模式下使用）

      formats: ["es", "umd", "cjs", "iife"] as any,
      fileName: (format) => {
        if (format === "es") {
          return "klinecharts-pro.js";
        }
        if (format === "umd") {
          return "klinecharts-pro.umd.js";
        }
        if (format === "cjs") {
          return "klinecharts-pro.cjs.js";
        }
        if (format === "iife") {
          return "klinecharts-pro.iife.js";
        }
      },
    },
    terserOptions: {
      // 自定义 Terser 压缩规则
      compress: {
        drop_console: true, // 移除所有 console.log（可选）
        drop_debugger: true, // 移除 debugger 语句（可选）
      },
      mangle: {
        toplevel: true, // 混淆全局变量名（包括你配置的 build.lib.name，慎用！）
        properties: {
          regex: /^_/, // 混淆以 _ 开头的私有 API（避免影响公开 API，推荐）
        },
      },
    },
  },
};

const h5Config = {
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "./index.html"), // 自定义单个 HTML 入口
    },
  },
};

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    host: true,
  },
  ...(isH5 ? h5Config : libConfig),
});
