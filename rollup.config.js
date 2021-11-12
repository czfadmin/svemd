import fs from 'fs-extra'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'
import path from 'path'
import _ from 'lodash'
import vue from 'rollup-plugin-vue'
import json from '@rollup/plugin-json'
import css from 'rollup-plugin-css-only'

const production = !process.env.ROLLUP_WATCH
const umd = process.env.UMD
const packages = fs.readdirSync(path.resolve(__dirname, 'packages'))

const configs = packages
    .map((key) => {
        const pkg = fs.readJsonSync(`./packages/${key}/package.json`)
        if (pkg.private) return []
        const inputFile = path.resolve('packages', key, 'lib/index.js')
        const umdName = key.startsWith('plugin-')
            ? _.camelCase(`svemd-${key}`)
            : 'svemd'
        /** @type {import('rollup').RollupOptions} */
        const common = {
            input: inputFile,
            plugins: [
                commonjs(),
                svelte({
                    compilerOptions: {
                        dev: !production,
                    },
                }),
                !key.startsWith('plugin-') && css({ output: 'bundle.css' }),
                vue(),
                resolve({
                    browser: true,
                    dedupe: ['svelte'],
                }),
                json(),
                replace({
                    preventAssignment: true, // fix warning
                    'process.env.NODE_ENV': JSON.stringify(
                        production ? 'production' : 'development'
                    ),
                }),
            ],
            watch: {
                clearScreen: false,
            },
        }

        /** @type {import('rollup').RollupOptions} */
        const config = {
            ...common,
            output: [
                {
                    format: 'es',
                    sourcemap: true,
                    file: path.resolve('packages', key, pkg.module),
                },
                {
                    format: 'cjs',
                    sourcemap: true,
                    file: path.resolve('packages', key, pkg.main),
                    exports: 'auto', // fix warning
                },
            ],
            external: [
                /^codemirror-ssr/,
                'hast-util-sanitize/lib/github.json',
                ...Object.keys(pkg.dependencies || {}),
                ...Object.keys(pkg.peerDependencies || {}),
            ],
        }

        /** @type {import('rollup').OutputOptions} */
        const umdOutputOption = {
            format: 'umd',
            name: umdName,
            sourcemap: true,
            inlineDynamicImports: true,
        }

        /** @type {import('rollup').RollupOptions} */
        const umdConfig = {
            ...common,
            output: [
                {
                    ...umdOutputOption,
                    file: path.resolve('packages', key, 'dist/index.js'),
                },
                {
                    ...umdOutputOption,
                    file: path.resolve('packages', key, 'dist/index.min.js'),
                    plugins: [terser()],
                },
            ],
            external: Object.keys(pkg.peerDependencies || {}),
        }

        /** @type {import('rollup').RollupOptions} */
        const es5Config = {
            ...common,
            input: path.resolve('packages', key, 'lib/index.js'),
            output: [
                {
                    ...umdOutputOption,
                    file: path.resolve('packages', key, 'dist/index.es5.js'),
                },
                {
                    ...umdOutputOption,
                    file: path.resolve(
                        'packages',
                        key,
                        'dist/index.es5.min.js'
                    ),
                    plugins: [terser()],
                },
            ],
            plugins: [
                ...common.plugins,
                babel({
                    babelHelpers: 'runtime',
                    extensions: ['.js', '.mjs', '.html', '.svelte'],
                }),
            ],
        }
        // return [es5Config];

        if (umd) {
            return [config, umdConfig, es5Config]
        } else {
            return [config]
        }
    })
    .flat()

// function serve() {
//     let server

//     function toExit() {
//         if (server) server.kill(0)
//     }

//     return {
//         writeBundle() {
//             if (server) return
//             server = require('child_process').spawn(
//                 'npm',
//                 ['run', 'start', '--', '--dev'],
//                 {
//                     stdio: ['ignore', 'inherit', 'inherit'],
//                     shell: true,
//                 }
//             )

//             process.on('SIGTERM', toExit)
//             process.on('exit', toExit)
//         },
//     }
// }

// /** @type {import('rollup').RollupOptions} */
// const styleCommon = {
//   input: 'packages/bytemd/styles/index.scss',
//   output: {
//     file: 'style.js', // We don't need this file
//   },
// }

// /** @type {import('rollup').RollupOptions[]} */
// const styleConfigs = [
//   {
//     ...styleCommon,
//     plugins: [
//       postcss({
//         extract: path.resolve(__dirname, 'packages/bytemd/dist/index.css'),
//       }),
//     ],
//   },
//   {
//     ...styleCommon,
//     plugins: [
//       postcss({
//         extract: path.resolve(__dirname, 'packages/bytemd/dist/index.min.css'),
//         minimize: true,
//       }),
//     ],
//   },
// ]

export default [...configs]
