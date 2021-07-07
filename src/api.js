const fs = require('fs');
const path = require('path');
const {
    UnimplementedREPLError,
    UnselectedREPLError
} = require('./errors.js');

module.exports = (() => {
    let repl = null, functions = {};

    // Initialize REPLs from file
    const load = () => new Promise((resolve, reject) => {
        const scriptsPath = path.join(__dirname, 'scripts');

        fs.readdir(scriptsPath, (err, files) => {
            if (err) {
                reject(err);
            }

            // All functions will be stored here
            let functions = {};

            files.forEach(file => {
                try {
                    // This imports the scripts (Python, Ruby, C#...)
                    const absolute = path.join(scriptsPath, file);
                    if (!fs.lstatSync(absolute).isDirectory()) {
                        const handle = require(absolute);
                        functions = { ...functions, ...handle };
                    }
                } catch (ex) {
                    reject(ex);
                }
            });

            resolve(functions);
        });
    });

    // Select a REPL
    const select = r => {
        if (!functions[`${r}_repl_write`] || !functions[`${r}_repl_close`]) {
            throw new UnimplementedREPLError(r);
        } else {
            repl = r;
        }
    };

    // Execute a line with the previously selected REPL
    const execute = line => {
        if (repl) {
            return Promise.resolve(functions[`${repl}_repl_write`](`${line}\n`));
        } else {
            throw new UnselectedREPLError();
        }
    };

    // Finalize all REPLs
    const destroy = () => {
        Object.keys(functions).forEach(f => {
            if (f.endsWith('_repl_close')) {
                functions[f]();
            }
        });
    };

    return {
        initialize: async () => {
            functions = await load();
        },
        select,
        execute,
        available: () => {
            return Array.from(new Set(Object.keys(functions).map(f => f.split('_')[0])));
        },
        destroy
    };
})();

