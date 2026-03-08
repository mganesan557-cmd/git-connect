import { Topic } from "./pythonLessons";

export const rubyTopics: Topic[] = [
  {
    id: "ruby-fundamentals",
    title: "Ruby Fundamentals",
    icon: "RB",
    color: "hsl(var(--syntax-keyword))",
    lessons: [
      {
        id: "ruby-blocks",
        title: "Blocks, Enumerable, and Methods",
        description: "Idiomatic Ruby iteration and transformations.",
        content: `Ruby favors expressive code via blocks and Enumerable methods.

Core patterns:
- \`map\`, \`select\`, \`reduce\`
- block syntax \`{}\` and \`do...end\`
- clean method definitions`,
        code: `nums = [1, 2, 3, 4, 5]\n\ndoubled = nums.map { |n| n * 2 }\nevens = nums.select { |n| n.even? }\nsum = nums.reduce(0) { |acc, n| acc + n }\n\nputs doubled.inspect\nputs evens.inspect\nputs sum\n\ndef greet(name)\n  \"Hello, #{name}!\"\nend\n\nputs greet(\"Alice\")`,
        language: "Ruby",
        expectedOutput: `[2, 4, 6, 8, 10]\n[2, 4]\n15\nHello, Alice!`,
        tips: [
          "Use Enumerable methods instead of manual loops when possible.",
          "`map` transforms, `select` filters, `reduce` aggregates.",
          "Use string interpolation with `#{}`.",
          "Prefer expressive names over comments.",
        ],
        questions: [
          { question: "What does `map` return?", options: ["Boolean", "New transformed array", "Same array mutated", "Hash"], answer: 1, explanation: "`map` returns a new array with transformed elements." },
          { question: "What does `select` do?", options: ["Sorts", "Filters elements by predicate", "Counts elements", "Mutates to nil"], answer: 1, explanation: "`select` keeps elements where block returns truthy." },
          { question: "`reduce` is primarily for...", options: ["Filtering", "Aggregation to one value", "Pattern matching", "Concurrency"], answer: 1, explanation: "`reduce` accumulates values into a single result." },
          { question: "Ruby interpolation syntax is...", options: ["${x}", "#{x}", "%{x}", "&{x}"], answer: 1, explanation: "Ruby string interpolation uses `#{...}`." },
          { question: "Idiomatic Ruby style prefers...", options: ["Verbose loops always", "Enumerable + blocks when suitable", "Global vars", "No methods"], answer: 1, explanation: "Blocks and Enumerable are core Ruby idioms." },
        ],
      },
    ],
  },
];
