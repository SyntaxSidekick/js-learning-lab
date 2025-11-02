// Question Generator and Database Manager
// This script helps you add new questions to the JSON database

export class QuestionGenerator {
  constructor() {
    this.templates = {
      output: {
        type: "output",
        question: "What will be the output of the following code?",
        defaultOptions: ["Option A", "Option B", "Option C", "Option D"]
      },
      concept: {
        type: "concept",
        question: "Which statement is correct?",
        defaultOptions: ["Statement A", "Statement B", "Statement C", "Statement D"]
      },
      debugging: {
        type: "debugging",
        question: "What's wrong with this code?",
        defaultOptions: ["Error A", "Error B", "Error C", "Nothing wrong"]
      },
      completion: {
        type: "completion",
        question: "Complete the code to achieve the desired output:",
        defaultOptions: ["Code A", "Code B", "Code C", "Code D"]
      }
    };
  }

  // Generate a new question object
  generateQuestion({
    id,
    category,
    difficulty = "beginner",
    type = "output",
    title,
    question,
    code = "",
    options = [],
    correctAnswer = 0,
    explanation = "",
    hints = [],
    tags = [],
    relatedConcepts = []
  }) {
    const template = this.templates[type] || this.templates.output;
    
    return {
      id: id || this.generateId(),
      category: category || "variables",
      difficulty,
      type,
      title: title || `${category} Question`,
      question: question || template.question,
      code: code,
      options: options.length > 0 ? options : template.defaultOptions,
      correctAnswer,
      explanation: explanation || "Add explanation here.",
      hints: hints.length > 0 ? hints : ["Add hint here"],
      tags: tags.length > 0 ? tags : [category, difficulty],
      relatedConcepts: relatedConcepts.length > 0 ? relatedConcepts : [`${category} concepts`]
    };
  }

  // Generate unique ID
  generateId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // Validate question object
  validateQuestion(question) {
    const required = ['id', 'category', 'difficulty', 'type', 'title', 'question', 'options', 'correctAnswer', 'explanation'];
    const missing = required.filter(field => !question[field] && question[field] !== 0);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    if (!Array.isArray(question.options) || question.options.length < 2) {
      throw new Error('Options must be an array with at least 2 items');
    }

    if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
      throw new Error('correctAnswer must be a valid index of options array');
    }

    return true;
  }

  // Create multiple questions at once
  createQuestionSet(questionData) {
    return questionData.map(data => {
      const question = this.generateQuestion(data);
      this.validateQuestion(question);
      return question;
    });
  }
}

// Pre-defined question sets for different topics
export const questionSets = {
  variables: [
    {
      category: "variables",
      difficulty: "beginner",
      title: "Variable Hoisting Basics",
      question: "What will be the output of the following code?",
      code: "console.log(a);\nvar a = 10;\nconsole.log(a);",
      options: ["undefined, 10", "10, 10", "ReferenceError", "undefined, undefined"],
      correctAnswer: 0,
      explanation: "Due to hoisting, var declarations are moved to the top, but assignments stay in place.",
      hints: ["Variables declared with var are hoisted", "Only the declaration is hoisted, not the assignment"],
      tags: ["hoisting", "var", "undefined"],
      relatedConcepts: ["Variable declarations", "Hoisting", "Execution context"]
    },
    {
      category: "variables",
      difficulty: "intermediate",
      title: "Temporal Dead Zone",
      question: "What will be the output of the following code?",
      code: "console.log(x);\nlet x = 5;",
      options: ["undefined", "5", "ReferenceError", "null"],
      correctAnswer: 2,
      explanation: "Variables declared with let/const are hoisted but cannot be accessed before declaration due to temporal dead zone.",
      hints: ["let/const have different hoisting behavior than var", "Temporal dead zone prevents access before declaration"],
      tags: ["temporal-dead-zone", "let", "hoisting"],
      relatedConcepts: ["Temporal dead zone", "Block scoping", "Hoisting"]
    }
  ],

  functions: [
    {
      category: "functions",
      difficulty: "beginner",
      title: "Function Hoisting",
      question: "What will be the output of the following code?",
      code: "sayHello();\n\nfunction sayHello() {\n  console.log('Hello!');\n}",
      options: ["Hello!", "undefined", "ReferenceError", "TypeError"],
      correctAnswer: 0,
      explanation: "Function declarations are fully hoisted, meaning they can be called before they're defined.",
      hints: ["Function declarations are hoisted completely", "You can call function declarations before they're written"],
      tags: ["hoisting", "function-declaration"],
      relatedConcepts: ["Function hoisting", "Function declarations", "Execution context"]
    },
    {
      category: "functions",
      difficulty: "intermediate",
      title: "Arrow Function This Binding",
      question: "What will be the output of the following code?",
      code: "const obj = {\n  name: 'Alice',\n  greet: () => {\n    console.log('Hello ' + this.name);\n  }\n};\nobj.greet();",
      options: ["Hello Alice", "Hello undefined", "Hello ", "TypeError"],
      correctAnswer: 1,
      explanation: "Arrow functions don't have their own 'this' binding. They inherit 'this' from the enclosing scope.",
      hints: ["Arrow functions don't bind their own 'this'", "They inherit 'this' from the parent scope"],
      tags: ["arrow-functions", "this", "binding"],
      relatedConcepts: ["Arrow functions", "This binding", "Lexical this"]
    }
  ],

  objects: [
    {
      category: "objects",
      difficulty: "beginner",
      title: "Object Property Access",
      question: "What will be the output of the following code?",
      code: "const obj = { x: 1, y: 2 };\nconsole.log(obj.z);",
      options: ["0", "null", "undefined", "ReferenceError"],
      correctAnswer: 2,
      explanation: "Accessing a non-existent property of an object returns undefined.",
      hints: ["Non-existent properties return a specific value", "No error is thrown for missing properties"],
      tags: ["objects", "property-access", "undefined"],
      relatedConcepts: ["Object properties", "Property access", "Undefined values"]
    },
    {
      category: "objects",
      difficulty: "intermediate",
      title: "Object.freeze() Effect",
      question: "What will be the output of the following code?",
      code: "const obj = { x: 1 };\nObject.freeze(obj);\nobj.x = 2;\nconsole.log(obj.x);",
      options: ["1", "2", "undefined", "TypeError"],
      correctAnswer: 0,
      explanation: "Object.freeze() prevents modification of existing properties. The assignment fails silently in non-strict mode.",
      hints: ["Object.freeze() makes objects immutable", "Failed assignments in non-strict mode fail silently"],
      tags: ["Object.freeze", "immutability", "objects"],
      relatedConcepts: ["Object.freeze", "Immutability", "Object methods"]
    }
  ],

  promises: [
    {
      category: "promises",
      difficulty: "intermediate",
      title: "Promise Resolution Order",
      question: "What will be the output of the following code?",
      code: "console.log('A');\nPromise.resolve().then(() => console.log('B'));\nconsole.log('C');",
      options: ["A, B, C", "A, C, B", "B, A, C", "C, B, A"],
      correctAnswer: 1,
      explanation: "Synchronous code runs first (A, C), then microtasks like Promise.then() run (B).",
      hints: ["Synchronous code has priority", "Promise.then() creates a microtask"],
      tags: ["promises", "microtasks", "event-loop"],
      relatedConcepts: ["Event loop", "Microtasks", "Promise resolution"]
    }
  ],

  arrays: [
    {
      category: "arrays",
      difficulty: "beginner",
      title: "Array Length Property",
      question: "What will be the output of the following code?",
      code: "const arr = [1, 2, 3];\narr.length = 1;\nconsole.log(arr);",
      options: ["[1, 2, 3]", "[1]", "[1, undefined, undefined]", "Error"],
      correctAnswer: 1,
      explanation: "Setting array length to a smaller value truncates the array, removing elements beyond that index.",
      hints: ["Array length can be modified", "Reducing length removes elements"],
      tags: ["arrays", "length", "truncation"],
      relatedConcepts: ["Array length", "Array mutation", "Array methods"]
    }
  ]
};

// Usage example:
/*
const generator = new QuestionGenerator();

// Create a single question
const newQuestion = generator.generateQuestion({
  category: "variables",
  difficulty: "beginner",
  title: "My Custom Question",
  question: "What happens here?",
  code: "console.log(test);",
  options: ["undefined", "null", "error", "0"],
  correctAnswer: 0,
  explanation: "This demonstrates hoisting behavior.",
  hints: ["Think about hoisting"],
  tags: ["hoisting", "variables"]
});

// Create multiple questions from a set
const variableQuestions = generator.createQuestionSet(questionSets.variables);
*/