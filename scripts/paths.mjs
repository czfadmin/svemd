import path from 'path'
const rootPath = path.resolve(path.dirname('.'), ".");
const pkgRootPath = path.resolve(rootPath, "packages/");
const pluginsPath = path.resolve(pkgRootPath, "plugins/");
export {
    pkgRootPath,
    pluginsPath,
    rootPath,
}