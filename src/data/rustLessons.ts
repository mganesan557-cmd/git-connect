import { Topic } from "./pythonLessons";

export const rustTopics: Topic[] = [
  {
    id: "rust-fundamentals",
    title: "Rust Fundamentals",
    icon: "RS",
    color: "hsl(var(--syntax-operator))",
    lessons: [
      {
        id: "rust-ownership",
        title: "Ownership, Borrowing, and Result",
        description: "Memory safety without garbage collection.",
        content: `Rust's ownership model gives memory safety at compile time.

Key ideas:
- One owner per value
- Immutable/mutable borrows
- \`Result\` for recoverable errors
- Pattern matching with \`match\``,
        code: `fn divide(a: f64, b: f64) -> Result<f64, String> {\n    if b == 0.0 {\n        Err(\"cannot divide by zero\".to_string())\n    } else {\n        Ok(a / b)\n    }\n}\n\nfn main() {\n    let name = String::from(\"Alice\");\n    let name_ref = &name;\n    println!(\"{}\", name_ref);\n\n    match divide(10.0, 2.0) {\n        Ok(v) => println!(\"{}\", v),\n        Err(e) => println!(\"error: {}\", e),\n    }\n\n    match divide(5.0, 0.0) {\n        Ok(v) => println!(\"{}\", v),\n        Err(e) => println!(\"error: {}\", e),\n    }\n}`,
        language: "Rust",
        expectedOutput: `Alice\n5\nerror: cannot divide by zero`,
        tips: [
          "Use references to borrow without moving ownership.",
          "Use `Result` instead of panicking for expected failures.",
          "`match` enforces exhaustive handling.",
          "Compiler errors often teach ownership boundaries.",
        ],
        questions: [
          { question: "What is Rust ownership mainly for?", options: ["GUI rendering", "Compile-time memory safety", "Dynamic typing", "Runtime reflection"], answer: 1, explanation: "Ownership prevents many memory bugs at compile time." },
          { question: "What does `&value` create?", options: ["Move", "Borrow/reference", "Clone", "Drop"], answer: 1, explanation: "Prefix `&` borrows a reference." },
          { question: "When to use `Result<T, E>`?", options: ["Only async", "Recoverable errors", "Type casting", "Collections"], answer: 1, explanation: "Result models success/failure that caller can handle." },
          { question: "`match` in Rust is...", options: ["Optional", "Exhaustive by design", "String-only", "Deprecated"], answer: 1, explanation: "All possible variants must be covered." },
          { question: "Which statement is true?", options: ["Rust has GC", "Rust has no ownership checks", "Rust uses ownership + borrowing model", "Rust is dynamically typed"], answer: 2, explanation: "Ownership and borrowing are core Rust features." },
        ],
      },
    ],
  },
];
