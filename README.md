# [MetaCall](https://github.com/metacall/core/) Polyglot REPL

This repository implements a polyglot REPL which shares the state of the meta-object protocol between the REPLs.

## Run it

1) Install MetaCall:
    ```sh
    curl -sL https://raw.githubusercontent.com/metacall/install/master/install.sh | sh
    ```

2) In a terminal, run:
    ```sh
    metacall index.js
    ```

3) For testing it:
    ```sh
    %%help
    %%load py test/test.py
    %%inspect
    %%repl py
    print("hello world from python")
    a = 4
    %%repl node
    const e = 234
    %%repl py
    print(a) # This will share the state with previous execution of the Python REPL (4)
    %%repl node
    console.log(e) // This will share the state with previous execution of the Node REPL (234) 
    require('metacall').metacall('a') // This will invoke the function a loaded from test/test.py
    %%exit
    ```
