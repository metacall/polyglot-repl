const {
    initialize,
    select,
    execute,
    destroy
} = require('./api.js');
const {
    UnrecognizedCommandError
} = require('./errors.js');
const readline = require('readline');

module.exports = (async (cmdPrefix = '%', commands, resultCb, errorCb) => {
    await initialize();

    var iface = readline.createInterface({
        prompt: '',
        input: process.stdin,
        output: process.stdout
    });

    console.log(`Select first a REPL by using ${cmdPrefix}repl <tag>, i.e: ${cmdPrefix}repl py, ${cmdPrefix}repl node.`);
    iface.prompt();

    iface.on('line', line => {
        if (line.startsWith(cmdPrefix)) {
            const tokens = line.split(' ');
            const command = tokens[0].split(cmdPrefix)[1];
            if (commands[command]) {
                commands[command](...tokens.slice(1));
            } else {
                errorCb(new UnrecognizedCommandError(command));
            }
        } else {
            try {
                execute(line).then(resultCb);
            } catch (ex) {
                errorCb(ex);
            }
        }
    });
});
