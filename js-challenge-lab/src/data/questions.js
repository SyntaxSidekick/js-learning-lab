// Import from JSON database
import { questionDB } from '../utils/questionDatabase.js';

// Legacy format for backward compatibility
export const questions = [
  // Variables Category
  {
    id: 1,
    difficulty: "beginner",
    category: "Variables",
    question: "What will be the output of the following code?",
    starterCode: `console.log(x);
var x = 5;
console.log(x);`,
    expectedOutput: "undefined\n5",
    hint: "Think about how var declarations are hoisted but assignments are not.",
    explanation: "Due to hoisting, 'var x' is moved to the top but not its assignment. So x is undefined initially, then 5 after assignment."
  },
  {
    id: 2,
    difficulty: "intermediate",
    category: "Variables",
    question: "What will be the output of the following code?",
    starterCode: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    expectedOutput: "3\n3\n3",
    hint: "Think about var vs let inside loops and when the setTimeout callbacks execute.",
    explanation: "With 'var', there's only one 'i' variable that's shared across all iterations. By the time the setTimeout callbacks execute, the loop has finished and i equals 3."
  },
  {
    id: 3,
    difficulty: "beginner",
    category: "Variables",
    question: "What will be the output of the following code?",
    starterCode: `let a = 3;
let b = 4;
a = b;
b = 5;
console.log(a);`,
    expectedOutput: "4",
    hint: "Think about what happens when you assign one variable to another.",
    explanation: "Variable 'a' gets the value of 'b' (which was 4), then 'b' changes to 5, but 'a' keeps its copied value of 4."
  },
  {
    id: 4,
    difficulty: "intermediate",
    category: "Variables",
    question: "What will be the output of the following code?",
    starterCode: `const obj = { x: 1 };
const obj2 = obj;
obj.x = 2;
console.log(obj2.x);`,
    expectedOutput: "2",
    hint: "Objects are passed by reference, not by value.",
    explanation: "When you assign an object to another variable, both variables reference the same object in memory. Changing one affects the other."
  },

  // Functions Category
  {
    id: 5,
    difficulty: "beginner",
    category: "Functions",
    question: "What will be the output of the following code?",
    starterCode: `console.log(foo());
console.log(bar());

function foo() {
  return 'foo';
}

var bar = function() {
  return 'bar';
};`,
    expectedOutput: "foo\nTypeError",
    hint: "Function declarations are hoisted differently than function expressions.",
    explanation: "Function declarations are fully hoisted, but function expressions are not. 'bar' is undefined when called, causing a TypeError."
  },
  {
    id: 6,
    difficulty: "intermediate",
    category: "Functions",
    question: "What will be the output of the following code?",
    starterCode: `function greet() {
  console.log("Hello " + this.name);
}

const person = { name: "Alice" };
const boundGreet = greet.bind(person);
boundGreet();`,
    expectedOutput: "Hello Alice",
    hint: "The bind() method creates a new function with 'this' permanently set to the provided value.",
    explanation: "bind() creates a new function where 'this' is permanently bound to the object passed as the first argument."
  },

  // Objects & Arrays Category
  {
    id: 7,
    difficulty: "beginner",
    category: "Arrays",
    question: "What will be the output of the following code?",
    starterCode: `const arr = [1, 2, 3];
console.log(arr.length);`,
    expectedOutput: "3",
    hint: "The length property returns the number of elements in an array.",
    explanation: "The length property of an array returns the number of elements it contains."
  },
  {
    id: 8,
    difficulty: "intermediate",
    category: "Arrays",
    question: "What will be the output of the following code?",
    starterCode: `const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x * 2);
console.log(numbers);
console.log(doubled);`,
    expectedOutput: "[1,2,3,4]\n[2,4,6,8]",
    hint: "The map() method returns a new array without modifying the original.",
    explanation: "map() creates a new array with the results of calling a function for every array element. The original array remains unchanged."
  },
  {
    id: 9,
    difficulty: "intermediate",
    category: "Arrays",
    question: "What will be the output of the following code?",
    starterCode: `const arr = [1, 2, 3];
const result1 = arr.map(x => x * 2);
const result2 = arr.forEach(x => x * 2);
console.log(result1);
console.log(result2);`,
    expectedOutput: "[2,4,6]\nundefined",
    hint: "map() returns a new array, forEach() returns undefined.",
    explanation: "map() returns a new array with transformed elements. forEach() returns undefined and is used for side effects only."
  },

  // Objects Category
  {
    id: 10,
    difficulty: "intermediate",
    category: "Objects",
    question: "What will be the output of the following code?",
    starterCode: `const obj1 = { a: 1 };
const obj2 = obj1;
obj2.a = 2;
console.log(obj1.a);`,
    expectedOutput: "2",
    hint: "Objects are passed by reference, not by value.",
    explanation: "Objects are reference types. When you assign obj1 to obj2, both variables point to the same object in memory."
  },
  {
    id: 11,
    difficulty: "intermediate",
    category: "Objects",
    question: "What will be the output of the following code?",
    starterCode: `const obj = { a: 1, b: 2, c: 3 };
const { a, ...rest } = obj;
console.log(a);
console.log(rest);`,
    expectedOutput: "1\n{b:2,c:3}",
    hint: "Destructuring with rest operator extracts some properties and groups the rest.",
    explanation: "Destructuring assignment allows extracting individual properties, while the rest operator (...) collects remaining properties into a new object."
  },

  // Strings Category
  {
    id: 12,
    difficulty: "beginner",
    category: "Strings",
    question: "What will be the output of the following code?",
    starterCode: `const str = "Hello";
console.log(str.toUpperCase());`,
    expectedOutput: "HELLO",
    hint: "The toUpperCase() method converts a string to uppercase letters.",
    explanation: "The toUpperCase() method returns a new string with all characters converted to uppercase."
  },
  {
    id: 13,
    difficulty: "intermediate",
    category: "Strings",
    question: "What will be the output of the following code?",
    starterCode: `console.log('5' + 3);
console.log('5' - 3);
console.log('5' * 3);`,
    expectedOutput: "53\n2\n15",
    hint: "+ operator behaves differently with strings vs other arithmetic operators.",
    explanation: "'+' with strings does concatenation (53), while '-' and '*' convert strings to numbers for arithmetic (2, 15)."
  },

  // Closures Category
  {
    id: 14,
    difficulty: "advanced",
    category: "Closures",
    question: "What will be the output of the following code?",
    starterCode: `function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();
console.log(counter1());
console.log(counter1());
console.log(counter2());`,
    expectedOutput: "1\n2\n1",
    hint: "Each call to createCounter() creates a new closure with its own count variable.",
    explanation: "Each invocation of createCounter() creates a new execution context with its own 'count' variable. The returned functions form closures that remember their respective 'count' variables."
  },

  // Promises Category
  {
    id: 15,
    difficulty: "intermediate",
    category: "Promises",
    question: "What will be the output of the following code?",
    starterCode: `console.log("1");
Promise.resolve().then(() => console.log("2"));
console.log("3");`,
    expectedOutput: "1\n3\n2",
    hint: "Think about the event loop and microtasks vs macrotasks.",
    explanation: "Synchronous code executes first, then microtasks (Promise.then) execute before the next macrotask. So '1' and '3' print first, then '2'."
  },
  {
    id: 16,
    difficulty: "advanced",
    category: "Async/Await",
    question: "What will be the output of the following code?",
    starterCode: `async function test() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

console.log("1");
test();
console.log("2");`,
    expectedOutput: "1\nA\n2\nB",
    hint: "async/await doesn't block the main thread. The function pauses at 'await' and resumes later.",
    explanation: "The async function executes synchronously until it hits 'await', then it pauses and returns control to the main thread. The awaited promise resolves in the microtask queue."
  },

  // Prototypes Category
  {
    id: 17,
    difficulty: "advanced",
    category: "Prototypes",
    question: "What will be the output of the following code?",
    starterCode: `function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return "Hello, " + this.name;
};

const john = new Person("John");
console.log(john.greet());`,
    expectedOutput: "Hello, John",
    hint: "Constructor functions and prototype methods work together to create object instances.",
    explanation: "The 'new' keyword creates an instance that inherits from Person.prototype. The greet method is available through the prototype chain."
  },

  // Operators Category
  {
    id: 18,
    difficulty: "beginner",
    category: "Operators",
    question: "What will be the output of the following code?",
    starterCode: `console.log(5 + "3");`,
    expectedOutput: "53",
    hint: "JavaScript performs type coercion when using the + operator with different types.",
    explanation: "When using + with a number and string, JavaScript converts the number to a string and concatenates them."
  },

  // Boolean Category
  {
    id: 19,
    difficulty: "beginner",
    category: "Boolean",
    question: "What will be the output of the following code?",
    starterCode: `console.log(Boolean(""));
console.log(Boolean("hello"));`,
    expectedOutput: "false\ntrue",
    hint: "Empty strings are falsy, non-empty strings are truthy.",
    explanation: "In JavaScript, empty strings evaluate to false, while non-empty strings evaluate to true."
  },

  // Scope Category
  {
    id: 20,
    difficulty: "intermediate",
    category: "Scope",
    question: "What will be the output of the following code?",
    starterCode: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    expectedOutput: "3\n3\n3",
    hint: "Think about var vs let inside loops and when the setTimeout callbacks execute.",
    explanation: "With 'var', there's only one 'i' variable that's shared across all iterations. By the time the setTimeout callbacks execute, the loop has finished and i equals 3."
  }
];

export const categories = [
  "All",
  "Variables", 
  "Arrays", 
  "Strings", 
  "Scope", 
  "Objects", 
  "Functions", 
  "Closures", 
  "Promises", 
  "Async/Await", 
  "Prototypes", 
  "Operators", 
  "Boolean", 
  "Array Methods", 
  "Destructuring"
];

export const difficulties = ["beginner", "intermediate", "advanced"];

// Function to get questions from JSON database
export async function getQuestionsFromDB(filters = {}) {
  try {
    await questionDB.loadQuestions();
    return questionDB.getFilteredQuestions(filters);
  } catch (error) {
    console.error('Failed to load from database, using fallback:', error);
    return questions;
  }
}

// Function to get categories from JSON database
export async function getCategoriesFromDB() {
  try {
    await questionDB.loadQuestions();
    return questionDB.getCategories();
  } catch (error) {
    console.error('Failed to load categories from database, using fallback:', error);
    return categories;
  }
}