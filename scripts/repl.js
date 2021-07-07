const repl = require('repl');
const {
	Readable,
	Writable
} = require('stream');
let promise, promiseResolve, promiseReject;

const r = repl.start({
    writer: output => {
        if (promiseResolve) {
            promiseResolve(output);
        }
        return output;
    },
    input: new Readable({
        read(size) {
            setImmediate(() => this.push(null));
        }
    }),
    output: new Writable({
        write(chunk, encoding, callback) {
            setImmediate(callback);
        }
    })
});

module.exports = {
    node_repl_write: async (str) => {
        promise = new Promise((resolve, reject) => {
            promiseResolve = resolve;
            promiseReject = reject;
        });
        r.write(str);
        return await promise;
    },
    node_repl_close: () => {
        return r.close();
    }
};
