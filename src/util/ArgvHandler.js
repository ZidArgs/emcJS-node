const ARGV = new Map();

const ArgvHandler = {
    parse(argv) {
        for (const arg of argv) {
            const [key, value] = arg.split("=");
            ARGV.set(key, value ?? true);
        }
    },
    get(key) {
        return ARGV.get(key)
    }
};

export default ArgvHandler;
