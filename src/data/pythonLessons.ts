export type Question = {
  question: string;
  options: string[];
  answer: number; // index of correct option
  explanation: string;
};

export type LessonExample = {
  title: string;
  explanation: string;
  code: string;
  expectedOutput?: string;
  language?: string;
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  content: string;
  code: string;
  language: string;
  expectedOutput: string;
  tips: string[];
  questions: Question[];
  examples?: LessonExample[];
  advancedQuestions?: Question[];
};

export type Topic = {
  id: string;
  title: string;
  icon: string;
  color: string;
  lessons: Lesson[];
};

export const pythonTopics: Topic[] = [
  // ─────────────────────────────────────────────
  // 1. Python Basics
  // ─────────────────────────────────────────────
  {
    id: "py-basics",
    title: "Python Basics",
    icon: "🐍",
    color: "hsl(var(--syntax-function))",
    lessons: [
      {
        id: "py-hello",
        title: "Hello World & print()",
        description: "Learn how to print output in Python.",
        content: `In Python, \`print()\` displays output to the console.\n\nYou can print strings (text in quotes), numbers, and even multiple values separated by commas.\n\n\`print()\` adds a newline at the end by default. Use \`end=""\` to change that.\n\nYou can also use \`sep\` to change the separator between multiple arguments.`,
        code: `# Your first Python program\nprint("Hello, World!")\n\n# Printing multiple values\nprint("Name:", "Alice", "Age:", 25)\n\n# Using end parameter\nprint("Loading", end="")\nprint("...")\n\n# Using sep parameter\nprint("2025", "03", "07", sep="-")`,
        language: "Python",
        expectedOutput: `Hello, World!\nName: Alice Age: 25\nLoading...\n2025-03-07`,
        tips: [
          "Strings can use single or double quotes",
          "print() with no arguments prints a blank line",
          "Use end='' to prevent newline",
          "Use sep to change the separator between values",
        ],
        questions: [
          { question: "What does print() do in Python?", options: ["Reads input", "Displays output to the console", "Stores a value", "Creates a variable"], answer: 1, explanation: "print() is used to display output to the standard output (console)." },
          { question: "What is the default end character of print()?", options: ["Space", "Tab", "Newline (\\n)", "Nothing"], answer: 2, explanation: "By default, print() ends with a newline character." },
          { question: "How do you print 'Hello' and 'World' separated by a dash?", options: ["print('Hello-World')", "print('Hello', 'World', sep='-')", "print('Hello' - 'World')", "print('Hello', dash, 'World')"], answer: 1, explanation: "The sep parameter changes the separator between multiple arguments." },
          { question: "Which is a valid Python print statement?", options: ["echo 'Hello'", "System.out.println('Hello')", "print('Hello')", "console.log('Hello')"], answer: 2, explanation: "Python uses print() function to display output." },
          { question: "What does print('A', 'B', 'C', end='!') output?", options: ["A B C!", "A B C\\n!", "ABC!", "A, B, C!"], answer: 0, explanation: "print joins with space by default, and end='!' replaces the newline." },
        ],
      },
      {
        id: "py-variables",
        title: "Variables & Assignment",
        description: "Store and use data with variables.",
        content: `Variables are names that refer to values in memory. In Python, you create a variable by assigning a value with \`=\`.\n\nPython is **dynamically typed** — you don't declare types. The type is determined by the assigned value.\n\nVariable names must start with a letter or underscore, are case-sensitive, and cannot be Python keywords.\n\nYou can do **multiple assignment** and **swapping** in one line.`,
        code: `# Variable assignment\nname = "Alice"\nage = 25\nheight = 5.6\nis_student = True\n\nprint(type(name))    # <class 'str'>\nprint(type(age))     # <class 'int'>\n\n# Multiple assignment\nx, y, z = 1, 2, 3\nprint(x, y, z)\n\n# Swapping\na, b = 10, 20\na, b = b, a\nprint("After swap:", a, b)`,
        language: "Python",
        expectedOutput: `<class 'str'>\n<class 'int'>\n1 2 3\nAfter swap: 20 10`,
        tips: [
          "Python is dynamically typed — no need for type declarations",
          "Use snake_case for variable names",
          "type() returns the type of a value",
          "You can swap variables in one line: a, b = b, a",
        ],
        questions: [
          { question: "Which is a valid Python variable name?", options: ["2name", "my-var", "_count", "class"], answer: 2, explanation: "Variable names can start with underscore. They cannot start with digits, contain hyphens, or be keywords like 'class'." },
          { question: "What is the type of x after x = 3.14?", options: ["int", "str", "float", "double"], answer: 2, explanation: "3.14 is a floating-point number, so x is of type float." },
          { question: "What does x, y = 5, 10 do?", options: ["Creates a tuple", "Assigns 5 to x and 10 to y", "Causes an error", "Assigns 10 to both"], answer: 1, explanation: "This is multiple assignment — x gets 5, y gets 10." },
          { question: "Are Python variable names case-sensitive?", options: ["Yes", "No", "Only for strings", "Only in Python 3"], answer: 0, explanation: "name and Name are different variables in Python." },
          { question: "What does type(42) return?", options: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'number'>"], answer: 1, explanation: "42 is an integer, so type() returns <class 'int'>." },
        ],
      },
      {
        id: "py-datatypes",
        title: "Data Types",
        description: "Understand Python's built-in data types.",
        content: `Python has several built-in data types:\n\n- **int** — whole numbers: 42, -7\n- **float** — decimal numbers: 3.14, -0.5\n- **str** — text: "hello"\n- **bool** — True or False\n- **NoneType** — None (absence of value)\n- **complex** — complex numbers: 3+4j\n\nUse \`type()\` to check a type and \`isinstance()\` to test if a value is of a specific type.\n\nYou can convert between types using \`int()\`, \`float()\`, \`str()\`, \`bool()\`.`,
        code: `# Data types\nprint(type(42))         # int\nprint(type(3.14))       # float\nprint(type("hello"))    # str\nprint(type(True))       # bool\nprint(type(None))       # NoneType\nprint(type(3+4j))       # complex\n\n# Type conversion\nprint(int("42"))        # 42\nprint(float(10))        # 10.0\nprint(str(100))         # "100"\nprint(bool(0))          # False\nprint(bool(1))          # True\nprint(bool(""))         # False\nprint(bool("hi"))       # True`,
        language: "Python",
        expectedOutput: `<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>\n<class 'NoneType'>\n<class 'complex'>\n42\n10.0\n100\nFalse\nTrue\nFalse\nTrue`,
        tips: [
          "bool(0), bool(''), bool(None), bool([]) are all False",
          "Everything else is truthy",
          "int('3.5') raises an error — use int(float('3.5'))",
          "isinstance(x, int) is preferred over type(x) == int",
        ],
        questions: [
          { question: "What is the type of True in Python?", options: ["int", "str", "bool", "bit"], answer: 2, explanation: "True and False are of type bool." },
          { question: "What does bool('') return?", options: ["True", "False", "None", "Error"], answer: 1, explanation: "Empty strings are falsy in Python." },
          { question: "What does int(3.9) return?", options: ["4", "3", "3.0", "Error"], answer: 1, explanation: "int() truncates (floors toward zero), it does not round." },
          { question: "What is the type of None?", options: ["bool", "int", "NoneType", "void"], answer: 2, explanation: "None has the type NoneType." },
          { question: "Which is a complex number in Python?", options: ["3.14", "3+4j", "'3+4j'", "complex(3)"], answer: 1, explanation: "3+4j is Python's syntax for complex numbers." },
        ],
      },
      {
        id: "py-strings",
        title: "Strings In-Depth",
        description: "Master string operations and methods.",
        content: `Strings are sequences of characters. They are **immutable** — once created, they cannot be changed.\n\n**f-strings** (formatted string literals) let you embed expressions inside strings: \`f"Hello {name}"\`.\n\nStrings support **slicing**: \`s[start:stop:step]\`.\n\nCommon methods: \`upper()\`, \`lower()\`, \`strip()\`, \`split()\`, \`join()\`, \`replace()\`, \`find()\`, \`count()\`, \`startswith()\`, \`endswith()\`.`,
        code: `# String operations\ns = "Hello, World!"\n\n# Slicing\nprint(s[0:5])       # Hello\nprint(s[::-1])      # !dlroW ,olleH\n\n# Methods\nprint(s.upper())    # HELLO, WORLD!\nprint(s.lower())    # hello, world!\nprint(s.replace("World", "Python"))\nprint(s.split(", "))\nprint("-".join(["a", "b", "c"]))\n\n# f-strings\nname = "Alice"\nage = 25\nprint(f"{name} is {age} years old")\nprint(f"Next year: {age + 1}")\nprint(f"{'hello':>10}")  # right-align`,
        language: "Python",
        expectedOutput: `Hello\n!dlroW ,olleH\nHELLO, WORLD!\nhello, world!\nHello, Python!\n['Hello', ' World!']\na-b-c\nAlice is 25 years old\nNext year: 26\n     hello`,
        tips: [
          "Strings are immutable — methods return new strings",
          "f-strings are the most readable formatting method",
          "Use raw strings r'\\n' to avoid escape sequences",
          "Triple quotes for multi-line strings: '''text'''",
        ],
        questions: [
          { question: "What does 'hello'[1:4] return?", options: ["'hel'", "'ell'", "'ello'", "'hello'"], answer: 1, explanation: "Slicing [1:4] gives characters at index 1, 2, 3." },
          { question: "Are Python strings mutable?", options: ["Yes", "No", "Only with replace()", "Depends on content"], answer: 1, explanation: "Strings are immutable — you cannot change them in place." },
          { question: "What does 'abc'.upper() return?", options: ["'abc'", "'ABC'", "'Abc'", "Error"], answer: 1, explanation: "upper() returns a new string with all characters uppercase." },
          { question: "What does '-'.join(['a','b','c']) produce?", options: ["'abc'", "'a-b-c'", "['-a','-b','-c']", "'a','b','c'"], answer: 1, explanation: "join() concatenates list elements with the separator." },
          { question: "What does f'{5:03d}' produce?", options: ["'5'", "'005'", "'  5'", "'500'"], answer: 1, explanation: "03d means zero-padded integer with 3 digits minimum." },
        ],
      },
      {
        id: "py-input",
        title: "User Input",
        description: "Read input from the user.",
        content: `The \`input()\` function reads text from the user. It always returns a **string**.\n\nTo use the input as a number, convert it with \`int()\` or \`float()\`.\n\nYou can provide a prompt message: \`input("Enter your name: ")\`.`,
        code: `# Reading input (simulated)\nname = "Alice"  # In real: input("Name: ")\nage = 25        # In real: int(input("Age: "))\n\nprint(f"Hello {name}!")\nprint(f"In 10 years you'll be {age + 10}")\n\n# Input validation pattern\ndef get_positive_int(prompt):\n    while True:\n        try:\n            val = int(prompt)  # In real: int(input(prompt))\n            if val > 0:\n                return val\n            print("Must be positive!")\n        except ValueError:\n            print("Not a valid number!")\n\nresult = get_positive_int("5")\nprint(f"Got: {result}")`,
        language: "Python",
        expectedOutput: `Hello Alice!\nIn 10 years you'll be 35\nGot: 5`,
        tips: [
          "input() always returns a string",
          "Always validate user input",
          "Use try/except to handle invalid conversions",
          "strip() removes whitespace from input",
        ],
        questions: [
          { question: "What type does input() return?", options: ["int", "float", "str", "Depends on input"], answer: 2, explanation: "input() always returns a string, even if the user types numbers." },
          { question: "How do you get an integer from input?", options: ["input(int)", "int(input())", "input().int()", "integer(input())"], answer: 1, explanation: "Wrap input() with int() to convert the string to an integer." },
          { question: "What happens with int('abc')?", options: ["Returns 0", "Returns None", "Raises ValueError", "Returns 'abc'"], answer: 2, explanation: "int() raises ValueError for non-numeric strings." },
          { question: "How do you provide a prompt to input()?", options: ["input.prompt('text')", "input('text')", "prompt('text')", "read('text')"], answer: 1, explanation: "Pass the prompt string as an argument to input()." },
          { question: "What does input().strip() do?", options: ["Removes numbers", "Removes whitespace from edges", "Converts to lowercase", "Splits the string"], answer: 1, explanation: "strip() removes leading and trailing whitespace." },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. Control Flow
  // ─────────────────────────────────────────────
  {
    id: "py-control-flow",
    title: "Control Flow",
    icon: "🔀",
    color: "hsl(var(--syntax-keyword))",
    lessons: [
      {
        id: "py-if-else",
        title: "If / Elif / Else",
        description: "Make decisions in your code.",
        content: `Conditional statements control which code runs based on conditions.\n\n\`if\` checks a condition. \`elif\` adds more conditions. \`else\` handles the default case.\n\nPython uses **indentation** (4 spaces) to define blocks — no curly braces.\n\n**Ternary expression**: \`value = a if condition else b\``,
        code: `# If/elif/else\nscore = 85\n\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelif score >= 60:\n    grade = "D"\nelse:\n    grade = "F"\n\nprint(f"Score: {score}, Grade: {grade}")\n\n# Ternary expression\nage = 20\nstatus = "adult" if age >= 18 else "minor"\nprint(f"Age {age}: {status}")\n\n# Nested conditions\nx = 15\nif x > 0:\n    if x % 2 == 0:\n        print(f"{x} is positive and even")\n    else:\n        print(f"{x} is positive and odd")`,
        language: "Python",
        expectedOutput: `Score: 85, Grade: B\nAge 20: adult\n15 is positive and odd`,
        tips: [
          "Python uses indentation instead of braces",
          "Ternary: x = a if condition else b",
          "Use 'and', 'or', 'not' for logical operators",
          "Chained comparisons: 1 < x < 10",
        ],
        questions: [
          { question: "What keyword introduces an alternative condition?", options: ["else if", "elseif", "elif", "elsif"], answer: 2, explanation: "Python uses 'elif' for else-if blocks." },
          { question: "What does 'x = 5 if True else 10' assign to x?", options: ["True", "5", "10", "Error"], answer: 1, explanation: "The ternary expression returns 5 because the condition is True." },
          { question: "How does Python define code blocks?", options: ["Curly braces {}", "Indentation", "Parentheses ()", "Keywords begin/end"], answer: 1, explanation: "Python uses consistent indentation (usually 4 spaces) for code blocks." },
          { question: "What is the result of 'not True'?", options: ["True", "False", "None", "Error"], answer: 1, explanation: "'not' negates a boolean value." },
          { question: "Is '5 < x < 10' valid Python?", options: ["Yes — chained comparison", "No — syntax error", "Yes but always True", "Only in Python 2"], answer: 0, explanation: "Python supports chained comparisons, equivalent to 5 < x and x < 10." },
        ],
      },
      {
        id: "py-for-loops",
        title: "For Loops",
        description: "Iterate over sequences and ranges.",
        content: `For loops iterate over **iterables**: lists, strings, ranges, dicts, files, etc.\n\n\`range(stop)\`, \`range(start, stop)\`, \`range(start, stop, step)\` generate number sequences.\n\nUse \`enumerate()\` to get index + value. Use \`zip()\` to iterate over multiple sequences.\n\n\`break\` exits the loop. \`continue\` skips to the next iteration. \`else\` on a for loop runs if the loop completes without \`break\`.`,
        code: `# Basic for loop\nfor i in range(5):\n    print(i, end=" ")\nprint()\n\n# Iterate over a string\nfor ch in "Python":\n    print(ch, end=".")\nprint()\n\n# enumerate\nfruits = ["apple", "banana", "cherry"]\nfor i, fruit in enumerate(fruits):\n    print(f"  {i}: {fruit}")\n\n# zip\nnames = ["Alice", "Bob"]\nscores = [95, 87]\nfor name, score in zip(names, scores):\n    print(f"  {name}: {score}")\n\n# for-else\nfor n in range(2, 10):\n    for d in range(2, n):\n        if n % d == 0:\n            break\n    else:\n        print(f"  {n} is prime")`,
        language: "Python",
        expectedOutput: `0 1 2 3 4 \nP.y.t.h.o.n.\n  0: apple\n  1: banana\n  2: cherry\n  Alice: 95\n  Bob: 87\n  2 is prime\n  3 is prime\n  5 is prime\n  7 is prime`,
        tips: [
          "range(5) gives 0,1,2,3,4 — not 5",
          "enumerate() gives (index, value) tuples",
          "zip() stops at the shortest iterable",
          "for-else: else runs only if no break occurred",
        ],
        questions: [
          { question: "What does range(3) produce?", options: ["[1,2,3]", "[0,1,2]", "[0,1,2,3]", "[3]"], answer: 1, explanation: "range(3) produces 0, 1, 2." },
          { question: "What does enumerate(['a','b']) return?", options: ["['a','b']", "[(0,'a'),(1,'b')]", "[('a',0),('b',1)]", "{'a':0,'b':1}"], answer: 1, explanation: "enumerate returns (index, value) pairs." },
          { question: "When does the else clause of a for loop execute?", options: ["Always", "When loop body is empty", "When no break occurs", "Never"], answer: 2, explanation: "The else clause runs only when the loop completes without hitting break." },
          { question: "What does 'continue' do in a loop?", options: ["Exits the loop", "Skips to next iteration", "Restarts the loop", "Pauses the loop"], answer: 1, explanation: "continue skips the rest of the current iteration and moves to the next." },
          { question: "What does range(1, 10, 2) produce?", options: ["[1,3,5,7,9]", "[1,2,3,...,10]", "[2,4,6,8]", "[1,10,2]"], answer: 0, explanation: "range(1,10,2) starts at 1, goes up to (not including) 10, stepping by 2." },
        ],
      },
      {
        id: "py-while-loops",
        title: "While Loops",
        description: "Repeat while a condition is true.",
        content: `A \`while\` loop repeats as long as its condition is \`True\`.\n\nBe careful of **infinite loops** — always ensure the condition will eventually become False.\n\nCombine with \`break\` for loops that exit on a specific event. Use \`while True:\` with \`break\` for input validation patterns.`,
        code: `# Countdown\nn = 5\nwhile n > 0:\n    print(n, end=" ")\n    n -= 1\nprint("Go!")\n\n# Collatz conjecture\nnum = 27\nsteps = 0\nwhile num != 1:\n    if num % 2 == 0:\n        num //= 2\n    else:\n        num = 3 * num + 1\n    steps += 1\nprint(f"\\n27 reaches 1 in {steps} steps")\n\n# while-else\ni = 0\nwhile i < 3:\n    print(f"  i = {i}")\n    i += 1\nelse:\n    print("  Loop finished normally")`,
        language: "Python",
        expectedOutput: `5 4 3 2 1 Go!\n\n27 reaches 1 in 111 steps\n  i = 0\n  i = 1\n  i = 2\n  Loop finished normally`,
        tips: [
          "Always make sure the condition can become False",
          "while True: ... break is a common pattern",
          "while-else works like for-else",
          "Use Ctrl+C to stop an infinite loop in the terminal",
        ],
        questions: [
          { question: "What causes an infinite loop?", options: ["Using break", "Condition never becomes False", "Using continue", "Using else"], answer: 1, explanation: "If the condition never evaluates to False, the loop runs forever." },
          { question: "What does 'while True: break' do?", options: ["Runs forever", "Runs once then stops", "Syntax error", "Does nothing"], answer: 1, explanation: "The loop starts, immediately hits break, and exits." },
          { question: "How do you exit a while loop early?", options: ["return", "break", "exit", "stop"], answer: 1, explanation: "break immediately exits the innermost loop." },
          { question: "What's the output of: n=1; while n<1: print(n)", options: ["1", "Nothing", "Infinite loop", "Error"], answer: 1, explanation: "The condition n<1 is False from the start, so the body never executes." },
          { question: "What does n //= 2 do?", options: ["Divides by 2 (float)", "Floor divides by 2", "Modulo by 2", "Power of 2"], answer: 1, explanation: "//= is floor division assignment, equivalent to n = n // 2." },
        ],
      },
      {
        id: "py-match",
        title: "Match Statement (Python 3.10+)",
        description: "Structural pattern matching.",
        content: `Python 3.10 introduced \`match-case\` — structural pattern matching.\n\nIt's more powerful than switch-case: you can match **values, types, sequences, mappings**, and even **nested patterns**.\n\nUse \`_\` as a wildcard (catches everything). Guards add \`if\` conditions to patterns.`,
        code: `# Match-case basics\ndef http_status(code):\n    match code:\n        case 200:\n            return "OK"\n        case 301:\n            return "Moved"\n        case 404:\n            return "Not Found"\n        case 500:\n            return "Server Error"\n        case _:\n            return "Unknown"\n\nfor code in [200, 404, 999]:\n    print(f"  {code}: {http_status(code)}")\n\n# Pattern matching with structures\ndef describe(point):\n    match point:\n        case (0, 0):\n            return "Origin"\n        case (x, 0):\n            return f"On x-axis at {x}"\n        case (0, y):\n            return f"On y-axis at {y}"\n        case (x, y) if x == y:\n            return f"On diagonal at {x}"\n        case (x, y):\n            return f"Point({x}, {y})"\n\npoints = [(0,0), (5,0), (0,3), (4,4), (2,7)]\nfor p in points:\n    print(f"  {p}: {describe(p)}")`,
        language: "Python",
        expectedOutput: `  200: OK\n  404: Not Found\n  999: Unknown\n  (0, 0): Origin\n  (5, 0): On x-axis at 5\n  (0, 3): On y-axis at 3\n  (4, 4): On diagonal at 4\n  (2, 7): Point(2, 7)`,
        tips: [
          "match-case is available from Python 3.10+",
          "_ is the wildcard pattern (matches anything)",
          "Use guards (if) for additional conditions",
          "Can match lists, dicts, classes, and nested structures",
        ],
        questions: [
          { question: "What Python version introduced match-case?", options: ["3.8", "3.9", "3.10", "3.11"], answer: 2, explanation: "Structural pattern matching was added in Python 3.10." },
          { question: "What does _ match in a case?", options: ["Underscore character", "Nothing", "Everything (wildcard)", "Previous value"], answer: 2, explanation: "_ is the wildcard pattern that matches any value." },
          { question: "Can match-case destructure sequences?", options: ["Yes", "No", "Only tuples", "Only lists"], answer: 0, explanation: "match-case can destructure both tuples and lists." },
          { question: "What is a guard in match-case?", options: ["A security feature", "An if condition on a case", "A default case", "An import statement"], answer: 1, explanation: "Guards add if conditions: case (x, y) if x > 0:" },
          { question: "Is match-case the same as switch-case?", options: ["Yes, identical", "No, match is more powerful", "No, switch is more powerful", "They're unrelated"], answer: 1, explanation: "match-case supports structural pattern matching, which is far more powerful than traditional switch-case." },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. Functions
  // ─────────────────────────────────────────────
  {
    id: "py-functions",
    title: "Functions",
    icon: "⚡",
    color: "hsl(var(--syntax-number))",
    lessons: [
      {
        id: "py-func-basics",
        title: "Defining Functions",
        description: "Create reusable blocks of code.",
        content: `Functions are defined with \`def\`. They can take **parameters** and **return** values.\n\nParameters can have **default values**. You can call functions with **keyword arguments**.\n\nFunctions without a return statement return \`None\`.\n\nUse **docstrings** (triple-quoted strings) to document functions.`,
        code: `# Function with default parameters\ndef greet(name, greeting="Hello"):\n    """Greet a person with a custom greeting."""\n    return f"{greeting}, {name}!"\n\nprint(greet("Alice"))\nprint(greet("Bob", "Hi"))\nprint(greet(greeting="Hey", name="Charlie"))\n\n# Multiple return values\ndef divmod_custom(a, b):\n    return a // b, a % b\n\nquotient, remainder = divmod_custom(17, 5)\nprint(f"17 / 5 = {quotient} remainder {remainder}")\n\n# Docstring access\nprint(greet.__doc__)`,
        language: "Python",
        expectedOutput: `Hello, Alice!\nHi, Bob!\nHey, Charlie!\n17 / 5 = 3 remainder 2\nGreet a person with a custom greeting.`,
        tips: [
          "Default parameters must come after non-default ones",
          "Keyword arguments can be in any order",
          "Functions can return multiple values as tuples",
          "Use docstrings for documentation",
        ],
        questions: [
          { question: "What does a function without return give?", options: ["0", "''", "None", "Error"], answer: 2, explanation: "Functions without an explicit return statement return None." },
          { question: "Can default parameters come before non-default ones?", options: ["Yes", "No", "Only in Python 3", "Sometimes"], answer: 1, explanation: "Non-default parameters must come before default parameters." },
          { question: "What is a docstring?", options: ["A comment", "A string that documents a function", "A variable name", "A type hint"], answer: 1, explanation: "Docstrings are triple-quoted strings that document functions/classes/modules." },
          { question: "How do you call greet with only name='Alice'?", options: ["greet('Alice')", "greet(name='Alice')", "Both work", "Neither works"], answer: 2, explanation: "Both positional and keyword argument syntax work here." },
          { question: "What does def f(a, b=5): return a+b produce for f(3)?", options: ["Error", "8", "3", "5"], answer: 1, explanation: "b defaults to 5, so f(3) = 3 + 5 = 8." },
        ],
      },
      {
        id: "py-args-kwargs",
        title: "*args and **kwargs",
        description: "Handle variable number of arguments.",
        content: `\`*args\` collects extra **positional** arguments into a tuple.\n\n\`**kwargs\` collects extra **keyword** arguments into a dictionary.\n\nYou can use them together. Order matters: regular params → *args → keyword params → **kwargs.\n\nUse \`*\` and \`**\` to **unpack** sequences and dicts when calling functions.`,
        code: `# *args — variable positional arguments\ndef add_all(*args):\n    print(f"  args = {args}")\n    return sum(args)\n\nprint(f"Sum: {add_all(1, 2, 3, 4, 5)}")\n\n# **kwargs — variable keyword arguments\ndef build_profile(**kwargs):\n    for key, val in kwargs.items():\n        print(f"  {key}: {val}")\n\nbuild_profile(name="Alice", age=25, city="NYC")\n\n# Unpacking\nnums = [1, 2, 3]\nprint(f"Unpacked: {add_all(*nums)}")\n\nconfig = {"name": "Bob", "role": "admin"}\nbuild_profile(**config)`,
        language: "Python",
        expectedOutput: `  args = (1, 2, 3, 4, 5)\nSum: 15\n  name: Alice\n  age: 25\n  city: NYC\n  args = (1, 2, 3)\nUnpacked: 6\n  name: Bob\n  role: admin`,
        tips: [
          "*args is a tuple, **kwargs is a dict",
          "You can name them anything: *numbers, **options",
          "Use * to unpack iterables, ** to unpack dicts",
          "Order: pos, *args, keyword, **kwargs",
        ],
        questions: [
          { question: "What type is *args inside a function?", options: ["list", "tuple", "dict", "set"], answer: 1, explanation: "*args collects positional arguments into a tuple." },
          { question: "What type is **kwargs inside a function?", options: ["list", "tuple", "dict", "set"], answer: 2, explanation: "**kwargs collects keyword arguments into a dictionary." },
          { question: "What does f(*[1,2,3]) do?", options: ["Passes a list", "Unpacks list as arguments", "Error", "Passes 3 lists"], answer: 1, explanation: "* unpacks the list so f receives 1, 2, 3 as separate arguments." },
          { question: "Can you use *args and **kwargs together?", options: ["Yes", "No", "Only in Python 3", "Only in classes"], answer: 0, explanation: "You can use both: def f(*args, **kwargs):" },
          { question: "What is the correct order of parameters?", options: ["**kwargs, *args, regular", "regular, **kwargs, *args", "regular, *args, **kwargs", "*args, regular, **kwargs"], answer: 2, explanation: "The correct order is: regular → *args → keyword-only → **kwargs." },
        ],
      },
      {
        id: "py-lambda",
        title: "Lambda & Higher-Order Functions",
        description: "Anonymous functions and functional programming.",
        content: `A **lambda** is a small anonymous function: \`lambda args: expression\`.\n\n**Higher-order functions** take functions as arguments or return them.\n\nBuilt-in higher-order functions: \`map()\`, \`filter()\`, \`sorted()\` with \`key\`.\n\nUse \`functools.reduce()\` for accumulation.`,
        code: `# Lambda functions\nsquare = lambda x: x ** 2\nadd = lambda a, b: a + b\nprint(f"square(5) = {square(5)}")\nprint(f"add(3,4) = {add(3,4)}")\n\n# map — apply function to each element\nnums = [1, 2, 3, 4, 5]\nsquared = list(map(lambda x: x**2, nums))\nprint(f"Squared: {squared}")\n\n# filter — keep matching elements\nevens = list(filter(lambda x: x%2==0, nums))\nprint(f"Evens: {evens}")\n\n# sorted with key\nwords = ["banana", "pie", "apple", "fig"]\nby_len = sorted(words, key=len)\nprint(f"By length: {by_len}")\n\n# reduce\nfrom functools import reduce\nproduct = reduce(lambda a, b: a * b, nums)\nprint(f"Product: {product}")`,
        language: "Python",
        expectedOutput: `square(5) = 25\nadd(3,4) = 7\nSquared: [1, 4, 9, 16, 25]\nEvens: [2, 4]\nBy length: ['pie', 'fig', 'banana', 'apple']\nProduct: 120`,
        tips: [
          "Lambdas are limited to a single expression",
          "Prefer list comprehensions over map/filter for readability",
          "sorted() returns a new list; list.sort() is in-place",
          "reduce() applies a function cumulatively",
        ],
        questions: [
          { question: "How many expressions can a lambda have?", options: ["Zero", "One", "Multiple", "Unlimited"], answer: 1, explanation: "Lambda functions are limited to a single expression." },
          { question: "What does map(f, [1,2,3]) return?", options: ["A list", "A map object (iterator)", "A tuple", "A function"], answer: 1, explanation: "map() returns a lazy iterator. Use list() to materialize it." },
          { question: "What does filter(None, [0,1,'',2]) return?", options: ["[0,1,'',2]", "[1,2]", "[0,'']", "Error"], answer: 1, explanation: "filter(None, ...) keeps truthy values. 0 and '' are falsy." },
          { question: "What does sorted([3,1,2], reverse=True) return?", options: ["[1,2,3]", "[3,2,1]", "[3,1,2]", "None"], answer: 1, explanation: "reverse=True sorts in descending order." },
          { question: "Is 'lambda x: x+1' equivalent to a named function?", options: ["Yes, functionally", "No, they're different", "Only in Python 2", "Only for integers"], answer: 0, explanation: "Lambda creates a function object just like def, but inline and anonymous." },
        ],
      },
      {
        id: "py-closures",
        title: "Closures & Scope",
        description: "Understanding variable scope and closures.",
        content: `Python has 4 scope levels: **Local → Enclosing → Global → Built-in** (LEGB rule).\n\n**Global** variables are defined at module level. Use \`global\` keyword to modify them inside functions.\n\n**Closures** are inner functions that capture variables from the enclosing scope. Use \`nonlocal\` to modify enclosing variables.\n\nClosures are the foundation of decorators and factory functions.`,
        code: `# LEGB Scope\nx = "global"\n\ndef outer():\n    x = "enclosing"\n    def inner():\n        x = "local"\n        print(f"  inner: {x}")\n    inner()\n    print(f"  outer: {x}")\n\nouter()\nprint(f"  module: {x}")\n\n# Closure — function factory\ndef make_multiplier(n):\n    def multiply(x):\n        return x * n  # n is captured\n    return multiply\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\nprint(f"\\ndouble(5) = {double(5)}")\nprint(f"triple(5) = {triple(5)}")\n\n# nonlocal\ndef counter():\n    count = 0\n    def increment():\n        nonlocal count\n        count += 1\n        return count\n    return increment\n\nc = counter()\nprint(f"\\nCount: {c()}, {c()}, {c()}")`,
        language: "Python",
        expectedOutput: `  inner: local\n  outer: enclosing\n  module: global\n\ndouble(5) = 10\ntriple(5) = 15\n\nCount: 1, 2, 3`,
        tips: [
          "LEGB: Local → Enclosing → Global → Built-in",
          "Use 'global' to modify global vars inside functions",
          "Use 'nonlocal' to modify enclosing vars",
          "Closures capture variables by reference, not value",
        ],
        questions: [
          { question: "What is the LEGB rule?", options: ["A naming convention", "Scope resolution order", "A design pattern", "An error type"], answer: 1, explanation: "LEGB stands for Local, Enclosing, Global, Built-in — the order Python searches for variable names." },
          { question: "What does 'nonlocal' do?", options: ["Creates a global variable", "Modifies an enclosing scope variable", "Deletes a variable", "Declares a constant"], answer: 1, explanation: "nonlocal lets you modify a variable in the enclosing (non-global) scope." },
          { question: "What is a closure?", options: ["A class method", "A function that captures enclosing variables", "A file operation", "A loop construct"], answer: 1, explanation: "A closure is an inner function that remembers variables from its enclosing scope." },
          { question: "Do closures capture by value or reference?", options: ["Value", "Reference", "Copy", "Depends"], answer: 1, explanation: "Closures capture variables by reference — they see the latest value." },
          { question: "What does make_multiplier(5)(3) return?", options: ["5", "3", "15", "8"], answer: 2, explanation: "make_multiplier(5) returns a function that multiplies by 5. Calling it with 3 gives 15." },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. Data Structures
  // ─────────────────────────────────────────────
  {
    id: "py-data-structures",
    title: "Data Structures",
    icon: "🏗️",
    color: "hsl(var(--syntax-string))",
    lessons: [
      {
        id: "py-lists",
        title: "Lists",
        description: "Ordered, mutable sequences.",
        content: `Lists are **ordered, mutable** collections. They can hold any type and mixed types.\n\n**Slicing**: \`lst[start:stop:step]\` creates a shallow copy of a portion.\n\n**List comprehensions**: \`[expr for item in iterable if condition]\` — the Pythonic way to create lists.\n\nCommon methods: \`append\`, \`extend\`, \`insert\`, \`remove\`, \`pop\`, \`sort\`, \`reverse\`, \`index\`, \`count\`.`,
        code: `# List operations\nnums = [3, 1, 4, 1, 5, 9, 2, 6]\n\n# Slicing\nprint(f"First 3: {nums[:3]}")\nprint(f"Last 3: {nums[-3:]}")\nprint(f"Every other: {nums[::2]}")\nprint(f"Reversed: {nums[::-1]}")\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\nprint(f"Squares: {squares}")\n\n# Filtered comprehension\nevens = [x for x in range(20) if x % 2 == 0]\nprint(f"Evens: {evens}")\n\n# Nested comprehension (matrix)\nmatrix = [[i*3+j+1 for j in range(3)] for i in range(3)]\nfor row in matrix:\n    print(f"  {row}")`,
        language: "Python",
        expectedOutput: `First 3: [3, 1, 4]\nLast 3: [9, 2, 6]\nEvery other: [3, 4, 5, 2]\nReversed: [6, 2, 9, 5, 1, 4, 1, 3]\nSquares: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]\nEvens: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]\n  [1, 2, 3]\n  [4, 5, 6]\n  [7, 8, 9]`,
        tips: [
          "Lists are mutable — be careful with aliasing: b = a vs b = a[:]",
          "List comprehensions are faster than for loops",
          "Use collections.deque for O(1) operations on both ends",
          "sorted() returns new list; list.sort() is in-place",
        ],
        questions: [
          { question: "What does [1,2,3][::-1] produce?", options: ["[1,2,3]", "[3,2,1]", "[1,3]", "Error"], answer: 1, explanation: "[::-1] reverses the list." },
          { question: "Are Python lists mutable?", options: ["Yes", "No", "Only with methods", "Only integers"], answer: 0, explanation: "Lists are mutable — you can change their elements in place." },
          { question: "What does [x**2 for x in range(4)] produce?", options: ["[0,1,4,9]", "[1,4,9,16]", "[0,2,4,6]", "[1,2,3,4]"], answer: 0, explanation: "range(4) = 0,1,2,3; squared = 0,1,4,9." },
          { question: "What does list.pop() return?", options: ["None", "The first element", "The last element", "The list length"], answer: 2, explanation: "pop() removes and returns the last element by default." },
          { question: "What's the difference between append and extend?", options: ["Same thing", "append adds one item, extend adds each item from an iterable", "extend adds one item", "append is faster"], answer: 1, explanation: "append adds the object as-is; extend iterates and adds each element." },
        ],
      },
      {
        id: "py-dicts",
        title: "Dictionaries",
        description: "Key-value mappings.",
        content: `Dictionaries map **keys to values**. Keys must be **hashable** (immutable). Values can be anything.\n\nAccess with \`d[key]\` (raises KeyError) or \`d.get(key, default)\` (returns default).\n\n**Dict comprehensions**: \`{k: v for k, v in iterable}\`.\n\nMethods: \`keys()\`, \`values()\`, \`items()\`, \`update()\`, \`setdefault()\`, \`pop()\`.`,
        code: `# Dictionary operations\nstudent = {"name": "Alice", "age": 25, "grades": [90, 85, 92]}\n\n# Access\nprint(f"Name: {student['name']}")\nprint(f"GPA: {student.get('gpa', 'N/A')}")\n\n# Update\nstudent["gpa"] = 3.8\nstudent.update({"year": 3, "major": "CS"})\nprint(f"Keys: {list(student.keys())}")\n\n# Dict comprehension\nsquares = {x: x**2 for x in range(6)}\nprint(f"Squares: {squares}")\n\n# Iterating\nfor key, val in student.items():\n    print(f"  {key}: {val}")\n\n# Nested dict\nusers = {\n    "alice": {"age": 25, "role": "admin"},\n    "bob": {"age": 30, "role": "user"},\n}\nprint(f"\\nAlice's role: {users['alice']['role']}")`,
        language: "Python",
        expectedOutput: `Name: Alice\nGPA: N/A\nKeys: ['name', 'age', 'grades', 'gpa', 'year', 'major']\nSquares: {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\n  name: Alice\n  age: 25\n  grades: [90, 85, 92]\n  gpa: 3.8\n  year: 3\n  major: CS\n\nAlice's role: admin`,
        tips: [
          "Use .get() with a default to avoid KeyError",
          "Dict keys must be immutable (str, int, tuple)",
          "Dicts preserve insertion order (Python 3.7+)",
          "collections.defaultdict auto-creates missing keys",
        ],
        questions: [
          { question: "Can a list be a dict key?", options: ["Yes", "No", "Only if sorted", "Only empty lists"], answer: 1, explanation: "Lists are mutable and unhashable, so they can't be dict keys." },
          { question: "What does d.get('x', 0) return if 'x' not in d?", options: ["None", "0", "Error", "''"], answer: 1, explanation: ".get() returns the default value (0) if the key is not found." },
          { question: "Do dicts preserve insertion order?", options: ["Yes, since Python 3.7", "No, never", "Only with OrderedDict", "Randomly"], answer: 0, explanation: "Since Python 3.7, dictionaries maintain insertion order as part of the spec." },
          { question: "What does d.items() return?", options: ["Keys only", "Values only", "Key-value pairs", "A copy of d"], answer: 2, explanation: "items() returns a view of (key, value) tuples." },
          { question: "What does {**d1, **d2} do?", options: ["Merges two dicts", "Compares two dicts", "Error", "Creates a tuple"], answer: 0, explanation: "** unpacks dicts; {**d1, **d2} merges them (d2 values override d1)." },
        ],
      },
      {
        id: "py-sets",
        title: "Sets & Frozensets",
        description: "Unordered collections of unique elements.",
        content: `Sets are **unordered** collections of **unique, hashable** elements.\n\nSet operations: **union (|)**, **intersection (&)**, **difference (-)**, **symmetric difference (^)**.\n\n\`frozenset\` is an immutable set — can be used as a dict key or in another set.\n\nSets are great for membership testing (O(1) average) and removing duplicates.`,
        code: `# Set operations\na = {1, 2, 3, 4, 5}\nb = {4, 5, 6, 7, 8}\n\nprint(f"Union: {a | b}")\nprint(f"Intersection: {a & b}")\nprint(f"Difference (a-b): {a - b}")\nprint(f"Symmetric diff: {a ^ b}")\n\n# Remove duplicates\nwords = ["apple", "banana", "apple", "cherry", "banana"]\nunique = list(set(words))\nprint(f"Unique: {sorted(unique)}")\n\n# Set comprehension\nevens = {x for x in range(20) if x % 2 == 0}\nprint(f"Even set: {sorted(evens)}")\n\n# frozenset\nfs = frozenset([1, 2, 3])\nprint(f"Frozenset: {fs}")\nprint(f"Is hashable: {hash(fs)}")`,
        language: "Python",
        expectedOutput: `Union: {1, 2, 3, 4, 5, 6, 7, 8}\nIntersection: {4, 5}\nDifference (a-b): {1, 2, 3}\nSymmetric diff: {1, 2, 3, 6, 7, 8}\nUnique: ['apple', 'banana', 'cherry']\nEven set: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]\nFrozenset: frozenset({1, 2, 3})\nIs hashable: -7699079583225461316`,
        tips: [
          "Set membership test (in) is O(1) average",
          "Use set() to remove duplicates from a list",
          "frozenset is immutable and hashable",
          "Empty set: set(), NOT {} (that's an empty dict)",
        ],
        questions: [
          { question: "What does {} create?", options: ["Empty set", "Empty dict", "Empty tuple", "Error"], answer: 1, explanation: "{} creates an empty dict. Use set() for an empty set." },
          { question: "What is {1,2,3} & {2,3,4}?", options: ["{1,2,3,4}", "{2,3}", "{1,4}", "Error"], answer: 1, explanation: "& is set intersection — elements common to both." },
          { question: "Can sets contain lists?", options: ["Yes", "No", "Only empty lists", "Only tuples"], answer: 1, explanation: "Lists are unhashable, so they can't be in sets. Use tuples instead." },
          { question: "What is the time complexity of 'in' for sets?", options: ["O(n)", "O(log n)", "O(1) average", "O(n²)"], answer: 2, explanation: "Sets use hash tables, giving O(1) average membership test." },
          { question: "What is a frozenset?", options: ["A frozen list", "An immutable set", "A set of frozen values", "A sorted set"], answer: 1, explanation: "frozenset is an immutable, hashable version of set." },
        ],
      },
      {
        id: "py-tuples",
        title: "Tuples & Named Tuples",
        description: "Immutable sequences and structured data.",
        content: `Tuples are **immutable, ordered** sequences. Once created, they cannot be changed.\n\nUse tuples for fixed collections, function return values, and dict keys.\n\n**Tuple unpacking**: \`a, b, c = (1, 2, 3)\`.\n\n**Named tuples** from \`collections\` give names to each position, making code more readable.`,
        code: `# Tuple basics\npoint = (3, 4)\nprint(f"Point: {point}")\nprint(f"x={point[0]}, y={point[1]}")\n\n# Tuple unpacking\na, b, c = (10, 20, 30)\nprint(f"Unpacked: {a}, {b}, {c}")\n\n# Extended unpacking\nfirst, *rest = [1, 2, 3, 4, 5]\nprint(f"First: {first}, Rest: {rest}")\n\n# Named tuples\nfrom collections import namedtuple\nStudent = namedtuple("Student", ["name", "age", "grade"])\n\nalice = Student("Alice", 25, "A")\nprint(f"\\n{alice.name} is {alice.age}, grade: {alice.grade}")\nprint(f"As dict: {alice._asdict()}")`,
        language: "Python",
        expectedOutput: `Point: (3, 4)\nx=3, y=4\nUnpacked: 10, 20, 30\nFirst: 1, Rest: [2, 3, 4, 5]\n\nAlice is 25, grade: A\nAs dict: {'name': 'Alice', 'age': 25, 'grade': 'A'}`,
        tips: [
          "Tuples are immutable — safer for concurrent code",
          "Single-element tuple needs a comma: (1,)",
          "Named tuples are lightweight alternatives to classes",
          "Tuples can be dict keys (unlike lists)",
        ],
        questions: [
          { question: "Are tuples mutable?", options: ["Yes", "No", "Only nested ones", "Depends"], answer: 1, explanation: "Tuples are immutable — elements cannot be added, removed, or changed." },
          { question: "What does (1,) create?", options: ["The integer 1", "A single-element tuple", "A list with 1", "An error"], answer: 1, explanation: "The trailing comma is needed to distinguish from grouping parentheses." },
          { question: "Can tuples be dict keys?", options: ["Yes", "No", "Only if they contain strings", "Only empty tuples"], answer: 0, explanation: "Tuples are hashable (if their contents are) and can be dict keys." },
          { question: "What does first, *rest = [1,2,3] assign to rest?", options: ["[2,3]", "(2,3)", "3", "Error"], answer: 0, explanation: "*rest collects the remaining elements into a list." },
          { question: "What module provides namedtuple?", options: ["itertools", "functools", "collections", "typing"], answer: 2, explanation: "namedtuple is in the collections module." },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. Object-Oriented Programming
  // ─────────────────────────────────────────────
  {
    id: "py-oop",
    title: "Object-Oriented Programming",
    icon: "🧱",
    color: "hsl(var(--syntax-variable))",
    lessons: [
      {
        id: "py-classes",
        title: "Classes & Objects",
        description: "Create custom types with classes.",
        content: `A **class** is a blueprint for creating objects. An **object** is an instance of a class.\n\n\`__init__\` is the constructor — called when creating a new object.\n\n\`self\` refers to the current instance. It must be the first parameter of instance methods.\n\nUse \`__str__\` for a readable string representation and \`__repr__\` for an unambiguous one.`,
        code: `class Dog:\n    species = "Canis familiaris"  # Class attribute\n    \n    def __init__(self, name, age):\n        self.name = name  # Instance attribute\n        self.age = age\n    \n    def __str__(self):\n        return f"{self.name} ({self.age} years)"\n    \n    def bark(self):\n        return f"{self.name} says Woof!"\n    \n    def human_years(self):\n        return self.age * 7\n\n# Create objects\nrex = Dog("Rex", 3)\nbuddy = Dog("Buddy", 5)\n\nprint(rex)\nprint(rex.bark())\nprint(f"In human years: {rex.human_years()}")\nprint(f"Species: {Dog.species}")\nprint(f"Is Dog: {isinstance(buddy, Dog)}")`,
        language: "Python",
        expectedOutput: `Rex (3 years)\nRex says Woof!\nIn human years: 21\nSpecies: Canis familiaris\nIs Dog: True`,
        tips: [
          "self is not a keyword — it's a convention",
          "Class attributes are shared by all instances",
          "Instance attributes are unique to each object",
          "__str__ is for users, __repr__ is for developers",
        ],
        questions: [
          { question: "What is __init__?", options: ["A destructor", "A constructor/initializer", "A class attribute", "A module"], answer: 1, explanation: "__init__ initializes a new instance when it's created." },
          { question: "What does 'self' refer to?", options: ["The class", "The current instance", "The parent class", "A global variable"], answer: 1, explanation: "self refers to the specific instance the method is called on." },
          { question: "What's the difference between class and instance attributes?", options: ["No difference", "Class attrs are shared; instance attrs are per-object", "Instance attrs are shared", "Class attrs can't be changed"], answer: 1, explanation: "Class attributes are shared by all instances; instance attributes are unique to each." },
          { question: "When is __str__ called?", options: ["On creation", "When using print() or str()", "On deletion", "Never automatically"], answer: 1, explanation: "__str__ is called by print() and str() for a human-readable representation." },
          { question: "What does isinstance(obj, Class) check?", options: ["If obj equals Class", "If obj is an instance of Class", "If obj has Class methods", "If obj is a class"], answer: 1, explanation: "isinstance checks if an object is an instance of a class (or its subclasses)." },
        ],
      },
      {
        id: "py-inheritance",
        title: "Inheritance & Polymorphism",
        description: "Extend classes and override behavior.",
        content: `**Inheritance** lets a class (child) inherit attributes and methods from another class (parent).\n\nUse \`super()\` to call parent class methods.\n\n**Polymorphism**: different classes can have methods with the same name but different behaviors.\n\nPython supports **multiple inheritance** and uses the MRO (Method Resolution Order) to resolve conflicts.`,
        code: `class Animal:\n    def __init__(self, name):\n        self.name = name\n    \n    def speak(self):\n        return f"{self.name} makes a sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return f"{self.name} says Woof!"\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} says Meow!"\n\nclass Kitten(Cat):\n    def __init__(self, name, toy):\n        super().__init__(name)\n        self.toy = toy\n    \n    def play(self):\n        return f"{self.name} plays with {self.toy}"\n\n# Polymorphism\nanimals = [Dog("Rex"), Cat("Whiskers"), Kitten("Tiny", "yarn")]\nfor animal in animals:\n    print(f"  {animal.speak()}")\n\ntiny = Kitten("Tiny", "yarn")\nprint(f"\\n{tiny.play()}")\nprint(f"MRO: {[c.__name__ for c in Kitten.__mro__]}")`,
        language: "Python",
        expectedOutput: `  Rex says Woof!\n  Whiskers says Meow!\n  Tiny says Meow!\n\nTiny plays with yarn\nMRO: ['Kitten', 'Cat', 'Animal', 'object']`,
        tips: [
          "Use super() to call parent methods",
          "Python supports multiple inheritance",
          "MRO defines the method lookup order",
          "Prefer composition over inheritance for complex designs",
        ],
        questions: [
          { question: "What does super() do?", options: ["Creates a superclass", "Calls parent class methods", "Makes a class abstract", "Deletes parent class"], answer: 1, explanation: "super() returns a proxy that delegates method calls to the parent class." },
          { question: "What is polymorphism?", options: ["Multiple variables", "Same interface, different implementations", "Multiple files", "Same implementation, different names"], answer: 1, explanation: "Polymorphism means different types can provide their own implementation of a common interface." },
          { question: "What is MRO?", options: ["A design pattern", "Method Resolution Order", "A module", "A type hint"], answer: 1, explanation: "MRO determines the order in which base classes are searched for methods." },
          { question: "Does Python support multiple inheritance?", options: ["Yes", "No", "Only with mixins", "Only in Python 2"], answer: 0, explanation: "Python fully supports multiple inheritance." },
          { question: "Can a child class override parent methods?", options: ["Yes", "No", "Only with @override", "Only static methods"], answer: 0, explanation: "Child classes can freely override parent methods by defining a method with the same name." },
        ],
      },
      {
        id: "py-dunder",
        title: "Magic Methods (Dunder)",
        description: "Customize object behavior with special methods.",
        content: `**Dunder (double underscore) methods** let you customize how objects behave with built-in operations.\n\n- \`__str__\`, \`__repr__\` — string representation\n- \`__len__\`, \`__getitem__\` — make objects iterable/indexable\n- \`__add__\`, \`__mul__\` — operator overloading\n- \`__eq__\`, \`__lt__\` — comparison operators\n- \`__enter__\`, \`__exit__\` — context managers`,
        code: `class Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    \n    def __repr__(self):\n        return f"Vector({self.x}, {self.y})"\n    \n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n    \n    def __mul__(self, scalar):\n        return Vector(self.x * scalar, self.y * scalar)\n    \n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y\n    \n    def __abs__(self):\n        return (self.x**2 + self.y**2) ** 0.5\n    \n    def __len__(self):\n        return 2  # 2D vector\n\nv1 = Vector(3, 4)\nv2 = Vector(1, 2)\n\nprint(f"v1 = {v1}")\nprint(f"v2 = {v2}")\nprint(f"v1 + v2 = {v1 + v2}")\nprint(f"v1 * 3 = {v1 * 3}")\nprint(f"|v1| = {abs(v1)}")\nprint(f"v1 == v2: {v1 == v2}")\nprint(f"v1 == Vector(3,4): {v1 == Vector(3,4)}")`,
        language: "Python",
        expectedOutput: `v1 = Vector(3, 4)\nv2 = Vector(1, 2)\nv1 + v2 = Vector(4, 6)\nv1 * 3 = Vector(9, 12)\n|v1| = 5.0\nv1 == v2: False\nv1 == Vector(3,4): True`,
        tips: [
          "Dunder methods are called by Python operators and built-ins",
          "__repr__ should be unambiguous, __str__ should be readable",
          "Implementing __eq__ also makes objects unhashable by default",
          "Use @total_ordering from functools to auto-generate comparison methods",
        ],
        questions: [
          { question: "What does __add__ customize?", options: ["String addition", "The + operator", "Method addition", "Attribute access"], answer: 1, explanation: "__add__ is called when the + operator is used on an object." },
          { question: "What is __repr__ for?", options: ["User display", "Unambiguous developer representation", "Serialization", "Logging only"], answer: 1, explanation: "__repr__ should return an unambiguous string, ideally one that could recreate the object." },
          { question: "What does __len__ enable?", options: ["The len() function", "String length", "List extension", "Memory size"], answer: 0, explanation: "__len__ is called by the built-in len() function." },
          { question: "What are dunder methods named after?", options: ["Dungeon mechanics", "Double underscore prefix/suffix", "Dynamic unification", "Dutch naming"], answer: 1, explanation: "Dunder = Double UNDERscore, like __init__, __str__, etc." },
          { question: "Does implementing __eq__ affect __hash__?", options: ["No", "Yes — __hash__ is set to None", "Only for strings", "Only in Python 2"], answer: 1, explanation: "If you define __eq__, Python sets __hash__ to None, making instances unhashable unless you also define __hash__." },
        ],
      },
      {
        id: "py-dataclasses",
        title: "Dataclasses & Slots",
        description: "Modern Python classes with less boilerplate.",
        content: `**Dataclasses** (Python 3.7+) auto-generate \`__init__\`, \`__repr__\`, \`__eq__\`, and more.\n\nUse \`@dataclass\` decorator and type annotations to define fields.\n\nOptions: \`frozen=True\` (immutable), \`order=True\` (comparison), \`slots=True\` (memory efficient).\n\n**\\_\\_slots\\_\\_** restricts instance attributes, saving memory and preventing typos.`,
        code: `from dataclasses import dataclass, field\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n    \n    def distance(self, other: "Point") -> float:\n        return ((self.x - other.x)**2 + (self.y - other.y)**2) ** 0.5\n\n@dataclass(frozen=True)\nclass Color:\n    r: int\n    g: int\n    b: int\n    name: str = "unnamed"\n\n@dataclass\nclass Student:\n    name: str\n    grades: list = field(default_factory=list)\n    \n    @property\n    def average(self):\n        return sum(self.grades) / len(self.grades) if self.grades else 0\n\np1 = Point(0, 0)\np2 = Point(3, 4)\nprint(f"p1 = {p1}")\nprint(f"Distance: {p1.distance(p2)}")\n\nred = Color(255, 0, 0, "red")\nprint(f"Color: {red}")\n\ns = Student("Alice", [90, 85, 92])\nprint(f"{s.name}'s average: {s.average}")`,
        language: "Python",
        expectedOutput: `p1 = Point(x=0, y=0)\nDistance: 5.0\nColor: Color(r=255, g=0, b=0, name='red')\nAlice's average: 89.0`,
        tips: [
          "@dataclass auto-generates __init__, __repr__, __eq__",
          "Use frozen=True for immutable instances",
          "Use field(default_factory=list) for mutable defaults",
          "slots=True (Python 3.10+) saves memory",
        ],
        questions: [
          { question: "What does @dataclass auto-generate?", options: ["Only __init__", "__init__, __repr__, __eq__", "All dunder methods", "Nothing"], answer: 1, explanation: "@dataclass generates __init__, __repr__, and __eq__ by default." },
          { question: "What does frozen=True do?", options: ["Speeds up the class", "Makes instances immutable", "Freezes the module", "Prevents inheritance"], answer: 1, explanation: "frozen=True makes instances immutable (raises FrozenInstanceError on assignment)." },
          { question: "Why use field(default_factory=list)?", options: ["For speed", "To avoid shared mutable defaults", "For sorting", "For serialization"], answer: 1, explanation: "Mutable default arguments are shared between instances. default_factory creates a new one each time." },
          { question: "What Python version introduced dataclasses?", options: ["3.5", "3.6", "3.7", "3.8"], answer: 2, explanation: "Dataclasses were introduced in Python 3.7." },
          { question: "What does __slots__ do?", options: ["Creates slots for methods", "Restricts instance attributes to save memory", "Defines class hierarchy", "Enables threading"], answer: 1, explanation: "__slots__ tells Python exactly which instance attributes to expect, saving memory." },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6. Error Handling
  // ─────────────────────────────────────────────
  {
    id: "py-errors",
    title: "Error Handling",
    icon: "🛡️",
    color: "hsl(var(--syntax-comment))",
    lessons: [
      {
        id: "py-try-except",
        title: "Try / Except / Finally",
        description: "Handle exceptions gracefully.",
        content: `**Exceptions** are errors detected during execution. Use \`try/except\` to handle them.\n\n\`except\` catches specific exceptions. \`else\` runs if no exception occurred. \`finally\` always runs.\n\nCommon exceptions: \`ValueError\`, \`TypeError\`, \`KeyError\`, \`IndexError\`, \`FileNotFoundError\`, \`ZeroDivisionError\`.`,
        code: `# Basic try/except\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f"Error: {e}")\n\n# Multiple exceptions\ndef safe_divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError:\n        return "Cannot divide by zero"\n    except TypeError:\n        return "Invalid types"\n    else:\n        return f"Result: {result}"\n    finally:\n        print("  (cleanup done)")\n\nprint(safe_divide(10, 3))\nprint(safe_divide(10, 0))\nprint(safe_divide("a", 2))`,
        language: "Python",
        expectedOutput: `Error: division by zero\n  (cleanup done)\nResult: 3.3333333333333335\n  (cleanup done)\nCannot divide by zero\n  (cleanup done)\nInvalid types`,
        tips: [
          "Catch specific exceptions, not bare 'except:'",
          "'else' runs only if no exception was raised",
          "'finally' always runs — good for cleanup",
          "Use 'as e' to get the exception object",
        ],
        questions: [
          { question: "When does the 'finally' block run?", options: ["Only on error", "Only on success", "Always", "Never"], answer: 2, explanation: "The finally block always executes, regardless of whether an exception occurred." },
          { question: "When does the 'else' block in try run?", options: ["Always", "When exception occurs", "When no exception occurs", "After finally"], answer: 2, explanation: "The else block runs only if the try block completed without raising an exception." },
          { question: "What does 'except Exception as e' do?", options: ["Catches all errors", "Catches most exceptions and binds to e", "Only catches Exception", "Creates a new exception"], answer: 1, explanation: "It catches Exception and its subclasses, binding the exception object to variable e." },
          { question: "Why avoid bare 'except:'?", options: ["It's slower", "It catches everything including SystemExit and KeyboardInterrupt", "It's deprecated", "It doesn't work"], answer: 1, explanation: "Bare except catches all exceptions including ones you usually don't want to catch." },
          { question: "What exception does d['missing_key'] raise?", options: ["ValueError", "IndexError", "KeyError", "AttributeError"], answer: 2, explanation: "Accessing a missing dict key raises KeyError." },
        ],
      },
      {
        id: "py-custom-exceptions",
        title: "Custom Exceptions",
        description: "Create your own exception classes.",
        content: `Custom exceptions help make error handling **domain-specific** and more informative.\n\nCreate by inheriting from \`Exception\` (or a more specific built-in exception).\n\nUse \`raise\` to throw exceptions. You can chain exceptions with \`raise ... from ...\`.`,
        code: `# Custom exceptions\nclass ValidationError(Exception):\n    def __init__(self, field, message):\n        self.field = field\n        self.message = message\n        super().__init__(f"{field}: {message}")\n\nclass AgeError(ValidationError):\n    pass\n\ndef validate_age(age):\n    if not isinstance(age, int):\n        raise TypeError("Age must be an integer")\n    if age < 0:\n        raise AgeError("age", "Cannot be negative")\n    if age > 150:\n        raise AgeError("age", "Unrealistic value")\n    return True\n\n# Testing\nfor test_age in [25, -5, 200, "old"]:\n    try:\n        validate_age(test_age)\n        print(f"  {test_age}: Valid")\n    except AgeError as e:\n        print(f"  {test_age}: AgeError — {e}")\n    except TypeError as e:\n        print(f"  {test_age}: TypeError — {e}")`,
        language: "Python",
        expectedOutput: `  25: Valid\n  -5: AgeError — age: Cannot be negative\n  200: AgeError — age: Unrealistic value\n  old: TypeError — Age must be an integer`,
        tips: [
          "Always inherit from Exception, not BaseException",
          "Name custom exceptions with Error suffix",
          "Add useful attributes to exception classes",
          "Use 'raise from' to chain exceptions",
        ],
        questions: [
          { question: "What should custom exceptions inherit from?", options: ["object", "BaseException", "Exception", "Error"], answer: 2, explanation: "Custom exceptions should inherit from Exception or its subclasses." },
          { question: "How do you raise an exception?", options: ["throw Error()", "raise Error()", "error Error()", "except Error()"], answer: 1, explanation: "Python uses the 'raise' keyword to throw exceptions." },
          { question: "What does 'raise X from Y' do?", options: ["Raises X only", "Chains Y as the cause of X", "Raises both X and Y", "Replaces X with Y"], answer: 1, explanation: "'raise X from Y' sets Y as the __cause__ of X, creating an exception chain." },
          { question: "What naming convention is used for exceptions?", options: ["PascalCase", "Error suffix (e.g., ValueError)", "snake_case", "ALL_CAPS"], answer: 1, explanation: "Exceptions typically use PascalCase with an Error suffix." },
          { question: "Can you re-raise the current exception?", options: ["No", "Yes, with 'raise'", "Yes, with 'throw'", "Only in finally"], answer: 1, explanation: "A bare 'raise' statement re-raises the current exception." },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7. Decorators & Generators
  // ─────────────────────────────────────────────
  {
    id: "py-advanced-func",
    title: "Decorators & Generators",
    icon: "✨",
    color: "hsl(var(--syntax-function))",
    lessons: [
      {
        id: "py-decorators",
        title: "Decorators",
        description: "Modify function behavior without changing code.",
        content: `A **decorator** wraps a function to extend its behavior. It takes a function and returns a modified function.\n\nUse \`@decorator\` syntax above the function definition.\n\n\`functools.wraps\` preserves the original function's name and docstring.\n\nDecorators can take arguments, stack, and be applied to classes.`,
        code: `import functools\nimport time\n\n# Timer decorator\ndef timer(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        elapsed = time.time() - start\n        print(f"  {func.__name__} took {elapsed:.4f}s")\n        return result\n    return wrapper\n\n# Retry decorator with arguments\ndef retry(max_attempts=3):\n    def decorator(func):\n        @functools.wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, max_attempts + 1):\n                try:\n                    return func(*args, **kwargs)\n                except Exception as e:\n                    print(f"  Attempt {attempt} failed: {e}")\n            return None\n        return wrapper\n    return decorator\n\n@timer\ndef slow_sum(n):\n    return sum(range(n))\n\nresult = slow_sum(1000000)\nprint(f"  Sum: {result}")\n\n@retry(max_attempts=3)\ndef risky():\n    import random\n    if random.random() < 0.7:\n        raise ValueError("Bad luck")\n    return "Success!"\n\nprint(f"\\n  Result: {risky()}")`,
        language: "Python",
        expectedOutput: `  slow_sum took 0.0XXXs\n  Sum: 499999500000\n\n  Attempt 1 failed: Bad luck\n  Attempt 2 failed: Bad luck\n  Result: Success!`,
        tips: [
          "Always use @functools.wraps to preserve metadata",
          "Decorators with arguments need an extra nested function",
          "Common uses: logging, timing, caching, auth checks",
          "@property is a built-in decorator for getters/setters",
        ],
        questions: [
          { question: "What does a decorator return?", options: ["None", "A string", "A modified function", "The original function"], answer: 2, explanation: "A decorator takes a function and returns a new/modified function." },
          { question: "What does @functools.wraps preserve?", options: ["Runtime speed", "Function name and docstring", "Return value", "Arguments"], answer: 1, explanation: "@wraps copies __name__, __doc__, and other attributes from the original function." },
          { question: "Is @decorator the same as func = decorator(func)?", options: ["Yes", "No", "Only for classes", "Only in Python 3"], answer: 0, explanation: "@decorator is syntactic sugar for func = decorator(func)." },
          { question: "Can decorators take arguments?", options: ["No", "Yes, with an extra wrapper layer", "Only strings", "Only in Python 3.8+"], answer: 1, explanation: "Decorators with arguments need a factory function that returns the actual decorator." },
          { question: "Can you stack multiple decorators?", options: ["No", "Yes", "Only 2", "Only if compatible"], answer: 1, explanation: "You can stack any number of decorators. They apply bottom-up." },
        ],
      },
      {
        id: "py-generators",
        title: "Generators & Iterators",
        description: "Lazy evaluation with yield.",
        content: `**Generators** produce values lazily using \`yield\`. They remember their state between calls.\n\nA generator function returns a **generator object** (an iterator). Use \`next()\` or a for loop to get values.\n\n**Generator expressions**: \`(expr for item in iterable)\` — like list comprehensions but lazy.\n\nGenerators are memory-efficient for large/infinite sequences.`,
        code: `# Generator function\ndef fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\n# Get first 10 Fibonacci numbers\nfib = fibonacci()\nfirst_10 = [next(fib) for _ in range(10)]\nprint(f"Fibonacci: {first_10}")\n\n# Generator with send()\ndef accumulator():\n    total = 0\n    while True:\n        value = yield total\n        if value is not None:\n            total += value\n\nacc = accumulator()\nnext(acc)  # Prime the generator\nfor n in [10, 20, 30]:\n    result = acc.send(n)\n    print(f"  Added {n}, total: {result}")\n\n# Generator expression\nsum_squares = sum(x**2 for x in range(1000000))\nprint(f"\\nSum of squares: {sum_squares}")`,
        language: "Python",
        expectedOutput: `Fibonacci: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n  Added 10, total: 10\n  Added 20, total: 30\n  Added 30, total: 60\n\nSum of squares: 333332833333500000`,
        tips: [
          "Generators are memory efficient — they compute values on demand",
          "yield pauses the function; next() resumes it",
          "Generator expressions use () instead of []",
          "Use send() to pass values into a generator",
        ],
        questions: [
          { question: "What does yield do?", options: ["Returns and ends the function", "Pauses the function and produces a value", "Creates a list", "Raises an error"], answer: 1, explanation: "yield pauses the function, saving its state, and produces a value." },
          { question: "Are generators memory efficient?", options: ["No", "Yes — they compute lazily", "Only for small data", "Same as lists"], answer: 1, explanation: "Generators compute values on demand, not all at once in memory." },
          { question: "What does next(gen) do?", options: ["Creates a generator", "Gets the next yielded value", "Resets the generator", "Closes the generator"], answer: 1, explanation: "next() resumes the generator and returns the next yielded value." },
          { question: "What is (x**2 for x in range(10))?", options: ["A list", "A tuple", "A generator expression", "A set"], answer: 2, explanation: "Parentheses with a comprehension-like syntax create a generator expression." },
          { question: "What does gen.send(value) do?", options: ["Sends value to output", "Resumes generator with value as yield result", "Creates a new generator", "Stops the generator"], answer: 1, explanation: "send() resumes the generator and the sent value becomes the result of the yield expression." },
        ],
      },
      {
        id: "py-context-managers",
        title: "Context Managers",
        description: "Resource management with 'with' statements.",
        content: `**Context managers** ensure resources are properly acquired and released. The \`with\` statement handles setup and teardown.\n\nImplement with \`__enter__\` and \`__exit__\` methods, or use \`@contextmanager\` from contextlib.\n\nCommon uses: file handling, database connections, locks, temporary changes.`,
        code: `# Using built-in context manager\nfrom contextlib import contextmanager\nimport time\n\n# Custom context manager with class\nclass Timer:\n    def __enter__(self):\n        self.start = time.time()\n        return self\n    \n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.elapsed = time.time() - self.start\n        print(f"  Elapsed: {self.elapsed:.4f}s")\n        return False  # Don't suppress exceptions\n\nwith Timer() as t:\n    total = sum(range(1000000))\n    print(f"  Sum: {total}")\n\n# Using @contextmanager decorator\n@contextmanager\ndef temporary_value(obj, attr, value):\n    old = getattr(obj, attr)\n    setattr(obj, attr, value)\n    print(f"  Set {attr} = {value}")\n    try:\n        yield obj\n    finally:\n        setattr(obj, attr, old)\n        print(f"  Restored {attr} = {old}")\n\nclass Config:\n    debug = False\n\nconfig = Config()\nwith temporary_value(config, "debug", True):\n    print(f"  Debug mode: {config.debug}")\nprint(f"  Debug mode: {config.debug}")`,
        language: "Python",
        expectedOutput: `  Sum: 499999500000\n  Elapsed: 0.0XXXs\n  Set debug = True\n  Debug mode: True\n  Restored debug = False\n  Debug mode: False`,
        tips: [
          "with statement calls __enter__ on entry and __exit__ on exit",
          "__exit__ receives exception info — return True to suppress",
          "@contextmanager makes simple context managers easy",
          "Always use with for file operations",
        ],
        questions: [
          { question: "What methods does a context manager need?", options: ["__init__ and __del__", "__enter__ and __exit__", "__start__ and __stop__", "__open__ and __close__"], answer: 1, explanation: "Context managers implement __enter__ (setup) and __exit__ (teardown)." },
          { question: "What does __exit__ returning True do?", options: ["Nothing", "Suppresses the exception", "Re-raises the exception", "Logs the exception"], answer: 1, explanation: "Returning True from __exit__ suppresses any exception that occurred." },
          { question: "What does @contextmanager simplify?", options: ["Class creation", "Creating context managers from generators", "File operations", "Error handling"], answer: 1, explanation: "@contextmanager turns a generator function into a context manager." },
          { question: "Why use 'with open(f) as file:' instead of open(f)?", options: ["It's faster", "It auto-closes the file", "It's required", "It opens in binary mode"], answer: 1, explanation: "The with statement ensures the file is properly closed even if an error occurs." },
          { question: "Can you nest with statements?", options: ["No", "Yes", "Only 2 levels", "Only for files"], answer: 1, explanation: "with statements can be nested, or use: with A() as a, B() as b:" },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8. File I/O & Modules
  // ─────────────────────────────────────────────
  {
    id: "py-files-modules",
    title: "File I/O & Modules",
    icon: "📁",
    color: "hsl(var(--syntax-number))",
    lessons: [
      {
        id: "py-file-io",
        title: "Reading & Writing Files",
        description: "Work with files in Python.",
        content: `Use \`open()\` with \`with\` statement for safe file handling.\n\nModes: \`'r'\` (read), \`'w'\` (write/overwrite), \`'a'\` (append), \`'x'\` (exclusive create), \`'b'\` (binary).\n\n\`read()\` reads entire file, \`readline()\` one line, \`readlines()\` all lines as list. Iterate directly for memory efficiency.\n\nUse \`pathlib.Path\` for modern file path handling.`,
        code: `from pathlib import Path\nimport json\n\n# Simulated file operations (conceptual)\ndata = {"users": ["Alice", "Bob", "Charlie"]}\n\n# Writing JSON\njson_str = json.dumps(data, indent=2)\nprint("Written JSON:")\nprint(json_str)\n\n# Reading JSON back\nparsed = json.loads(json_str)\nprint(f"\\nUsers: {parsed['users']}")\n\n# pathlib examples\np = Path("/home/user/project/data.txt")\nprint(f"\\nName: {p.name}")\nprint(f"Stem: {p.stem}")\nprint(f"Suffix: {p.suffix}")\nprint(f"Parent: {p.parent}")\n\n# CSV-like processing\ncsv_data = "name,age,city\\nAlice,25,NYC\\nBob,30,LA"\nfor i, line in enumerate(csv_data.split("\\n")):\n    fields = line.split(",")\n    if i == 0:\n        print(f"\\nHeaders: {fields}")\n    else:\n        print(f"  Row: {fields}")`,
        language: "Python",
        expectedOutput: `Written JSON:\n{\n  "users": [\n    "Alice",\n    "Bob",\n    "Charlie"\n  ]\n}\n\nUsers: ['Alice', 'Bob', 'Charlie']\n\nName: data.txt\nStem: data\nSuffix: .txt\nParent: /home/user/project\n\nHeaders: ['name', 'age', 'city']\n  Row: ['Alice', '25', 'NYC']\n  Row: ['Bob', '30', 'LA']`,
        tips: [
          "Always use 'with' to ensure files are closed properly",
          "pathlib.Path is better than os.path for modern Python",
          "Use json module for JSON serialization",
          "csv module handles CSV edge cases (quoting, commas in values)",
        ],
        questions: [
          { question: "What file mode creates or overwrites a file?", options: ["'r'", "'w'", "'a'", "'x'"], answer: 1, explanation: "'w' opens for writing, creating or truncating the file." },
          { question: "What does pathlib.Path('/a/b.txt').stem return?", options: ["'/a/b.txt'", "'b.txt'", "'b'", "'.txt'"], answer: 2, explanation: ".stem returns the filename without the extension." },
          { question: "Why use 'with open(...)' instead of open()?", options: ["Faster I/O", "Auto-closes the file", "Required syntax", "Enables binary mode"], answer: 1, explanation: "'with' ensures proper file closure even if an error occurs." },
          { question: "What module serializes Python objects to JSON?", options: ["pickle", "json", "csv", "marshal"], answer: 1, explanation: "The json module provides dumps/loads for JSON serialization." },
          { question: "What does 'a' mode do?", options: ["Reads all", "Appends without truncating", "Creates exclusively", "Opens binary"], answer: 1, explanation: "'a' mode opens for appending — writes go to the end without deleting existing content." },
        ],
      },
      {
        id: "py-modules",
        title: "Modules & Packages",
        description: "Organize code with imports.",
        content: `A **module** is a .py file. A **package** is a directory with \`__init__.py\`.\n\nImport styles: \`import module\`, \`from module import name\`, \`from module import *\` (avoid!).\n\n\`__name__\` is \`'__main__'\` when the file is run directly. Use \`if __name__ == '__main__':\` guard.\n\nKey standard library modules: \`os\`, \`sys\`, \`json\`, \`re\`, \`math\`, \`datetime\`, \`collections\`, \`itertools\`, \`functools\`.`,
        code: `# Using standard library modules\nimport math\nimport itertools\nfrom collections import Counter, defaultdict\nfrom datetime import datetime, timedelta\n\n# math\nprint(f"π = {math.pi:.6f}")\nprint(f"√2 = {math.sqrt(2):.6f}")\nprint(f"log₂(8) = {math.log2(8)}")\n\n# collections.Counter\nwords = "the cat sat on the mat the cat".split()\ncount = Counter(words)\nprint(f"\\nWord counts: {count.most_common(3)}")\n\n# defaultdict\ngrouped = defaultdict(list)\ndata = [("a", 1), ("b", 2), ("a", 3), ("b", 4)]\nfor key, val in data:\n    grouped[key].append(val)\nprint(f"Grouped: {dict(grouped)}")\n\n# itertools\nperms = list(itertools.permutations([1,2,3], 2))\nprint(f"\\nPermutations: {perms}")\n\n# datetime\nnow = datetime(2025, 3, 7)\nprint(f"Date: {now.strftime('%Y-%m-%d')}")\nprint(f"Tomorrow: {(now + timedelta(days=1)).strftime('%Y-%m-%d')}")`,
        language: "Python",
        expectedOutput: `π = 3.141593\n√2 = 1.414214\nlog₂(8) = 3.0\n\nWord counts: [('the', 3), ('cat', 2), ('sat', 1)]\nGrouped: {'a': [1, 3], 'b': [2, 4]}\n\nPermutations: [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]\nDate: 2025-03-07\nTomorrow: 2025-03-08`,
        tips: [
          "Avoid 'from module import *' — it pollutes the namespace",
          "Use if __name__ == '__main__': for script entry points",
          "collections has Counter, defaultdict, deque, OrderedDict",
          "itertools has powerful combinatoric and lazy tools",
        ],
        questions: [
          { question: "What is __name__ when a file is run directly?", options: ["The filename", "'__main__'", "None", "'module'"], answer: 1, explanation: "When a Python file is executed directly, __name__ is set to '__main__'." },
          { question: "What does Counter('aabbc') produce?", options: ["{'a':2,'b':2,'c':1}", "[('a',2)]", "5", "'aabbc'"], answer: 0, explanation: "Counter counts occurrences of each element." },
          { question: "What does defaultdict(list) do?", options: ["Creates a list", "Returns empty list for missing keys", "Sorts lists", "Creates a default list"], answer: 1, explanation: "defaultdict(list) creates an empty list for any missing key, avoiding KeyError." },
          { question: "What is a Python package?", options: ["A .py file", "A directory with __init__.py", "A zip file", "A compiled module"], answer: 1, explanation: "A package is a directory that contains __init__.py (can be empty)." },
          { question: "Why avoid 'from module import *'?", options: ["It's slow", "It pollutes the namespace and hides origin", "It's deprecated", "It only imports classes"], answer: 1, explanation: "Wildcard imports make it unclear where names come from and can shadow existing names." },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9. Advanced Topics
  // ─────────────────────────────────────────────
  {
    id: "py-advanced",
    title: "Advanced Python",
    icon: "🎓",
    color: "hsl(var(--syntax-keyword))",
    lessons: [
      {
        id: "py-comprehensions",
        title: "Advanced Comprehensions",
        description: "Dict, set, and nested comprehensions.",
        content: `Beyond list comprehensions, Python offers **dict**, **set**, and **nested** comprehensions.\n\nUse **walrus operator** (:=) in comprehensions for assignment expressions (Python 3.8+).\n\nComprehensions can replace many map/filter/lambda patterns with cleaner code.`,
        code: `# Dict comprehension\nword_lengths = {w: len(w) for w in ["python", "is", "awesome"]}\nprint(f"Lengths: {word_lengths}")\n\n# Set comprehension\nvowels_in = {ch for ch in "hello world" if ch in "aeiou"}\nprint(f"Vowels used: {sorted(vowels_in)}")\n\n# Nested comprehension - flatten\nmatrix = [[1,2,3],[4,5,6],[7,8,9]]\nflat = [x for row in matrix for x in row]\nprint(f"Flat: {flat}")\n\n# Conditional expression in comprehension\nlabels = ["even" if x%2==0 else "odd" for x in range(6)]\nprint(f"Labels: {labels}")\n\n# Walrus operator in comprehension (3.8+)\nimport math\nresults = [y for x in range(10) if (y := math.sqrt(x)) > 2]\nprint(f"√x > 2: {[f'{r:.2f}' for r in results]}")`,
        language: "Python",
        expectedOutput: `Lengths: {'python': 6, 'is': 2, 'awesome': 7}\nVowels used: ['e', 'o']\nFlat: [1, 2, 3, 4, 5, 6, 7, 8, 9]\nLabels: ['even', 'odd', 'even', 'odd', 'even', 'odd']\n√x > 2: ['2.24', '2.45', '2.65', '2.83', '3.00']`,
        tips: [
          "Dict comprehension: {k: v for k, v in items}",
          "Set comprehension: {expr for item in iterable}",
          "Nested for clauses read left to right",
          "Walrus operator := assigns and returns a value",
        ],
        questions: [
          { question: "What does {x: x**2 for x in range(4)} create?", options: ["A set", "A list", "A dict {0:0, 1:1, 2:4, 3:9}", "An error"], answer: 2, explanation: "Curly braces with key:value syntax create a dict comprehension." },
          { question: "What is the walrus operator?", options: ["==", ":=", "=>", "::"], answer: 1, explanation: ":= is the assignment expression (walrus) operator, introduced in Python 3.8." },
          { question: "How to flatten [[1,2],[3,4]] with a comprehension?", options: ["[x for x in matrix]", "[x for row in matrix for x in row]", "[row for x in matrix]", "[matrix[i][j]]"], answer: 1, explanation: "The nested for reads left-to-right: outer loop first, then inner." },
          { question: "What does {ch for ch in 'aab'} create?", options: ["{'a','a','b'}", "{'a','b'}", "['a','b']", "('a','b')"], answer: 1, explanation: "Set comprehension creates a set with unique elements." },
          { question: "Can you use if-else in a comprehension?", options: ["Only if", "Only else", "Yes: [a if c else b for ...]", "No"], answer: 2, explanation: "Ternary expressions (a if c else b) work in the expression part of comprehensions." },
        ],
      },
      {
        id: "py-typing",
        title: "Type Hints & Typing",
        description: "Add type annotations for better code.",
        content: `**Type hints** document expected types. They don't affect runtime but help tools like mypy catch bugs.\n\nBasic: \`def f(x: int) -> str:\`. Use \`typing\` module for complex types.\n\nKey types: \`Optional\`, \`Union\`, \`List\`, \`Dict\`, \`Tuple\`, \`Callable\`, \`TypeVar\`, \`Generic\`.\n\nPython 3.10+ uses \`X | Y\` instead of \`Union[X, Y]\` and built-in generics (\`list[int]\` instead of \`List[int]\`).`,
        code: `from typing import Optional, TypeVar, Generic\nfrom dataclasses import dataclass\n\n# Basic type hints\ndef greet(name: str, times: int = 1) -> str:\n    return (f"Hello, {name}! " * times).strip()\n\nprint(greet("Alice", 2))\n\n# Optional (None allowed)\ndef find_user(user_id: int) -> Optional[str]:\n    users = {1: "Alice", 2: "Bob"}\n    return users.get(user_id)\n\nprint(find_user(1))\nprint(find_user(99))\n\n# Generic class\nT = TypeVar("T")\n\n@dataclass\nclass Stack(Generic[T]):\n    items: list[T]\n    \n    def push(self, item: T) -> None:\n        self.items.append(item)\n    \n    def pop(self) -> T:\n        return self.items.pop()\n    \n    def __repr__(self) -> str:\n        return f"Stack({self.items})"\n\ns: Stack[int] = Stack([])\ns.push(1)\ns.push(2)\ns.push(3)\nprint(f"\\n{s}")\nprint(f"Popped: {s.pop()}")`,
        language: "Python",
        expectedOutput: `Hello, Alice! Hello, Alice!\nAlice\nNone\n\nStack([1, 2, 3])\nPopped: 3`,
        tips: [
          "Type hints are not enforced at runtime",
          "Use mypy for static type checking",
          "Python 3.10+: use X | Y instead of Union[X, Y]",
          "Python 3.9+: use list[int] instead of List[int]",
        ],
        questions: [
          { question: "Are type hints enforced at runtime?", options: ["Yes", "No", "Only in strict mode", "Only for functions"], answer: 1, explanation: "Type hints are for documentation and tools like mypy — Python doesn't enforce them." },
          { question: "What does Optional[int] mean?", options: ["int is optional", "int or None", "Maybe an int", "An integer parameter"], answer: 1, explanation: "Optional[int] is equivalent to Union[int, None] or int | None." },
          { question: "What tool checks type hints?", options: ["pylint", "mypy", "pytest", "black"], answer: 1, explanation: "mypy is the most popular static type checker for Python." },
          { question: "What does TypeVar do?", options: ["Creates a variable", "Defines a generic type parameter", "Checks types at runtime", "Converts types"], answer: 1, explanation: "TypeVar defines a type variable for use in generic classes and functions." },
          { question: "In Python 3.10+, how to write Union[int, str]?", options: ["int & str", "int | str", "int + str", "int, str"], answer: 1, explanation: "Python 3.10 introduced the | syntax for union types." },
        ],
      },
      {
        id: "py-async",
        title: "Async / Await",
        description: "Asynchronous programming with asyncio.",
        content: `**Async/await** enables concurrent I/O-bound tasks without threads.\n\n\`async def\` creates a coroutine. \`await\` pauses until the awaited coroutine completes.\n\n\`asyncio.gather()\` runs coroutines concurrently. \`asyncio.create_task()\` schedules coroutines.\n\nUse for network requests, file I/O, databases — NOT for CPU-bound work (use multiprocessing for that).`,
        code: `import asyncio\n\n# Simulated async operations\nasync def fetch_data(name, delay):\n    print(f"  Start fetching {name}...")\n    await asyncio.sleep(delay)\n    print(f"  Done fetching {name} ({delay}s)")\n    return f"{name}_data"\n\nasync def main():\n    # Sequential (slow)\n    print("Sequential:")\n    r1 = await fetch_data("A", 0.1)\n    r2 = await fetch_data("B", 0.1)\n    print(f"  Results: {r1}, {r2}")\n    \n    # Concurrent (fast)\n    print("\\nConcurrent:")\n    results = await asyncio.gather(\n        fetch_data("X", 0.1),\n        fetch_data("Y", 0.1),\n        fetch_data("Z", 0.1),\n    )\n    print(f"  Results: {results}")\n\nasyncio.run(main())`,
        language: "Python",
        expectedOutput: `Sequential:\n  Start fetching A...\n  Done fetching A (0.1s)\n  Start fetching B...\n  Done fetching B (0.1s)\n  Results: A_data, B_data\n\nConcurrent:\n  Start fetching X...\n  Start fetching Y...\n  Start fetching Z...\n  Done fetching X (0.1s)\n  Done fetching Y (0.1s)\n  Done fetching Z (0.1s)\n  Results: ['X_data', 'Y_data', 'Z_data']`,
        tips: [
          "async def creates a coroutine, not a regular function",
          "await can only be used inside async functions",
          "asyncio.gather runs coroutines concurrently",
          "Use asyncio for I/O-bound tasks, multiprocessing for CPU-bound",
        ],
        questions: [
          { question: "What does 'async def' create?", options: ["A thread", "A coroutine function", "A process", "A generator"], answer: 1, explanation: "async def creates a coroutine function that returns a coroutine object when called." },
          { question: "What does 'await' do?", options: ["Blocks the thread", "Pauses the coroutine and lets others run", "Starts a new thread", "Terminates the function"], answer: 1, explanation: "await suspends the coroutine, allowing the event loop to run other tasks." },
          { question: "What does asyncio.gather() do?", options: ["Collects results sequentially", "Runs coroutines concurrently", "Creates threads", "Merges lists"], answer: 1, explanation: "gather runs multiple coroutines concurrently and returns their results." },
          { question: "Is asyncio good for CPU-bound tasks?", options: ["Yes", "No — use multiprocessing", "Only with threads", "Only in Python 3.10+"], answer: 1, explanation: "asyncio is for I/O-bound tasks. CPU-bound tasks need multiprocessing to bypass the GIL." },
          { question: "What starts the async event loop?", options: ["async.start()", "asyncio.run()", "loop.begin()", "await main()"], answer: 1, explanation: "asyncio.run() creates an event loop, runs the coroutine, and closes the loop." },
        ],
      },
      {
        id: "py-metaclasses",
        title: "Metaclasses & Descriptors",
        description: "Deep Python internals for advanced users.",
        content: `**Metaclasses** are classes of classes — they control how classes are created. \`type\` is the default metaclass.\n\nUse metaclasses to: validate class definitions, auto-register classes, modify class attributes.\n\n**Descriptors** define how attribute access works. Implement \`__get__\`, \`__set__\`, \`__delete__\`.\n\nDescriptors power \`@property\`, \`@classmethod\`, \`@staticmethod\`, and \`__slots__\`.`,
        code: `# Metaclass example\nclass SingletonMeta(type):\n    _instances = {}\n    \n    def __call__(cls, *args, **kwargs):\n        if cls not in cls._instances:\n            cls._instances[cls] = super().__call__(*args, **kwargs)\n        return cls._instances[cls]\n\nclass Database(metaclass=SingletonMeta):\n    def __init__(self):\n        self.connection = "connected"\n\ndb1 = Database()\ndb2 = Database()\nprint(f"Same instance: {db1 is db2}")\n\n# Descriptor example\nclass Validated:\n    def __init__(self, min_val, max_val):\n        self.min_val = min_val\n        self.max_val = max_val\n    \n    def __set_name__(self, owner, name):\n        self.name = name\n    \n    def __get__(self, obj, objtype=None):\n        return getattr(obj, f"_{self.name}", None)\n    \n    def __set__(self, obj, value):\n        if not self.min_val <= value <= self.max_val:\n            raise ValueError(f"{self.name} must be {self.min_val}-{self.max_val}")\n        setattr(obj, f"_{self.name}", value)\n\nclass Student:\n    age = Validated(0, 150)\n    grade = Validated(0, 100)\n    \n    def __init__(self, name, age, grade):\n        self.name = name\n        self.age = age\n        self.grade = grade\n\ns = Student("Alice", 20, 95)\nprint(f"\\n{s.name}: age={s.age}, grade={s.grade}")\n\ntry:\n    s.age = 200\nexcept ValueError as e:\n    print(f"Error: {e}")`,
        language: "Python",
        expectedOutput: `Same instance: True\n\nAlice: age=20, grade=95\nError: age must be 0-150`,
        tips: [
          "type is the metaclass of all classes",
          "Metaclasses are rarely needed — prefer decorators or __init_subclass__",
          "Descriptors control attribute access behavior",
          "@property is implemented as a descriptor",
        ],
        questions: [
          { question: "What is a metaclass?", options: ["A base class", "A class whose instances are classes", "An abstract class", "A mixin"], answer: 1, explanation: "A metaclass is a class that creates and controls other classes." },
          { question: "What is the default metaclass?", options: ["object", "type", "meta", "class"], answer: 1, explanation: "type is the metaclass of all classes in Python by default." },
          { question: "What methods define a descriptor?", options: ["get/set", "__get__/__set__/__delete__", "read/write", "__enter__/__exit__"], answer: 1, explanation: "Descriptors implement __get__, __set__, and/or __delete__." },
          { question: "What built-in feature uses descriptors?", options: ["for loops", "@property", "with statements", "list comprehensions"], answer: 1, explanation: "@property is implemented as a descriptor that controls attribute access." },
          { question: "When should you use metaclasses?", options: ["Always", "For simple classes", "Rarely — for class creation control", "Never"], answer: 2, explanation: "Metaclasses are a powerful but rarely needed tool. Prefer simpler alternatives when possible." },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10. Algorithms & Problem Solving
  // ─────────────────────────────────────────────
  {
    id: "py-algorithms",
    title: "Algorithms & Problem Solving",
    icon: "⚙️",
    color: "hsl(var(--syntax-string))",
    lessons: [
      {
        id: "py-sorting",
        title: "Sorting Algorithms",
        description: "Implement and understand sorting.",
        content: `Understanding sorting algorithms is fundamental to CS.\n\n**Bubble Sort** — O(n²): Compare adjacent, swap if wrong order.\n**Merge Sort** — O(n log n): Divide, sort halves, merge.\n**Quick Sort** — O(n log n) avg: Pick pivot, partition, recurse.\n\nPython's built-in \`sorted()\` uses **Timsort** — a hybrid of merge sort and insertion sort.`,
        code: `# Merge Sort implementation\ndef merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    \n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\n# Quick Sort\ndef quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + middle + quick_sort(right)\n\ndata = [38, 27, 43, 3, 9, 82, 10]\nprint(f"Original:   {data}")\nprint(f"Merge Sort: {merge_sort(data)}")\nprint(f"Quick Sort: {quick_sort(data)}")`,
        language: "Python",
        expectedOutput: `Original:   [38, 27, 43, 3, 9, 82, 10]\nMerge Sort: [3, 9, 10, 27, 38, 43, 82]\nQuick Sort: [3, 9, 10, 27, 38, 43, 82]`,
        tips: [
          "Merge Sort: always O(n log n), stable, uses O(n) extra space",
          "Quick Sort: O(n log n) average, O(n²) worst case",
          "Python's sorted() uses Timsort: O(n log n)",
          "Use sorted(key=...) for custom sorting",
        ],
        questions: [
          { question: "What is the time complexity of Merge Sort?", options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], answer: 1, explanation: "Merge Sort always runs in O(n log n) time." },
          { question: "What is Quick Sort's worst case?", options: ["O(n)", "O(n log n)", "O(n²)", "O(2ⁿ)"], answer: 2, explanation: "Quick Sort degrades to O(n²) when the pivot is always the smallest/largest element." },
          { question: "Is Merge Sort stable?", options: ["Yes", "No", "Depends on implementation", "Only for integers"], answer: 0, explanation: "Merge Sort is stable — equal elements maintain their relative order." },
          { question: "What sorting algorithm does Python use?", options: ["Quick Sort", "Merge Sort", "Timsort", "Heap Sort"], answer: 2, explanation: "Python uses Timsort, a hybrid of merge sort and insertion sort." },
          { question: "What does 'stable sort' mean?", options: ["Never crashes", "Equal elements keep original order", "Always O(n log n)", "Uses less memory"], answer: 1, explanation: "A stable sort preserves the relative order of elements with equal keys." },
        ],
      },
      {
        id: "py-searching",
        title: "Search Algorithms",
        description: "Linear search, binary search, and beyond.",
        content: `**Linear Search** — O(n): Check every element.\n**Binary Search** — O(log n): Requires sorted array, eliminates half each step.\n\nBinary search can find insertion points, lower/upper bounds. Python's \`bisect\` module provides efficient implementations.\n\n**Two-pointer technique** is common for sorted array problems.`,
        code: `import bisect\n\n# Binary Search\ndef binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n\narr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(f"Search 23: index {binary_search(arr, 23)}")\nprint(f"Search 50: index {binary_search(arr, 50)}")\n\n# bisect module\nprint(f"\\nInsert 20 at: {bisect.bisect_left(arr, 20)}")\nprint(f"Insert 23 at: {bisect.bisect_left(arr, 23)}")\n\n# Two-pointer: pair with target sum\ndef two_sum_sorted(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo < hi:\n        s = arr[lo] + arr[hi]\n        if s == target:\n            return (lo, hi)\n        elif s < target:\n            lo += 1\n        else:\n            hi -= 1\n    return None\n\nresult = two_sum_sorted(arr, 28)\nprint(f"\\nPair summing to 28: indices {result}")\nprint(f"Values: {arr[result[0]]} + {arr[result[1]]} = 28")`,
        language: "Python",
        expectedOutput: `Search 23: index 5\nSearch 50: index -1\n\nInsert 20 at: 4\nInsert 23 at: 5\n\nPair summing to 28: indices (2, 4)\nValues: 8 + 16 = 24`,
        tips: [
          "Binary search requires a sorted array",
          "bisect module is efficient and battle-tested",
          "Two-pointer works on sorted arrays in O(n)",
          "Binary search can solve many 'find minimum/maximum' problems",
        ],
        questions: [
          { question: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], answer: 1, explanation: "Binary search halves the search space each step, giving O(log n)." },
          { question: "What does binary search require?", options: ["A linked list", "A sorted array", "A hash table", "Any array"], answer: 1, explanation: "Binary search only works on sorted sequences." },
          { question: "What module provides binary search in Python?", options: ["search", "binary", "bisect", "sort"], answer: 2, explanation: "The bisect module provides bisect_left, bisect_right, and insort." },
          { question: "What is the two-pointer technique?", options: ["Using two arrays", "Two indices moving toward each other", "Binary search variant", "Linked list operation"], answer: 1, explanation: "Two pointers start at different positions and move based on conditions." },
          { question: "What does bisect_left return?", options: ["The element", "Insertion point (leftmost)", "True/False", "The index of element"], answer: 1, explanation: "bisect_left returns the leftmost position where the element can be inserted to keep order." },
        ],
      },
      {
        id: "py-dynamic-programming",
        title: "Dynamic Programming",
        description: "Solve complex problems with memoization.",
        content: `**Dynamic Programming** solves problems by breaking them into overlapping subproblems.\n\n**Top-down (memoization)**: Recursive with caching. Use \`@functools.lru_cache\`.\n\n**Bottom-up (tabulation)**: Iterative, building from smallest subproblems.\n\nClassic DP problems: Fibonacci, knapsack, longest common subsequence, coin change.`,
        code: `from functools import lru_cache\n\n# Top-down: Fibonacci with memoization\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nprint(f"fib(30) = {fib(30)}")\nprint(f"fib(50) = {fib(50)}")\n\n# Bottom-up: Coin change\ndef coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    \n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i and dp[i - coin] + 1 < dp[i]:\n                dp[i] = dp[i - coin] + 1\n    \n    return dp[amount] if dp[amount] != float('inf') else -1\n\ncoins = [1, 5, 10, 25]\nfor amount in [11, 30, 41]:\n    print(f"  {amount}¢ needs {coin_change(coins, amount)} coins")\n\n# Longest Common Subsequence\ndef lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]\n\nprint(f"\\nLCS('ABCDE','ACE') = {lcs('ABCDE','ACE')}")`,
        language: "Python",
        expectedOutput: `fib(30) = 832040\nfib(50) = 12586269025\n  11¢ needs 2 coins\n  30¢ needs 2 coins\n  41¢ needs 4 coins\n\nLCS('ABCDE','ACE') = 3`,
        tips: [
          "@lru_cache makes memoization trivial",
          "Bottom-up is usually more space efficient",
          "Identify overlapping subproblems and optimal substructure",
          "Draw the recurrence relation before coding",
        ],
        questions: [
          { question: "What are the two DP approaches?", options: ["Fast and slow", "Top-down (memo) and bottom-up (tabulation)", "Recursive and iterative only", "Greedy and brute force"], answer: 1, explanation: "DP uses memoization (top-down recursive) or tabulation (bottom-up iterative)." },
          { question: "What does @lru_cache do?", options: ["Speeds up loops", "Caches function return values", "Creates a database", "Compresses data"], answer: 1, explanation: "lru_cache memoizes function results, avoiding redundant computation." },
          { question: "What makes a problem suitable for DP?", options: ["It's recursive", "Overlapping subproblems + optimal substructure", "It uses arrays", "It's slow"], answer: 1, explanation: "DP applies when a problem has overlapping subproblems and optimal substructure." },
          { question: "What is the naive Fibonacci time complexity?", options: ["O(n)", "O(n²)", "O(2ⁿ)", "O(log n)"], answer: 2, explanation: "Without memoization, Fibonacci is O(2ⁿ) due to redundant recursive calls." },
          { question: "With memoization, what is Fibonacci's complexity?", options: ["O(2ⁿ)", "O(n²)", "O(n)", "O(log n)"], answer: 2, explanation: "Memoization ensures each subproblem is computed only once, giving O(n)." },
        ],
      },
    ],
  },
];
