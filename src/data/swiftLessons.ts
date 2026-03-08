import { Topic } from "./pythonLessons";

export const swiftTopics: Topic[] = [
  {
    id: "swift-fundamentals",
    title: "Swift Fundamentals",
    icon: "SW",
    color: "hsl(var(--syntax-string))",
    lessons: [
      {
        id: "swift-optionals-structs",
        title: "Optionals, Structs, and Functions",
        description: "Write safe Swift with optionals and value types.",
        content: `Swift emphasizes safety and clarity.

Focus points:
- Optionals and \`guard let\`
- Struct-based modeling
- Function signatures with explicit types
- Safe nil handling`,
        code: `struct User {\n    let name: String\n    var age: Int\n}\n\nfunc greet(_ user: User?) -> String {\n    guard let u = user else {\n        return \"No user\"\n    }\n    return \"Hello, \\(u.name)!\"\n}\n\nlet alice = User(name: \"Alice\", age: 25)\nprint(greet(alice))\nprint(greet(nil))\n\nfunc nextYearAge(_ age: Int) -> Int {\n    age + 1\n}\n\nprint(nextYearAge(alice.age))`,
        language: "Swift",
        expectedOutput: `Hello, Alice!\nNo user\n26`,
        tips: [
          "Use `guard let` for early-exit optional unwrapping.",
          "Structs are value types (copied on assignment).",
          "Prefer immutable `let` when possible.",
          "Avoid force unwrap `!` unless guaranteed safe.",
        ],
        questions: [
          { question: "What is an Optional in Swift?", options: ["A class", "A value that may be nil", "A generic loop", "An enum case only"], answer: 1, explanation: "Optional wraps a value that can be present or nil." },
          { question: "Why use `guard let`?", options: ["For loops", "Safe unwrapping with early return", "Type casting only", "Memory allocation"], answer: 1, explanation: "`guard let` unwraps and exits early when nil." },
          { question: "Structs in Swift are...", options: ["Reference types", "Value types", "Always mutable", "Deprecated"], answer: 1, explanation: "Structs are value types by default." },
          { question: "Best practice for constants?", options: ["Always var", "Prefer let", "Use global mutable state", "Only in classes"], answer: 1, explanation: "`let` makes intent and safety clearer." },
          { question: "What does `greet(nil)` return in this lesson?", options: ["Empty string", "No user", "Crash", "nil"], answer: 1, explanation: "Function handles nil path explicitly with guard." },
        ],
      },
    ],
  },
];
