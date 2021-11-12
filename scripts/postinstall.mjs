// https://github.com/bytedance/bytemd/blob/483a2ab23ec49770c76858b675cefe7438061699/scripts/postinstall.mjs

// @ts-check
import fs from 'fs-extra'
import path from 'path'
import mustache from 'mustache'

// @ts-ignore
import _ from 'lodash'
import { rootDir } from './utils.mjs'

function readFileSyncSafe(p) {
    try {
        return fs.readFileSync(p, 'utf8')
    } catch (err) {
        return ''
    }
}

const packagesDir = path.join(rootDir, 'packages')
const packages = fs.readdirSync(packagesDir)
const plugins = packages.filter(
    (x) => x.startsWith('plugin-') && !x.includes('-transform')
)

// tsconfig root
fs.writeJsonSync(
    path.resolve(rootDir, 'tsconfig.json'),
    {
        files: [],
        references: packages.map((p) => {
            return { path: 'packages/' + p }
        }),
    },
    { spaces: 2 }
)

packages.forEach((p) => {
    // tsconfig
    let tsconfig = {
        extends: '../../tsconfig-base.json',
        include: ['src', 'src/**/*.json'], // https://github.com/microsoft/TypeScript/issues/25636#issuecomment-627111031
        compilerOptions: {
            composite: true,
            rootDir: 'src',
            outDir: 'lib',
        },
    }
    if (p !== 'svemd') {
        tsconfig.references = [{ path: '../svemd' }]
    }

    fs.writeJsonSync(path.join(packagesDir, p, 'tsconfig.json'), tsconfig, {
        spaces: 2,
    })

    // license
    fs.copyFileSync(
        path.join(rootDir, 'LICENSE'),
        path.join(packagesDir, p, 'LICENSE')
    )

    // package.json
    const pkgPath = path.join(packagesDir, p, 'package.json')
    const pkg = fs.readJsonSync(pkgPath)
    pkg.repository = {
        type: 'git',
        url: 'https://github.com/czfadmin/svemd.git',
        directory: `packages/${p}`,
    }
    pkg.main = 'dist/index.cjs.js'
    pkg.module = 'dist/index.esm.js'
    pkg.types = 'lib/index.d.ts'
    pkg.unpkg = 'dist/index.min.js'
    pkg.jsdelivr = 'dist/index.min.js'
    pkg.files = ['dist', 'lib']
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 })
})

// plugins readme
plugins.forEach((p) => {
    const name = p.split('-').slice(1).join('-')
    const result = mustache.render(
        readFileSyncSafe(path.join(rootDir, 'scripts/plugin-template.md')),
        {
            name,
            importedName: _.camelCase(name.replace('-ssr', '')),
            desc: fs.readJsonSync(path.join(packagesDir, p, 'package.json'))
                .description,
        }
    )
    fs.writeFileSync(path.join(packagesDir, p, 'README.md'), result)
})

// svemd readme
const readme = readFileSyncSafe(path.join(rootDir, 'README.md')).replace(
    /## Plugins\s+([\w\W])*?\s+##/,
    (match, p1, offset, string) => {
        const content = plugins
            .map((p) => {
                const pkg = fs.readJsonSync(
                    path.join(packagesDir, p, 'package.json')
                )
                if (pkg.private) return

                const name = p.split('-').slice(1).join('-')

                const desc = _.upperFirst(
                    pkg.description.replace('SveMD plugin to ', '')
                )
                return `| [@svemd/plugin-${name}](./packages/plugin-${name}) |  | ${desc} |`
            })
            .filter((x) => x)
            .join('\n')

        return `## Plugins

| Package | Status | Description |
| --- | --- | --- |
${content}

##`
    }
)

fs.writeFileSync(path.join(rootDir, 'README.md'), readme)
