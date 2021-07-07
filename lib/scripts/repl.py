from io import StringIO
import sys
from code import InteractiveConsole

interp = InteractiveConsole()

class Capturing(list):
    def __enter__(self):
        self._stdout = sys.stdout
        sys.stdout = self._stringio = StringIO()
        return self
    def __exit__(self, *args):
        self.extend(self._stringio.getvalue().splitlines())
        del self._stringio
        sys.stdout = self._stdout

def py_repl_write(str):
    with Capturing() as output:
        interp.push(str)
    return '\n'.join(output)

def py_repl_close():
    pass