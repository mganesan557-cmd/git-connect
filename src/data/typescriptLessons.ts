import { Topic } from "./pythonLessons";

export const typescriptTopics: Topic[] = [
  {
    id: "ts-fundamentals",
    title: "TypeScript Fundamentals",
    icon: "TS",
    color: "hsl(var(--syntax-type))",
    lessons: [
      {
        id: "ts-types-interfaces",
        title: "Types, Interfaces, and Functions",
        description: "Strong typing basics for safer JavaScript.",
        content: `TypeScript adds static types on top of JavaScript. This helps catch bugs before runtime.

Core pieces:
- Primitive and union types
- Interfaces for object contracts
- Typed function parameters/returns
- Optional properties and readonly fields`,
        code: `interface User {\n  id: number;\n  name: string;\n  email?: string;\n  readonly role: "admin" | "user";\n}\n\nfunction greet(user: User): string {\n  return \`Hello, \${user.name}\`;\n}\n\nconst alice: User = {\n  id: 1,\n  name: "Alice",\n  role: "admin",\n};\n\nconsole.log(greet(alice));\n\nfunction sum(a: number, b: number): number {\n  return a + b;\n}\n\nconsole.log(sum(5, 7));`,
        language: "TypeScript",
        expectedOutput: `Hello, Alice\n12`,
        tips: [
          "Use union types for controlled value sets.",
          "Optional fields use `?`.",
          "Prefer interfaces/types over `any`.",
          "Keep function return types explicit in shared code.",
        ],
        questions: [
          { question: "What does `email?: string` mean?", options: ["email is required string", "email is optional string", "email can only be null", "email is number"], answer: 1, explanation: "`?` marks the property as optional." },
          { question: "Why use TypeScript?", options: ["Faster runtime", "Compile-time safety and better tooling", "No need for tests", "Removes JavaScript"], answer: 1, explanation: "TypeScript improves reliability and DX via static analysis." },
          { question: "What does `role: \"admin\" | \"user\"` represent?", options: ["Bitwise OR", "Union of allowed string literals", "Boolean", "Enum import"], answer: 1, explanation: "This restricts role to one of the listed literal values." },
          { question: "What keyword prevents reassignment for object property?", options: ["final", "readonly", "const", "sealed"], answer: 1, explanation: "`readonly` prevents property reassignment after initialization." },
          { question: "Best replacement for `any` in uncertain value handling?", options: ["never", "unknown", "void", "null"], answer: 1, explanation: "`unknown` forces type narrowing before unsafe use." },
        ],
      },
    ],
  },
];

