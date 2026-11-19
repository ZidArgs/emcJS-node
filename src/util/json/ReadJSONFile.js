import fs from "fs";
import {safeParseJSON} from "@emcjs/core/util/json/JSON.js";

export function readJSONFile(filePath) {
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath).toString();
        return safeParseJSON(fileContent);
    }
    return null;
}
