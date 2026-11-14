import fs from "fs";
import path from "path";

const __dirname = path.resolve();

const OPTIONS = {flags: "a+"};

export default class LogFile {

    #stream;

    constructor(fileName, options) {
        const dirName = path.dirname(`${__dirname}/${fileName}`);
        if (!fs.existsSync(dirName)) {
            fs.mkdirSync(dirName, {recursive: true});
        } else {
            const {keep} = options;
            if (typeof keep === "number" && keep > 0) {
                const files = fs.readdirSync(dirName);
                files.sort();
                while (files.length >= keep) {
                    const fileToDelete = files.shift();
                    console.log(`delete log file "${fileToDelete}" (keep = ${keep})`);
                    fs.unlinkSync(`${dirName}/${fileToDelete}`);
                }
            }
        }
        this.#stream = fs.createWriteStream(fileName, OPTIONS);
        this.#stream.on("error", function(e) {
            console.error(e);
        });
    }

    log(message) {
        if (this.#stream != null) {
            this.#stream.write(message);
        } else {
            console.error("LogFile is already closed");
        }
    }

    end(message) {
        if (this.#stream != null) {
            this.#stream.end(message);
            this.#stream = null;
        } else {
            console.error("LogFile is already closed");
        }
    }

}
