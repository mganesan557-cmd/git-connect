import { CourseTrack } from "./courseTracks";
import { pythonTopics } from "./pythonLessons";
import { javascriptTopics } from "./javascriptLessons";
import { javaTopics } from "./javaLessons";
import { cTopics } from "./cLessons";
import { cppTopics } from "./cppLessons";
import { kotlinTopics } from "./kotlinLessons";
import { dsaTopics } from "./dsaLessons";
import { typescriptTopics } from "./typescriptLessons";
import { goTopics } from "./goLessons";
import { rustTopics } from "./rustLessons";
import { swiftTopics } from "./swiftLessons";
import { rubyTopics } from "./rubyLessons";
import { phpTopics } from "./phpLessons";

export const allTracks: CourseTrack[] = [
  { id: "python", title: "Python", icon: "PY", description: "From basics to advanced: variables, OOP, decorators, async", color: "hsl(var(--syntax-function))", topics: pythonTopics },
  { id: "javascript", title: "JavaScript", icon: "JS", description: "Fundamentals to modern ES6+: DOM, async, closures", color: "hsl(var(--syntax-number))", topics: javascriptTopics },
  { id: "typescript", title: "TypeScript", icon: "TS", description: "Typed JavaScript: interfaces, unions, safer refactors", color: "hsl(var(--syntax-type))", topics: typescriptTopics },
  { id: "java", title: "Java", icon: "JV", description: "OOP fundamentals: classes, inheritance, polymorphism", color: "hsl(var(--syntax-keyword))", topics: javaTopics },
  { id: "c", title: "C", icon: "C", description: "Low-level programming: pointers, memory, structs", color: "hsl(var(--syntax-operator))", topics: cTopics },
  { id: "cpp", title: "C++", icon: "CPP", description: "C with classes: OOP, STL, templates, smart pointers", color: "hsl(var(--syntax-type))", topics: cppTopics },
  { id: "kotlin", title: "Kotlin", icon: "KT", description: "Modern JVM language: null safety, coroutines, lambdas", color: "hsl(var(--syntax-string))", topics: kotlinTopics },
  { id: "go", title: "Go", icon: "GO", description: "Simple systems language: structs, interfaces, concurrency", color: "hsl(var(--syntax-function))", topics: goTopics },
  { id: "rust", title: "Rust", icon: "RS", description: "Memory safety with performance: ownership, enums, Result", color: "hsl(var(--syntax-operator))", topics: rustTopics },
  { id: "swift", title: "Swift", icon: "SW", description: "Modern Apple language: optionals, structs, protocol-oriented style", color: "hsl(var(--syntax-string))", topics: swiftTopics },
  { id: "ruby", title: "Ruby", icon: "RB", description: "Expressive scripting language: blocks, Enumerable, productivity", color: "hsl(var(--syntax-keyword))", topics: rubyTopics },
  { id: "php", title: "PHP", icon: "PHP", description: "Server-side web language: arrays, forms, backend logic", color: "hsl(var(--syntax-variable))", topics: phpTopics },
  { id: "dsa", title: "Data Structures & Algorithms", icon: "DSA", description: "Arrays, trees, graphs, sorting, searching, dynamic programming", color: "hsl(var(--syntax-variable))", topics: dsaTopics },
];
