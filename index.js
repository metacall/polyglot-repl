const {
    metacall_inspect,
    metacall_load_from_memory,
    metacall_load_from_file,
} = require('metacall');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

// Finalize all REPLs
const finalize = functions => {
    Object.keys(functions).forEach(f => {
        if (f.endsWith('_repl_close')) {
            functions[f]();
        }
    });
};

module.exports = (async () => {
    // Load scripts and start the REPL
    try {
        const functions = await load();
        let repl = null;

        var iface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        iface.on('line', line => {
            if (line.startsWith('%%')) {
                const commands = {
                    repl: (...args) => {
                        repl = args[0];
                    },
                    inspect: (...args) => {
                        console.log(JSON.stringify(metacall_inspect(), null, 2));
                    },
                    eval: (...args) => {
                        metacall_load_from_memory(args[0], args.slice(1).join(' '));
                    },
                    load: (...args) => {
                        metacall_load_from_file(args[0], [...args.slice(1)]);
                    },
                    help: (...args) => {
                        console.log('Available commands:');
                        console.log('  %%repl <tag>: Switch from different REPL (available tags: node, py, rb)');
                        console.log('  %%inspect: Show available functions');
                        console.log('  %%eval <tag> <code>: Load inline code, useful for loading inter-language functions for the REPL');
                        console.log('  %%load <tag> <file_0> <file_1> ... <file_N>: Load a file, useful for loading inter-language functions for the REPL');
                        console.log('  %%exit: Finalizes the REPL');
                    },
                    exit: (...args) => {
                        finalize(functions);
                        process.exit(0); // TODO: This is temporal, due to a bug in metacall related to async handles
                    }
                };

                const tokens = line.split(' ');
                const command = tokens[0].split('%%')[1];

                if (commands[command]) {
                    commands[command](...tokens.slice(1));
                } else {
                    console.error(`The command '${command}' is not recognized, type %%help for more info.`);
                }
            } else {
                if (repl) {
                    Promise.resolve(functions[`${repl}_repl_write`](`${line}\n`)).then(console.log);
                } else {
                    console.error('Select first a REPL by using %%repl <tag>, i.e: %%repl py, %%repl node.');
                }
            }
        });
    } catch (ex) {
        console.error(ex);
    }
})();
