from io import StringIO
import sys
from code import InteractiveConsole

interp = InteractiveConsole()


class Capturing(list):
    def __enter__(self):
        """Enter the runtime context related to the object."""
        self._stdout = sys.stdout
        sys.stdout = self._stringio = StringIO()
        return self

    def __exit__(self, *args):
        """Exit the runtime context related to the object."""
        self.extend(self._stringio.getvalue().splitlines())
        del self._stringio
        sys.stdout = self._stdout


def py_repl_write(str):
    """
    Function to capture the REPL input and return the output.
    Parameters:
        str: Input passed in to the REPL
    """
    with Capturing() as output:
        interp.push(str)
    return "\n".join(output)


def py_repl_close():
    """Function to close the REPL"""
    pass

