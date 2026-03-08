import { Topic } from "./pythonLessons";

export const phpTopics: Topic[] = [
  {
    id: "php-fundamentals",
    title: "PHP Fundamentals",
    icon: "PHP",
    color: "hsl(var(--syntax-variable))",
    lessons: [
      {
        id: "php-arrays-functions",
        title: "Arrays, Functions, and Associative Data",
        description: "Core PHP syntax for practical backend logic.",
        content: `PHP is widely used for server-side web development.

This lesson covers:
- Indexed vs associative arrays
- Function definitions
- Iteration and simple transformations
- Basic string interpolation`,
        code: `<?php\n$nums = [1, 2, 3, 4, 5];\n\n$sum = array_reduce($nums, function($acc, $n) {\n    return $acc + $n;\n}, 0);\n\n$evens = array_filter($nums, function($n) {\n    return $n % 2 === 0;\n});\n\n$user = [\n    \"name\" => \"Alice\",\n    \"role\" => \"admin\"\n];\n\nfunction greet($name) {\n    return \"Hello, {$name}!\";\n}\n\necho $sum . \"\\n\";\necho implode(\",\", $evens) . \"\\n\";\necho greet($user[\"name\"]) . \"\\n\";\n?>`,
        language: "PHP",
        expectedOutput: `15\n2,4\nHello, Alice!`,
        tips: [
          "Associative arrays are key=>value maps in PHP.",
          "Use strict comparison `===` to avoid coercion issues.",
          "Array helpers (`array_map/filter/reduce`) are concise and readable.",
          "Keep business logic out of mixed HTML templates when possible.",
        ],
        questions: [
          { question: "PHP associative arrays are similar to...", options: ["Queue only", "Map/dictionary key-value structures", "Tuples", "Enums"], answer: 1, explanation: "Associative arrays map keys to values." },
          { question: "Why prefer `===` over `==` in PHP?", options: ["Faster always", "Checks type and value without loose coercion", "Required in loops", "Works only with numbers"], answer: 1, explanation: "Strict comparison avoids surprising coercion." },
          { question: "`array_filter` is used to...", options: ["Sort array", "Filter elements by condition", "Convert to string", "Reverse keys"], answer: 1, explanation: "`array_filter` returns elements that satisfy predicate." },
          { question: "Function keyword in PHP is...", options: ["def", "fnc", "function", "proc"], answer: 2, explanation: "PHP function declarations use `function`." },
          { question: "Common output statement in PHP scripts?", options: ["println", "echo", "console.log", "puts"], answer: 1, explanation: "`echo` outputs text in PHP." },
        ],
      },
    ],
  },
];
