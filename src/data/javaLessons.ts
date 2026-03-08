import { Topic } from "./pythonLessons";

export const javaTopics: Topic[] = [
  {
    id: "java-basics",
    title: "Java Basics",
    icon: "☕",
    color: "hsl(var(--syntax-keyword))",
    lessons: [
      {
        id: "java-hello",
        title: "Hello World & main()",
        description: "Your first Java program.",
        content: `Java is a **statically typed**, compiled language. Every Java program needs a \`class\` and a \`main\` method.\n\nThe \`main\` method signature is always: \`public static void main(String[] args)\`.\n\nJava uses \`System.out.println()\` for output and requires semicolons at the end of statements.`,
        code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n        \n        // Print without newline\n        System.out.print("Hello ");\n        System.out.println("Java!");\n        \n        // Formatted output\n        String name = "Alice";\n        int age = 25;\n        System.out.printf("%s is %d years old%n", name, age);\n    }\n}`,
        language: "Java",
        expectedOutput: `Hello, World!\nHello Java!\nAlice is 25 years old`,
        tips: [
          "Every Java file must have a class",
          "main() is the entry point for all Java programs",
          "println adds newline, print does not",
          "printf supports formatted output like C",
        ],
        questions: [
          { question: "What is the entry point of a Java program?", options: ["start()", "run()", "main()", "init()"], answer: 2, explanation: "The main method is the entry point: public static void main(String[] args)." },
          { question: "What does println do differently from print?", options: ["Nothing", "Adds a newline", "Prints in color", "Is faster"], answer: 1, explanation: "println adds a newline character at the end." },
          { question: "Is Java statically or dynamically typed?", options: ["Dynamically typed", "Statically typed", "Both", "Neither"], answer: 1, explanation: "Java requires explicit type declarations at compile time." },
          { question: "What must every Java file contain?", options: ["A function", "A class", "A package", "An interface"], answer: 1, explanation: "Every Java file must contain at least one class." },
          { question: "What ends most Java statements?", options: ["Newline", "Colon", "Semicolon", "Period"], answer: 2, explanation: "Java statements must end with a semicolon." },
        ],
      },
      {
        id: "java-variables",
        title: "Variables & Data Types",
        description: "Primitive and reference types in Java.",
        content: `Java has 8 **primitive types**: byte, short, int, long, float, double, char, boolean.\n\nAll other types are **reference types** (objects). Wrapper classes like \`Integer\`, \`Double\` provide object versions of primitives.\n\n**Type casting**: Widening (automatic) and narrowing (manual with cast).`,
        code: `public class Main {\n    public static void main(String[] args) {\n        // Primitives\n        int count = 42;\n        double pi = 3.14159;\n        char letter = 'A';\n        boolean active = true;\n        long bigNum = 9876543210L;\n        \n        System.out.println("int: " + count);\n        System.out.println("double: " + pi);\n        System.out.println("char: " + letter);\n        System.out.println("boolean: " + active);\n        \n        // Type casting\n        double d = count;        // widening (auto)\n        int i = (int) 3.99;     // narrowing (manual)\n        System.out.println("Widened: " + d);\n        System.out.println("Narrowed: " + i);\n        \n        // Wrapper classes\n        Integer wrapped = 42;    // autoboxing\n        int unwrapped = wrapped; // unboxing\n        System.out.println("Wrapped: " + wrapped);\n    }\n}`,
        language: "Java",
        expectedOutput: `int: 42\ndouble: 3.14159\nchar: A\nboolean: true\nWidened: 42.0\nNarrowed: 3\nWrapped: 42`,
        tips: [
          "Use int for most integers, double for decimals",
          "long literals need the L suffix",
          "Narrowing casts truncate, not round",
          "Autoboxing converts primitives to wrapper objects automatically",
        ],
        questions: [
          { question: "How many primitive types does Java have?", options: ["4", "6", "8", "10"], answer: 2, explanation: "Java has 8 primitives: byte, short, int, long, float, double, char, boolean." },
          { question: "What does (int) 3.99 produce?", options: ["4", "3", "3.99", "Error"], answer: 1, explanation: "Narrowing cast truncates — it removes the decimal part." },
          { question: "What is autoboxing?", options: ["Array creation", "Auto primitive-to-wrapper conversion", "Auto import", "Loop optimization"], answer: 1, explanation: "Autoboxing automatically converts primitives to their wrapper classes." },
          { question: "Which suffix do long literals need?", options: ["l or L", "n or N", "d or D", "No suffix"], answer: 0, explanation: "Long literals require L suffix: long x = 123456789L." },
          { question: "Is String a primitive in Java?", options: ["Yes", "No — it's a reference type", "It's both", "Depends"], answer: 1, explanation: "String is a reference type (object), not a primitive." },
        ],
      },
      {
        id: "java-control",
        title: "Control Flow",
        description: "If/else, switch, and loops in Java.",
        content: `Java supports \`if\`/\`else if\`/\`else\`, \`switch\`, \`for\`, \`while\`, and \`do-while\` loops.\n\nThe enhanced \`for-each\` loop iterates over arrays and collections: \`for (Type item : collection)\`.\n\nJava 14+ supports **switch expressions** with arrow syntax.`,
        code: `public class Main {\n    public static void main(String[] args) {\n        // If/else\n        int score = 85;\n        String grade;\n        if (score >= 90) grade = "A";\n        else if (score >= 80) grade = "B";\n        else grade = "C";\n        System.out.println("Grade: " + grade);\n        \n        // For loop\n        for (int i = 0; i < 5; i++) {\n            System.out.print(i + " ");\n        }\n        System.out.println();\n        \n        // For-each\n        String[] fruits = {"apple", "banana", "cherry"};\n        for (String fruit : fruits) {\n            System.out.println("  " + fruit);\n        }\n        \n        // While\n        int n = 1;\n        while (n <= 3) {\n            System.out.println(n + " squared = " + (n * n));\n            n++;\n        }\n    }\n}`,
        language: "Java",
        expectedOutput: `Grade: B\n0 1 2 3 4\n  apple\n  banana\n  cherry\n1 squared = 1\n2 squared = 4\n3 squared = 9`,
        tips: [
          "for-each is cleaner than indexed for loops for collections",
          "switch can use strings since Java 7",
          "break exits loops, continue skips to next iteration",
          "Use enhanced for when you don't need the index",
        ],
        questions: [
          { question: "What does 'for (String s : arr)' do?", options: ["Creates strings", "Iterates over array elements", "Sorts the array", "Searches the array"], answer: 1, explanation: "Enhanced for-each iterates over each element in the array." },
          { question: "What does break do in a loop?", options: ["Pauses", "Exits the loop", "Skips iteration", "Restarts"], answer: 1, explanation: "break immediately exits the loop." },
          { question: "Can switch compare Strings in Java?", options: ["Yes (since Java 7)", "No", "Only with equals()", "Only chars"], answer: 0, explanation: "Since Java 7, switch statements can compare String values." },
          { question: "When does do-while check its condition?", options: ["Before first run", "After each run", "Never", "Only once"], answer: 1, explanation: "do-while checks the condition after each iteration, guaranteeing at least one run." },
          { question: "What does continue do?", options: ["Exits loop", "Skips to next iteration", "Restarts loop", "Nothing"], answer: 1, explanation: "continue skips the rest of the current iteration." },
        ],
      },
    ],
  },
  {
    id: "java-oop",
    title: "Object-Oriented Programming",
    icon: "🏗️",
    color: "hsl(var(--syntax-type))",
    lessons: [
      {
        id: "java-classes",
        title: "Classes & Objects",
        description: "Define and use classes in Java.",
        content: `Java is an object-oriented language. A **class** is a blueprint; an **object** is an instance.\n\nClasses have **fields** (data), **constructors** (initialization), and **methods** (behavior).\n\nAccess modifiers: \`public\`, \`private\`, \`protected\`, default (package-private).\n\nUse **encapsulation**: private fields with public getters/setters.`,
        code: `class Person {\n    private String name;\n    private int age;\n    \n    public Person(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n    \n    public String getName() { return name; }\n    public int getAge() { return age; }\n    \n    public String greet() {\n        return "Hi, I'm " + name + ", age " + age;\n    }\n    \n    @Override\n    public String toString() {\n        return "Person(" + name + ", " + age + ")";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Person p = new Person("Alice", 25);\n        System.out.println(p.greet());\n        System.out.println(p.toString());\n        System.out.println(p.getName());\n    }\n}`,
        language: "Java",
        expectedOutput: `Hi, I'm Alice, age 25\nPerson(Alice, 25)\nAlice`,
        tips: [
          "Use private fields with public getters/setters (encapsulation)",
          "this refers to the current object",
          "Override toString() for readable object output",
          "@Override annotation helps catch typos in method names",
        ],
        questions: [
          { question: "What is a constructor?", options: ["A getter method", "A special method that initializes objects", "A static method", "A destructor"], answer: 1, explanation: "Constructors initialize new objects and have the same name as the class." },
          { question: "What does 'this' refer to?", options: ["The class", "The current object", "The parent class", "The main method"], answer: 1, explanation: "'this' refers to the current object instance." },
          { question: "What does private mean?", options: ["Accessible everywhere", "Accessible only within the class", "Accessible in package", "Accessible in subclasses"], answer: 1, explanation: "private members are only accessible within the declaring class." },
          { question: "What is encapsulation?", options: ["Inheritance", "Hiding data behind methods", "Polymorphism", "Abstraction"], answer: 1, explanation: "Encapsulation hides internal data and exposes it through methods." },
          { question: "What does new Person() do?", options: ["Declares a class", "Creates an instance", "Defines a method", "Imports a class"], answer: 1, explanation: "new creates a new instance of the class by calling its constructor." },
        ],
      },
      {
        id: "java-inheritance",
        title: "Inheritance & Polymorphism",
        description: "Extend classes and use polymorphism.",
        content: `**Inheritance** lets a class inherit fields and methods from a parent class using \`extends\`.\n\nJava supports single inheritance only (one parent class), but multiple interfaces.\n\n**Polymorphism** allows treating objects of different types uniformly. Method **overriding** provides specific implementations in subclasses.`,
        code: `class Animal {\n    protected String name;\n    \n    public Animal(String name) {\n        this.name = name;\n    }\n    \n    public String speak() {\n        return name + " makes a sound";\n    }\n}\n\nclass Dog extends Animal {\n    public Dog(String name) {\n        super(name);\n    }\n    \n    @Override\n    public String speak() {\n        return name + " says Woof!";\n    }\n    \n    public String fetch(String item) {\n        return name + " fetches " + item;\n    }\n}\n\nclass Cat extends Animal {\n    public Cat(String name) {\n        super(name);\n    }\n    \n    @Override\n    public String speak() {\n        return name + " says Meow!";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Animal[] animals = { new Dog("Rex"), new Cat("Whiskers") };\n        for (Animal a : animals) {\n            System.out.println(a.speak()); // polymorphism\n        }\n        Dog d = new Dog("Buddy");\n        System.out.println(d.fetch("ball"));\n    }\n}`,
        language: "Java",
        expectedOutput: `Rex says Woof!\nWhiskers says Meow!\nBuddy fetches ball`,
        tips: [
          "Use super() to call parent constructor",
          "Java supports single class inheritance only",
          "@Override ensures you're actually overriding a method",
          "Polymorphism: parent reference can hold child objects",
        ],
        questions: [
          { question: "What keyword enables inheritance?", options: ["implements", "extends", "inherits", "super"], answer: 1, explanation: "extends creates a child class that inherits from a parent." },
          { question: "What does super() do?", options: ["Calls parent constructor", "Creates parent object", "Returns parent", "Nothing"], answer: 0, explanation: "super() calls the parent class constructor." },
          { question: "Can Java extend multiple classes?", options: ["Yes", "No — single inheritance only", "Only abstract classes", "Only interfaces"], answer: 1, explanation: "Java supports single class inheritance but multiple interface implementation." },
          { question: "What is polymorphism?", options: ["Multiple constructors", "One interface, many forms", "Private methods", "Static typing"], answer: 1, explanation: "Polymorphism allows objects to be treated as their parent type." },
          { question: "What does @Override do?", options: ["Creates a new method", "Verifies method overrides parent", "Makes method static", "Deletes parent method"], answer: 1, explanation: "@Override is a compile-time check that ensures the method overrides a parent method." },
        ],
      },
    ],
  },
  {
    id: "java-problem-solving",
    title: "Problem Solving in Java",
    icon: "🧠",
    color: "hsl(var(--syntax-string))",
    lessons: [
      {
        id: "java-collections-patterns",
        title: "Collections Patterns (Map, Set, PriorityQueue)",
        description: "Use core Java collections for efficient algorithmic solutions.",
        content: `Strong Java interview solutions usually depend on correct collection choice:

- **HashMap** for frequency/count/index lookup
- **HashSet** for O(1) membership checks
- **PriorityQueue** for top-k and greedy extraction problems

Patterns to master:
1. Frequency map for counting and duplicate handling
2. Min-heap of size k for top-k largest elements
3. Set-backed detection for linear-time existence problems`,
        code: `import java.util.*;\n\npublic class Main {\n    public static int[] topKFrequent(int[] nums, int k) {\n        Map<Integer, Integer> freq = new HashMap<>();\n        for (int n : nums) {\n            freq.put(n, freq.getOrDefault(n, 0) + 1);\n        }\n\n        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));\n        for (var e : freq.entrySet()) {\n            pq.offer(new int[]{e.getKey(), e.getValue()});\n            if (pq.size() > k) pq.poll();\n        }\n\n        int[] ans = new int[k];\n        for (int i = k - 1; i >= 0; i--) {\n            ans[i] = pq.poll()[0];\n        }\n        return ans;\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {1,1,1,2,2,3,3,3,4,4,5};\n        System.out.println(Arrays.toString(topKFrequent(nums, 2)));\n\n        Set<Integer> seen = new HashSet<>();\n        int[] arr = {10, 7, 3, 10, 5};\n        for (int x : arr) {\n            if (!seen.add(x)) {\n                System.out.println(\"Duplicate found: \" + x);\n                break;\n            }\n        }\n    }\n}`,
        language: "Java",
        expectedOutput: `[1, 3]\nDuplicate found: 10`,
        tips: [
          "Use getOrDefault for concise frequency logic.",
          "Min-heap of size k is often better than sorting whole dataset.",
          "HashSet.add returns false when element already exists.",
          "Prefer interface types (`Map`, `Set`, `List`) in declarations.",
        ],
        questions: [
          { question: "Why use min-heap of size k for top-k frequent?", options: ["To sort entire map faster", "To keep only best k candidates in O(n log k)", "Because max-heap is unavailable", "To avoid maps"], answer: 1, explanation: "Heap size stays bounded by k, reducing time from full sorting." },
          { question: "HashSet membership average complexity?", options: ["O(n)", "O(log n)", "O(1)", "O(k)"], answer: 2, explanation: "Hash-based lookup is average O(1)." },
          { question: "Best collection for counting occurrences?", options: ["ArrayList", "HashMap", "TreeSet", "Queue"], answer: 1, explanation: "HashMap maps value -> count efficiently." },
          { question: "PriorityQueue in Java is by default...", options: ["Max-heap", "Min-heap", "Random heap", "Stable queue"], answer: 1, explanation: "Java PriorityQueue orders smallest element first by default." },
          { question: "When is TreeMap preferred over HashMap?", options: ["Need insertion order", "Need sorted keys", "Need O(1) operations", "Need less memory always"], answer: 1, explanation: "TreeMap maintains keys in sorted order (O(log n) operations)." },
        ],
        examples: [
          {
            title: "Two Sum with HashMap",
            explanation: "Single pass storing seen values and their indices.",
            code: `import java.util.*;\n\nclass TwoSum {\n    static int[] solve(int[] nums, int target) {\n        Map<Integer, Integer> idx = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int need = target - nums[i];\n            if (idx.containsKey(need)) return new int[]{idx.get(need), i};\n            idx.put(nums[i], i);\n        }\n        return new int[]{-1, -1};\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(solve(new int[]{2,7,11,15}, 9)));\n    }\n}`,
            expectedOutput: `[0, 1]`,
          },
        ],
        advancedQuestions: [
          { question: "For streaming top-k frequent with very large domain, scalable approach?", options: ["Sort every time", "Maintain frequency map + bounded heap, possibly with periodic pruning", "Use recursion", "Use linked list only"], answer: 1, explanation: "Streaming needs incremental counts and bounded candidate structure." },
          { question: "Why can HashMap operations degrade from O(1) average?", options: ["JIT disabled", "Hash collisions and adversarial keys", "Low RAM only", "Using generics"], answer: 1, explanation: "Poor hash distribution can increase bucket chain/tree work." },
        ],
      },
    ],
  },
];
