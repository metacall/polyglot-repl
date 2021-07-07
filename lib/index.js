const {
    metacall_inspect,
    metacall_load_from_memory,
    metacall_load_from_file,
} = require('metacall');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// API: Initialize REPLs from each script
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

// API: Destroy the REPL
const finalize = functions => {
    Object.keys(functions).forEach(f => {
        if (f.endsWith('_repl_close')) {
            functions[f]();
        }
    });
};

// API: Execute the REPL
const execute = (repl, line, functions) => {
    if (repl) {
        Promise.resolve(functions[`${repl}_repl_write`](`${line}\n`)).then(console.log);
    } else {
        throw new Error('A REPL has not been selected yet.');
    }
};
