import { Topic } from "./pythonLessons";

export const goTopics: Topic[] = [
  {
    id: "go-fundamentals",
    title: "Go Fundamentals",
    icon: "GO",
    color: "hsl(var(--syntax-function))",
    lessons: [
      {
        id: "go-structs-methods",
        title: "Structs, Methods, and Error Handling",
        description: "Core Go style with explicit errors.",
        content: `Go encourages simple, explicit code.

Concepts in this lesson:
- Struct definitions
- Receiver methods
- Multiple return values
- Explicit error handling`,
        code: `package main\n\nimport (\n  \"errors\"\n  \"fmt\"\n)\n\ntype Account struct {\n  Name string\n  Balance float64\n}\n\nfunc (a *Account) Deposit(x float64) {\n  a.Balance += x\n}\n\nfunc Withdraw(a *Account, x float64) error {\n  if x > a.Balance {\n    return errors.New(\"insufficient funds\")\n  }\n  a.Balance -= x\n  return nil\n}\n\nfunc main() {\n  acc := Account{Name: \"Alice\", Balance: 100}\n  acc.Deposit(25)\n  fmt.Println(acc.Balance)\n\n  if err := Withdraw(&acc, 60); err != nil {\n    fmt.Println(\"error:\", err)\n  }\n  fmt.Println(acc.Balance)\n}`,
        language: "Go",
        expectedOutput: `125\n65`,
        tips: [
          "Return errors as values, don't hide them.",
          "Use pointer receivers when mutating structs.",
          "Short variable declaration `:=` is idiomatic.",
          "Keep functions small and explicit.",
        ],
        questions: [
          { question: "Why use pointer receiver `*Account`?", options: ["Faster print", "Mutate original struct", "Required by compiler", "Avoid imports"], answer: 1, explanation: "Pointer receiver lets method update original value." },
          { question: "How does Go typically signal failures?", options: ["Exceptions", "panic only", "Returned error values", "global error state"], answer: 2, explanation: "Go primarily uses explicit error returns." },
          { question: "What does `:=` do?", options: ["Type cast", "Short declaration with inference", "Comparison", "Package import"], answer: 1, explanation: "`:=` declares and initializes variable with inferred type." },
          { question: "Which is idiomatic for optional failure in Go?", options: ["throw", "try/catch", "if err != nil", "finally"], answer: 2, explanation: "Go checks errors with `if err != nil`." },
          { question: "Are methods allowed on structs in Go?", options: ["No", "Yes via receiver syntax", "Only interfaces", "Only pointers"], answer: 1, explanation: "Go supports methods with receiver parameters." },
        ],
      },
    ],
  },
];

