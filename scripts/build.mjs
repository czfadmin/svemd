// import path from "path";
// import fs from "fs";
// import * as rollup from "rollup";
// import json from "@rollup/plugin-json";
// import commonjs from "@rollup/plugin-commonjs";
// import resolve from "@rollup/plugin-node-resolve";
// import replace from "@rollup/plugin-replace";
// import { terser } from "rollup-plugin-terser";
// import svelte from "rollup-plugin-svelte";
// import css from "rollup-plugin-css-only";
// import sveltePreprocess from "svelte-preprocess";
// import typescript from "@rollup/plugin-typescript";



// const production = process.env.NODE_ENV !== "development";
// const baseRollupConfig = {
//     output: {
//         sourcemap: production ? false : true,
//         inlineDynamicImports: true,
//     },
//     plugins: [json()],
// };

// async function buildPkgCore() {
//     const svemdCorePath = path.resolve(pkgRootPath, "svemd");
//     console.log(svemdCorePath);
//     const rollupConfig = {
//         input: path.resolve(svemdCorePath, "src/index.ts"),
//         ...baseRollupConfig,
//         output: {
//             ...baseRollupConfig.output,
//             name: "app",
//             file: path.resolve(svemdCorePath, "dist/index.js"),
//         },
//         plugins: [
//             ...baseRollupConfig.plugins,
//             svelte({
//                 preprocess: sveltePreprocess({ sourceMap: !production }),
//                 compilerOptions: {
//                     // enable run-time checks when not in production
//                     dev: !production,
//                 },
//             }),

//             // we'll extract any component CSS out into
//             // a separate file - better for performance
//             css({ output: "bundle.css" }),

//             resolve({
//                 browser: true,
//                 dedupe: ["svelte"],
//                 preventAssignment: true,
//             }),

//             commonjs(),

//             replace({
//                 exclude: "node_modules/**",
//                 ENV: JSON.stringify(process.env.NODE_ENV || "development"),
//             }),

//             typescript({
//                 tsconfig: path.resolve(svemdCorePath, "tsconfig.json"),
//                 sourceMap: !production,
//                 inlineSources: !production,
//             }),
//             terser(),
//         ],
//     };
//     const bundle = await rollup.rollup(rollupConfig);
//     await bundle.write(rollupConfig.output);
// }

// async function buildPluginsPkg() {
//     const plugins = fs.readdirSync(pluginsPath);
//     plugins.forEach(async (plugin) => {
//         const pluginPath = path.resolve(pluginsPath, plugin);
//         const rollupConfig = {
//             input: path.resolve(pluginPath, `src/index.ts`),
//             ...baseRollupConfig,
//             output: {
//                 ...baseRollupConfig.output,
//                 file: path.resolve(pluginPath, "dist/index.js"),
//             },
//             plugins: [
//                 ...baseRollupConfig.plugins,

//                 resolve({
//                     browser: true,
//                     preventAssignment: true,
//                 }),

//                 commonjs(),

//                 replace({
//                     exclude: "node_modules/**",
//                     ENV: JSON.stringify(process.env.NODE_ENV || "development"),
//                 }),

//                 typescript({
//                     tsconfig: path.resolve(
//                         pluginsPath,
//                         `${plugin}/tsconfig.json`
//                     ),
//                     sourceMap: false,
//                     inlineSources: false,
//                 }),
//             ],
//         };
//         const bundle = await rollup.rollup(rollupConfig);
//         await bundle.write(rollupConfig.output);
//     });
// }

// (async () => {
//     await buildPkgCore();
//     await buildPluginsPkg();
// })();
