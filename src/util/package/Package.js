import fs from "fs";
import path from "path";
import module from "module";
import {readJSONFile} from "../json/ReadJSONFile.js";
import ExportsResolver from "./ExportsResolver.js";
import {normalizePath} from "../Path.js";

const PACKAGE_PATH_REGEXP = /^((?:@[^/]+\/)[^/]+)(?:\/(.+))?$/;

export function getPackageRoot(fromPath) {
    if (fs.lstatSync(fromPath).isDirectory()) {
        const packageFile = path.resolve(fromPath, "package.json");
        if (fs.existsSync(packageFile)) {
            return normalizePath(packageFile);
        }
    }
    try {
        return normalizePath(path.dirname(module.findPackageJSON(fromPath)));
    } catch {
        console.log("can not find root", fromPath);
        return null;
    }
}

export function resolvePackageJSON(importPath, fromPath) {
    const [, packageName] = PACKAGE_PATH_REGEXP.exec(importPath);
    const root = getPackageRoot(fromPath);
    try {
        return normalizePath(module.findPackageJSON(packageName, root));
    } catch {
        console.log("can not find package", importPath);
        return null;
    }
}

export function resolvePackagePath(importPath, fromPath) {
    const packageJSON = resolvePackageJSON(importPath, fromPath);
    if (packageJSON) {
        return normalizePath(path.dirname(packageJSON));
    }
    return null;
}

export function readPackageConfig(importPath, fromPath) {
    const packageJSON = resolvePackageJSON(importPath, fromPath);
    if (packageJSON) {
        return readJSONFile(packageJSON);
    }
    return null;
}

export function resolvePackageName(importPath, fromPath) {
    return readPackageConfig(importPath, fromPath)?.name;
}

export function resolvePackageFilePath(importPath, fromPath) {
    const packageJSON = resolvePackageJSON(importPath, fromPath);
    if (packageJSON != null) {
        const packagePath = path.dirname(packageJSON);
        const packageConfig = readJSONFile(packageJSON);
        const exportsResolver = new ExportsResolver(packagePath);
        if ("exports" in packageConfig) {
            for (const [matcher, substitute] of Object.entries(packageConfig.exports)) {
                exportsResolver.addResolver(matcher, substitute);
            }
        }
        const [, , modulePath = ""] = PACKAGE_PATH_REGEXP.exec(importPath);
        const filePath = exportsResolver.resolvePath(modulePath);
        return normalizePath(path.resolve(packagePath, filePath));
    }
    return null;
}
