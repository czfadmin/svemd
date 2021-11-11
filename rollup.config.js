import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import path from "path";
import livereload from "rollup-plugin-livereload";
import css from "rollup-plugin-css-only";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json"
const pkgRoot = path.resolve(__dirname, "./packages");
const distRoot = path.resolve(__dirname, "./dist");

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require("child_process").spawn(
                "npm",
                ["run", "start", "--", "--dev"],
                {
                    stdio: ["ignore", "inherit", "inherit"],
                    shell: true,
                }
            );

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        },
    };
}

export default {
    input: path.join(pkgRoot, "svemd/src/index.ts"),
    output: {
        file: "public/dist/bundle.js",
        format: "iife",
        name: "app",
        sourcemap: true,
        dynamicsImportMeta: true,
    },
    plugins: [
        json(),
        svelte({
            preprocess: sveltePreprocess({ sourceMap: !production }),
            compilerOptions: {
                // enable run-time checks when not in production
                dev: !production,
            },
        }),

        // we'll extract any component CSS out into
        // a separate file - better for performance
        css({ output: "bundle.css" }),

        resolve({
            browser: true,
            dedupe: ["svelte"],
        }),
        commonjs(),
        babel({
            exclude: "node_modules/**",
            babelHelpers: "bundled",
        }),

        replace({
            exclude: "node_modules/**",
            ENV: JSON.stringify(process.env.NODE_ENV || "development"),
        }),

        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),

        !production && serve(),
        !production &&
            livereload({
                watch: path.join(__dirname, "public"),
                port: 4000,
            }),
        production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
};
