import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const examples = [
  // Python
  { title: "For Loop Basics", language: "Python", category: "Loops", code: "for i in range(5):\n    print(i)" },
  { title: "Recursion: Factorial", language: "Python", category: "Recursion", code: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)\n\nprint(factorial(5))" },
  { title: "Binary Search", language: "Python", category: "Searching", code: "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(binary_search([1,3,5,7,9], 7))" },
  { title: "Stack Implementation", language: "Python", category: "Data Structures", code: "class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        return self.items.pop()\n    def peek(self):\n        return self.items[-1]\n\ns = Stack()\ns.push(1)\ns.push(2)\nprint(s.pop())" },
  { title: "List Comprehension", language: "Python", category: "Basics", code: "squares = [x**2 for x in range(10)]\nevens = [x for x in squares if x % 2 == 0]\nprint(squares)\nprint(evens)" },

  // JavaScript
  { title: "Bubble Sort", language: "JavaScript", category: "Sorting", code: "function bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++)\n    for (let j = 0; j < arr.length - i - 1; j++)\n      if (arr[j] > arr[j+1])\n        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n  return arr;\n}\nconsole.log(bubbleSort([5,3,8,1,2]));" },
  { title: "Closures", language: "JavaScript", category: "Functions", code: "function counter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    getCount: () => count\n  };\n}\n\nconst c = counter();\nc.increment();\nc.increment();\nconsole.log(c.getCount());" },
  { title: "Promises & Async", language: "JavaScript", category: "Async", code: "function delay(ms) {\n  return new Promise(resolve => {\n    setTimeout(() => resolve(ms), ms);\n  });\n}\n\nasync function main() {\n  const result = await delay(1000);\n  console.log('Waited ' + result + 'ms');\n}\n\nmain();" },

  // TypeScript
  { title: "Generics", language: "TypeScript", category: "Types", code: "function identity<T>(arg: T): T {\n  return arg;\n}\n\nconst num = identity<number>(42);\nconst str = identity<string>('hello');\nconsole.log(num, str);" },
  { title: "Interfaces & Classes", language: "TypeScript", category: "OOP", code: "interface Shape {\n  area(): number;\n}\n\nclass Circle implements Shape {\n  constructor(private radius: number) {}\n  area(): number {\n    return Math.PI * this.radius ** 2;\n  }\n}\n\nconst c = new Circle(5);\nconsole.log(c.area().toFixed(2));" },

  // Java
  { title: "Inheritance", language: "Java", category: "OOP", code: "class Animal {\n  String name;\n  Animal(String name) { this.name = name; }\n  void speak() { System.out.println(name + \" makes a sound\"); }\n}\n\nclass Dog extends Animal {\n  Dog(String name) { super(name); }\n  void speak() { System.out.println(name + \" barks\"); }\n}\n\npublic class Main {\n  public static void main(String[] args) {\n    Animal a = new Dog(\"Rex\");\n    a.speak();\n  }\n}" },
  { title: "ArrayList & Loops", language: "Java", category: "Collections", code: "import java.util.ArrayList;\n\npublic class Main {\n  public static void main(String[] args) {\n    ArrayList<String> list = new ArrayList<>();\n    list.add(\"Apple\");\n    list.add(\"Banana\");\n    list.add(\"Cherry\");\n    for (String fruit : list) {\n      System.out.println(fruit);\n    }\n  }\n}" },

  // C
  { title: "Pointers", language: "C", category: "Memory", code: "#include <stdio.h>\n\nint main() {\n    int x = 10;\n    int *ptr = &x;\n    printf(\"Value: %d\\n\", *ptr);\n    *ptr = 20;\n    printf(\"New value: %d\\n\", x);\n    return 0;\n}" },

  // C++
  { title: "Vectors & Iterators", language: "C++", category: "STL", code: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> v = {5, 3, 8, 1, 2};\n    sort(v.begin(), v.end());\n    for (auto it = v.begin(); it != v.end(); ++it) {\n        cout << *it << \" \";\n    }\n    return 0;\n}" },

  // Go
  { title: "Goroutines & Channels", language: "Go", category: "Concurrency", code: "package main\n\nimport \"fmt\"\n\nfunc sum(nums []int, ch chan int) {\n    total := 0\n    for _, n := range nums {\n        total += n\n    }\n    ch <- total\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4, 5}\n    ch := make(chan int)\n    go sum(nums[:3], ch)\n    go sum(nums[3:], ch)\n    a, b := <-ch, <-ch\n    fmt.Println(a + b)\n}" },
  { title: "Structs & Methods", language: "Go", category: "Basics", code: "package main\n\nimport \"fmt\"\n\ntype Rectangle struct {\n    Width, Height float64\n}\n\nfunc (r Rectangle) Area() float64 {\n    return r.Width * r.Height\n}\n\nfunc main() {\n    r := Rectangle{Width: 5, Height: 3}\n    fmt.Println(\"Area:\", r.Area())\n}" },

  // Rust
  { title: "Ownership & Borrowing", language: "Rust", category: "Memory", code: "fn main() {\n    let s1 = String::from(\"hello\");\n    let s2 = &s1;\n    println!(\"s1: {}, s2: {}\", s1, s2);\n    \n    let mut s3 = String::from(\"world\");\n    change(&mut s3);\n    println!(\"s3: {}\", s3);\n}\n\nfn change(s: &mut String) {\n    s.push_str(\"!\");\n}" },
  { title: "Pattern Matching", language: "Rust", category: "Control Flow", code: "fn main() {\n    let x = 5;\n    match x {\n        1 => println!(\"one\"),\n        2..=4 => println!(\"two to four\"),\n        5 => println!(\"five!\"),\n        _ => println!(\"other\"),\n    }\n}" },

  // Ruby
  { title: "Blocks & Iterators", language: "Ruby", category: "Basics", code: "numbers = [1, 2, 3, 4, 5]\n\ndoubled = numbers.map { |n| n * 2 }\nputs doubled.inspect\n\nsum = numbers.reduce(0) { |acc, n| acc + n }\nputs \"Sum: #{sum}\"" },

  // PHP
  { title: "Arrays & Functions", language: "PHP", category: "Basics", code: "<?php\nfunction reverseArray($arr) {\n    $result = [];\n    for ($i = count($arr) - 1; $i >= 0; $i--) {\n        $result[] = $arr[$i];\n    }\n    return $result;\n}\n\n$nums = [1, 2, 3, 4, 5];\nprint_r(reverseArray($nums));\n?>" },

  // Kotlin
  { title: "Data Classes & When", language: "Kotlin", category: "Basics", code: "data class User(val name: String, val age: Int)\n\nfun greet(user: User): String = when {\n    user.age < 18 -> \"Hey ${user.name}!\"\n    user.age < 65 -> \"Hello ${user.name}.\"\n    else -> \"Good day, ${user.name}.\"\n}\n\nfun main() {\n    val users = listOf(User(\"Alice\", 15), User(\"Bob\", 30))\n    users.forEach { println(greet(it)) }\n}" },

  // Swift
  { title: "Optionals & Guard", language: "Swift", category: "Safety", code: "func greet(name: String?) -> String {\n    guard let name = name else {\n        return \"Hello, stranger!\"\n    }\n    return \"Hello, \\(name)!\"\n}\n\nprint(greet(name: \"Alice\"))\nprint(greet(name: nil))" },
];

const categoryColors: Record<string, string> = {
  Loops: "bg-primary/10 text-primary",
  Recursion: "bg-destructive/10 text-destructive",
  Sorting: "bg-warning/10 text-warning-foreground",
  Searching: "bg-success/10 text-success-foreground",
  "Data Structures": "bg-accent text-accent-foreground",
  Basics: "bg-secondary text-secondary-foreground",
  Functions: "bg-primary/10 text-primary",
  Async: "bg-warning/10 text-warning-foreground",
  Types: "bg-success/10 text-success-foreground",
  OOP: "bg-destructive/10 text-destructive",
  Collections: "bg-accent text-accent-foreground",
  Memory: "bg-destructive/10 text-destructive",
  STL: "bg-primary/10 text-primary",
  Concurrency: "bg-warning/10 text-warning-foreground",
  "Control Flow": "bg-success/10 text-success-foreground",
  Safety: "bg-accent text-accent-foreground",
};

const ExamplesPage = () => {
  const allLanguages = [...new Set(examples.map((e) => e.language))];

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display tracking-tight mb-1">Examples</h1>
        <p className="text-muted-foreground font-display mb-2">
          Curated programs across {allLanguages.length} languages to learn programming concepts
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {allLanguages.map((lang) => (
            <span key={lang} className="text-xs font-mono px-2 py-1 rounded-lg bg-secondary text-muted-foreground">
              {lang}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {examples.map((example, i) => (
          <motion.div
            key={example.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              to={`/visualizer?lang=${encodeURIComponent(example.language)}&code=${encodeURIComponent(example.code)}`}
              className="glass-card p-5 block group hover:border-foreground/20 transition-colors h-full"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${categoryColors[example.category] || "bg-secondary text-secondary-foreground"}`}>
                  {example.category}
                </span>
                <span className="text-xs font-mono text-muted-foreground">{example.language}</span>
              </div>
              <h3 className="font-display font-semibold mb-2 text-sm">{example.title}</h3>
              <pre className="text-xs font-mono text-muted-foreground line-clamp-3 mb-3">{example.code}</pre>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-foreground transition-colors font-display">
                <Play className="h-3.5 w-3.5" /> Open in Visualizer
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExamplesPage;
