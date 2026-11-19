import path  from "path";

export function toUnixPath(input) {
    return input.replace(/\\/g, "/");
}

export function normalizePath(input) {
    input = input
        .replace(/^^\\\\\?\\UNC\\/, "\\\\")
        .replace(/^(file:\/\/\/|\\\\\?\\)/, "");
    return toUnixPath(path.normalize(input));
}
