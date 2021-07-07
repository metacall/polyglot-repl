const {
    select,
    available,
    destroy
} = require('./src/api.js');
const cli = require('./src/cli.js');
const {
    metacall_inspect,
    metacall_load_from_memory,
    metacall_load_from_file,
} = require('metacall');

module.exports = (async () => {
    const cmdPrefix = '%';

    // Error handling
    const handleError = ex => {
        const error = ({
            UnrecognizedCommandError: () => `${ex.message}, type ${cmdPrefix}help for more info.`,
            UnimplementedREPLError: () => `${ex.message}.`,
            UnselectedREPLError: () => `${ex.message} by using ${cmdPrefix}repl <tag>, i.e: ${cmdPrefix}repl py, ${cmdPrefix}repl node.`
        })[ex.name]() || ex.message;

        console.error(error);
    };

    // List of commands
    const commands = {
        repl: (...args) => {
            try {
                select(args[0]);
            } catch (ex) {
                handleError(ex);
            }
        },
        inspect: (...args) => {
            console.log(JSON.stringify(metacall_inspect(), null, 2));
        },
        available: (...args) => {
            console.log(`Available REPLs: ${available().join(' ')}`);
        },
        eval: (...args) => {
            metacall_load_from_memory(args[0], args.slice(1).join(' '));
        },
        load: (...args) => {
            metacall_load_from_file(args[0], [...args.slice(1)]);
        },
        help: (...args) => {
            console.log('Available commands:');
            console.log(`  ${cmdPrefix}repl <tag>: Switch from different REPL (available tags: ${available().join(' ')})`);
            console.log(`  ${cmdPrefix}inspect: Show available functions`);
            console.log(`  ${cmdPrefix}available: Show available REPLs`);
            console.log(`  ${cmdPrefix}eval <tag> <code>: Load inline code, useful for loading inter-language functions for the REPL`);
            console.log(`  ${cmdPrefix}load <tag> <file_0> <file_1> ... <file_N>: Load a file, useful for loading inter-language functions for the REPL`);
            console.log(`  ${cmdPrefix}exit: Finalizes the REPL`);
        },
        exit: (...args) => {
            destroy();
            process.exit(0); // TODO: This is temporal, due to a bug in metacall related to async handles
        }
    };

    // Execute the top module REPL
    await cli(cmdPrefix, commands, console.log, handleError);
})();
