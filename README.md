# [MetaCall](https://github.com/metacall/core/) Polyglot REPL

![image](assets/terminal.gif)

## Description

This repository implements a Polyglot REPL which shares the state of the meta-object protocol between the REPLs. Using the Polyglot REPL, you can share state between multiple languages through their individual REPL and mix code straight from your terminal.

The high-level `api.js` provided in the `src` provide five functions:
- `initialize`: To initialize the Polyglot REPL
- `select`: To select the individual language REPL; Currently Python (py) and JavaScript (node) are supported.
- `execute`: To execute a line, function or module after a REPL has been selected.
- `destroy`: Destroy the REPL and exit gracefully.
- `available`: Check all the available REPLs.

The `cli.js` provided in the `src` provides a way to develop your own REPLs and execute code straight from the command line. You can sutomize the existing REPL or define a new one.

The entry script `index.js` provides an abstraction over the usage of the high-level APIs defined above through the following commands:

```
  %repl <tag>: Switch from different REPL (available tags: node py)
  %inspect: Show available functions
  %available: Show available REPLs
  %eval <tag> <code>: Load inline code, useful for loading inter-language functions for the REPL
  %load <tag> <file_0> <file_1> ... <file_N>: Load a file, useful for loading inter-language functions for the REPL
  %exit: Finalizes the REPL
```

## Installation

1) Install MetaCall:
    ```sh
    curl -sL https://raw.githubusercontent.com/metacall/install/master/install.sh | sh
    ```

2) For running it:
    ```sh
    metacall index.js
    ```

## LICENSE

[Apache 2.0](LICENSE)
