import { useMemo } from "react";

type Token = {
  text: string;
  type: "keyword" | "string" | "function" | "number" | "comment" | "type" | "operator" | "variable" | "punctuation" | "plain";
};

const KEYWORDS: Record<string, Set<string>> = {
  Python: new Set(["def", "class", "return", "if", "else", "elif", "for", "while", "in", "import", "from", "as", "try", "except", "finally", "with", "yield", "lambda", "pass", "break", "continue", "and", "or", "not", "is", "True", "False", "None", "print", "range", "len", "input", "int", "str", "float", "list", "dict", "set", "tuple"]),
  JavaScript: new Set(["function", "const", "let", "var", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "class", "new", "this", "import", "export", "from", "default", "try", "catch", "finally", "throw", "async", "await", "of", "in", "typeof", "instanceof", "true", "false", "null", "undefined", "console", "log"]),
  TypeScript: new Set(["function", "const", "let", "var", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "class", "new", "this", "import", "export", "from", "default", "try", "catch", "finally", "throw", "async", "await", "of", "in", "typeof", "instanceof", "true", "false", "null", "undefined", "console", "log", "type", "interface", "enum", "implements", "extends"]),
  Java: new Set(["public", "private", "protected", "static", "void", "class", "interface", "extends", "implements", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "new", "this", "super", "try", "catch", "finally", "throw", "throws", "import", "package", "true", "false", "null", "final", "abstract"]),
  C: new Set(["int", "float", "double", "char", "void", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "struct", "typedef", "enum", "sizeof", "static", "const", "unsigned", "signed", "long", "short", "include", "define", "printf", "scanf", "main"]),
  "C++": new Set(["int", "float", "double", "char", "void", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "class", "struct", "public", "private", "protected", "virtual", "override", "new", "delete", "this", "namespace", "using", "template", "typename", "include", "cout", "cin", "endl", "string", "vector", "main", "std"]),
  Go: new Set(["func", "package", "import", "return", "if", "else", "for", "range", "switch", "case", "break", "continue", "var", "const", "type", "struct", "interface", "map", "chan", "go", "defer", "select", "true", "false", "nil", "fmt", "main"]),
  Rust: new Set(["fn", "let", "mut", "return", "if", "else", "for", "while", "loop", "match", "struct", "enum", "impl", "trait", "pub", "use", "mod", "self", "super", "crate", "true", "false", "as", "in", "ref", "move", "async", "await", "where", "type", "const", "static", "unsafe", "main", "println", "print"]),
  Ruby: new Set(["def", "end", "class", "module", "return", "if", "else", "elsif", "unless", "for", "while", "do", "begin", "rescue", "ensure", "raise", "yield", "block", "proc", "lambda", "true", "false", "nil", "self", "puts", "print", "require", "include", "attr", "times"]),
  PHP: new Set(["function", "class", "return", "if", "else", "elseif", "for", "foreach", "while", "do", "switch", "case", "break", "continue", "echo", "print", "new", "this", "public", "private", "protected", "static", "var", "const", "true", "false", "null", "array", "isset", "empty", "php"]),
  Kotlin: new Set(["fun", "val", "var", "return", "if", "else", "for", "while", "do", "when", "class", "object", "interface", "data", "sealed", "open", "abstract", "override", "companion", "this", "super", "import", "package", "true", "false", "null", "in", "is", "as", "print", "println", "main"]),
  Swift: new Set(["func", "var", "let", "return", "if", "else", "for", "while", "repeat", "switch", "case", "break", "continue", "class", "struct", "enum", "protocol", "extension", "import", "self", "super", "true", "false", "nil", "in", "guard", "defer", "throw", "try", "catch", "print", "String", "Int"]),
};

const TYPE_KEYWORDS = new Set(["int", "float", "double", "char", "void", "string", "bool", "boolean", "number", "String", "Int", "u64", "i32", "i64", "f32", "f64", "usize", "isize"]);

function tokenize(code: string, language: string): Token[][] {
  const keywords = KEYWORDS[language] || KEYWORDS["Python"];
  const lines = code.split("\n");
  
  return lines.map(line => {
    const tokens: Token[] = [];
    let i = 0;
    
    while (i < line.length) {
      // Comments
      if (line[i] === "#" || (line[i] === "/" && line[i + 1] === "/")) {
        tokens.push({ text: line.slice(i), type: "comment" });
        break;
      }
      
      // Strings (double or single quote)
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length && line[j] !== quote) {
          if (line[j] === "\\") j++;
          j++;
        }
        tokens.push({ text: line.slice(i, j + 1), type: "string" });
        i = j + 1;
        continue;
      }

      // Template strings
      if (line[i] === "`") {
        let j = i + 1;
        while (j < line.length && line[j] !== "`") {
          if (line[j] === "\\") j++;
          j++;
        }
        tokens.push({ text: line.slice(i, j + 1), type: "string" });
        i = j + 1;
        continue;
      }
      
      // Numbers
      if (/[0-9]/.test(line[i]) && (i === 0 || /[\s(,=+\-*/<>[\]{:]/.test(line[i - 1]))) {
        let j = i;
        while (j < line.length && /[0-9.xu]/.test(line[j])) j++;
        tokens.push({ text: line.slice(i, j), type: "number" });
        i = j;
        continue;
      }
      
      // Words (identifiers/keywords)
      if (/[a-zA-Z_$]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
        const word = line.slice(i, j);
        
        // Check if it's followed by ( → function call
        let nextNonSpace = j;
        while (nextNonSpace < line.length && line[nextNonSpace] === " ") nextNonSpace++;
        
        if (TYPE_KEYWORDS.has(word)) {
          tokens.push({ text: word, type: "type" });
        } else if (keywords.has(word)) {
          tokens.push({ text: word, type: "keyword" });
        } else if (line[nextNonSpace] === "(") {
          tokens.push({ text: word, type: "function" });
        } else {
          tokens.push({ text: word, type: "variable" });
        }
        i = j;
        continue;
      }
      
      // Operators
      if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
        let j = i;
        while (j < line.length && /[+\-*/%=<>!&|^~?:]/.test(line[j])) j++;
        tokens.push({ text: line.slice(i, j), type: "operator" });
        i = j;
        continue;
      }
      
      // Punctuation
      if (/[()[\]{},;.]/.test(line[i])) {
        tokens.push({ text: line[i], type: "punctuation" });
        i++;
        continue;
      }
      
      // Whitespace and other
      tokens.push({ text: line[i], type: "plain" });
      i++;
    }
    
    return tokens;
  });
}

const tokenColors: Record<Token["type"], string> = {
  keyword: "text-[hsl(var(--syntax-keyword))]",
  string: "text-[hsl(var(--syntax-string))]",
  function: "text-[hsl(var(--syntax-function))]",
  number: "text-[hsl(var(--syntax-number))]",
  comment: "text-[hsl(var(--syntax-comment))] italic",
  type: "text-[hsl(var(--syntax-type))]",
  operator: "text-[hsl(var(--syntax-operator))]",
  variable: "text-[hsl(var(--syntax-variable))]",
  punctuation: "text-muted-foreground",
  plain: "",
};

interface SyntaxHighlighterProps {
  code: string;
  language: string;
  activeLine?: number | null;
  onLineAction?: (line: string, lineNumber: number) => void;
  lineActionLabel?: string;
}

const SyntaxHighlighter = ({ code, language, activeLine, onLineAction, lineActionLabel = "Add" }: SyntaxHighlighterProps) => {
  const tokenizedLines = useMemo(() => tokenize(code, language), [code, language]);
  const lines = useMemo(() => code.split("\n"), [code]);

  return (
    <div className="font-mono text-sm leading-[1.75rem]">
      {tokenizedLines.map((tokens, lineIndex) => (
        <div
          key={lineIndex}
          className={`group flex transition-colors duration-200 ${
            activeLine === lineIndex + 1
              ? "bg-primary/8 border-l-2 border-primary"
              : "border-l-2 border-transparent hover:bg-muted/30"
          }`}
        >
          <span
            className={`w-10 text-right pr-4 select-none shrink-0 ${
              activeLine === lineIndex + 1
                ? "text-primary font-semibold"
                : "text-muted-foreground/40"
            }`}
          >
            {lineIndex + 1}
          </span>
          {onLineAction && (
            <button
              type="button"
              className="h-6 mt-1 mr-2 px-1.5 rounded text-[10px] leading-none border border-border/60 text-muted-foreground hover:text-foreground hover:border-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onLineAction(lines[lineIndex] ?? "", lineIndex + 1)}
              disabled={!lines[lineIndex]?.trim()}
              title={`${lineActionLabel} line ${lineIndex + 1}`}
            >
              {lineActionLabel}
            </button>
          )}
          <span className="flex-1">
            {tokens.map((token, tokenIndex) => (
              <span key={tokenIndex} className={tokenColors[token.type]}>
                {token.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SyntaxHighlighter;
