class UnrecognizedCommandError extends Error {
    constructor(command) {
        super(`The command '${command}' is not recognized`);
        this.name = 'UnrecognizedCommandError';
    }
}

class UnimplementedREPLError extends Error {
    constructor(repl) {
        super(`The REPL '${repl}' is not implemented or not loaded`);
        this.name = 'UnimplementedREPLError';
    }
}

class UnselectedREPLError extends Error {
    constructor() {
        super('Select first a REPL');
        this.name = 'UnselectedREPLError';
    }
}

module.exports = {
    UnrecognizedCommandError,
    UnimplementedREPLError,
    UnselectedREPLError
};
