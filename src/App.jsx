import React, { useState, useEffect } from 'react'
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  Snackbar,
  LinearProgress,
  Fade,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  ClickAwayListener,
  Popper,
  Grow,
  CircularProgress,
  useMediaQuery,
  SwipeableDrawer,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton
} from '@mui/material'
import {
  DarkMode,
  LightMode,
  Code,
  EmojiEvents,
  Whatshot,
  Lightbulb,
  PlayArrow,
  Refresh,
  AutoAwesome,
  Terminal,
  MenuBook,
  Shuffle,
  Menu
} from '@mui/icons-material'

import { questions } from './data/questions'
import { QuestionDatabase } from './utils/questionDatabase'
import CodeEditor from './components/CodeEditor'
import ResultDisplay from './components/ResultDisplay'

// Keyword definitions for tooltips
const keywordDefinitions = {
  'variable': '📦 A container that stores data values. Can hold numbers, strings, objects, etc.',
  'function': '⚙️ A reusable block of code that performs a specific task. Can accept inputs (parameters) and return outputs.',
  'object': '🏗️ A collection of key-value pairs that represent real-world entities. Properties store data, methods perform actions.',
  'property': '🔑 A named piece of data belonging to an object. Accessed using dot notation (obj.property).',
  'array': '📋 An ordered list of values. Each item has a numbered position (index) starting from 0.',
  'scope': '🎯 Determines where variables can be accessed in your code. Can be global, function, or block scope.',
  'parameter': '📥 An input that a function accepts. Defined when creating the function.',
  'argument': '📤 The actual value passed to a function when calling it.',
  'method': '🔧 A function that belongs to an object. Called using dot notation (obj.method()).',
  'index': '🔢 The numbered position of an item in an array. Arrays start counting from 0.',
  'reference': '🔗 When variables point to the same object in memory. Changes affect all references.',
  'declaration': '📝 Creating a new variable using const, let, or var keywords.',
  'assignment': '✏️ Giving a value to a variable using the = operator.',
  'hoisting': '⬆️ JavaScript\'s behavior of moving variable and function declarations to the top of their scope.',
  'closure': '🔒 When a function has access to variables from its outer scope even after the outer function finishes.',
  'callback': '↩️ A function passed as an argument to another function to be executed later.',
  'prototype': '🧬 The template object that all instances of a constructor function inherit from.',
  'this': '👆 A keyword that refers to the object that owns the currently executing code.',
  'DOM': '🌐 Document Object Model - the structure that represents HTML elements as objects JavaScript can manipulate.'
}

// Clickable Keyword Tooltip Component
const ClickableKeyword = ({ children, keyword, sx = {} }) => {
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    setOpen(!open)
  }

  const handleClickAway = () => {
    setOpen(false)
  }

  const definition = keywordDefinitions[keyword.toLowerCase()]
  if (!definition) return children

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box component="span" sx={{ position: 'relative', display: 'inline' }}>
        <Box
          component="span"
          onClick={handleClick}
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: '1px dotted',
            borderBottomColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              borderRadius: 0.5,
              px: 0.5
            },
            ...sx
          }}
        >
          {children}
        </Box>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement="top"
          transition
          style={{ zIndex: 1300 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={200}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: 'grey.900',
                  color: 'white',
                  maxWidth: 300,
                  boxShadow: 3,
                  border: '1px solid',
                  borderColor: 'primary.main'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: 'primary.light' }}>
                  {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {definition}
                </Typography>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

// Function to automatically wrap keywords in text with clickable tooltips
const enhanceTextWithKeywords = (text) => {
  if (typeof text !== 'string') return text
  
  const keywords = Object.keys(keywordDefinitions)
  
  // Create a pattern that matches any of our keywords
  const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi')
  
  const parts = []
  let lastIndex = 0
  let match
  let keyIndex = 0
  
  while ((match = keywordPattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }
    
    // Add the keyword as a clickable component
    const keyword = match[1].toLowerCase()
    parts.push(
      <ClickableKeyword key={`keyword-${keyIndex++}`} keyword={keyword}>
        {match[1]}
      </ClickableKeyword>
    )
    
    lastIndex = match.index + match[0].length
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }
  
  return parts.length > 0 ? parts : text
}

function App() {
  // Available topics for navigation
  const topics = [
    { id: 'variables', name: 'Variables', icon: '📝' },
    { id: 'arrays', name: 'Arrays', icon: '📊' },
    { id: 'functions', name: 'Functions', icon: '⚡' },
    { id: 'objects', name: 'Objects', icon: '🎯' },
    { id: 'loops', name: 'Loops', icon: '🔄' },
    { id: 'closures', name: 'Closures', icon: '🔒' },
    { id: 'promises', name: 'Promises', icon: '⏰' },
    { id: 'es6', name: 'ES6+', icon: '✨' },
    { id: 'dom', name: 'DOM', icon: '🌐' },
    { id: 'async', name: 'Async/Await', icon: '🚀' }
  ]

  // State
  const [darkMode, setDarkMode] = useState(false)
  const [activeTopic, setActiveTopic] = useState('variables')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [userCode, setUserCode] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [aboutTabValue, setAboutTabValue] = useState(0)
  const [showTopicInfo, setShowTopicInfo] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })
  
  // Mobile state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  
  // New state for database
  const [questionDatabase, setQuestionDatabase] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [databaseQuestions, setDatabaseQuestions] = useState([])

  // Initialize question database
  useEffect(() => {
    const initDatabase = async () => {
      try {
        setIsLoading(true)
        const db = new QuestionDatabase()
        await db.loadQuestions()
        setQuestionDatabase(db)
        
        // Load questions for the active topic and shuffle them
        const topicQuestions = db.getQuestionsByCategory(activeTopic, selectedDifficulty)
        setDatabaseQuestions(shuffleArray(topicQuestions))
        
        console.log(`Loaded ${db.getTotalQuestions()} questions from database`)
      } catch (error) {
        console.error('Failed to load question database:', error)
        // Fallback to legacy questions and shuffle them
        const fallbackQuestions = questions.filter(q => q.topic === activeTopic)
        setDatabaseQuestions(shuffleArray(fallbackQuestions))
      } finally {
        setIsLoading(false)
      }
    }
    
    initDatabase()
  }, [activeTopic, selectedDifficulty])

  // Update questions when topic or difficulty changes
  useEffect(() => {
    if (questionDatabase) {
      const topicQuestions = questionDatabase.getQuestionsByCategory(activeTopic, selectedDifficulty)
      setDatabaseQuestions(shuffleArray(topicQuestions))
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }, [activeTopic, selectedDifficulty, questionDatabase])

  // Helper function to shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }
  const getTopicQuestions = (topicId, difficulty = 'all') => {
    // Use database questions if available, otherwise fallback to legacy questions
    if (databaseQuestions.length > 0) {
      return databaseQuestions
    }
    
    // Legacy fallback with shuffling
    const topicMap = {
      'variables': 'Variables',
      'arrays': 'Arrays', 
      'functions': 'Functions',
      'objects': 'Objects',
      'loops': 'Loops',
      'closures': 'Closures',
      'promises': 'Promises',
      'es6': 'ES6',
      'dom': 'DOM',
      'async': 'Async/Await'
    }
    let filteredQuestions = questions.filter(q => q.category === topicMap[topicId])
    
    // Filter by difficulty if not 'all'
    if (difficulty !== 'all') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty)
    }
    
    console.log(`Found ${filteredQuestions.length} questions for topic ${topicId} (${topicMap[topicId]}) with difficulty ${difficulty}`)
    return shuffleArray(filteredQuestions)
  }

  const topicQuestions = getTopicQuestions(activeTopic, selectedDifficulty)
  const currentTopicQuestion = topicQuestions[currentQuestionIndex] || topicQuestions[0]

  // Helper function to normalize question format between old and new database
  const normalizeQuestion = (question) => {
    if (!question) return null
    
    // If it's from the new database (has 'options' array)
    if (question.options) {
      return {
        ...question,
        starterCode: question.code || '',
        expectedOutput: question.options[question.correctAnswer],
        hint: question.hints?.[0] || question.hint || '',
        
      }
    }
    
    // If it's from the old format, return as-is
    return question
  }

  const normalizedQuestion = normalizeQuestion(currentTopicQuestion)

  // Helper function to normalize difficulty levels
  const normalizeDifficulty = (difficulty) => {
    const difficultyMap = {
      'beginner': 'easy',
      'intermediate': 'medium', 
      'advanced': 'hard',
      'easy': 'easy',
      'medium': 'medium',
      'hard': 'hard'
    }
    return difficultyMap[difficulty] || difficulty
  }

  // Get normalized difficulty for UI display
  const currentDifficulty = currentTopicQuestion ? normalizeDifficulty(currentTopicQuestion.difficulty) : 'easy'

  // Mobile handlers
  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  // Function to shuffle current questions
  const handleShuffleQuestions = () => {
    if (databaseQuestions.length > 0) {
      setDatabaseQuestions(shuffleArray(databaseQuestions))
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setSnackbar({
        open: true,
        message: '🔀 Questions shuffled! Starting fresh...',
        severity: 'info'
      })
    }
  }

  // Multiple choice options - updated to handle both formats
  const getMultipleChoiceOptions = (question) => {
    if (!question) return []
    
    // New database format
    if (question.options) {
      return question.options.map((option, index) => ({
        id: String.fromCharCode(65 + index), // A, B, C, D
        text: option,
        isCorrect: index === question.correctAnswer
      }))
    }
    
    // Legacy format
    const correct = question.expectedOutput
    return [
      { id: 'A', text: correct, isCorrect: true },
      { id: 'B', text: 'undefined', isCorrect: false },
      { id: 'C', text: 'null', isCorrect: false },
      { id: 'D', text: 'Error', isCorrect: false }
    ]
  }

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId)
    setShowResult(false)
    
    // Check if answer is correct
    const selectedOption = getMultipleChoiceOptions(currentTopicQuestion).find(o => o.id === optionId)
    if (selectedOption?.isCorrect) {
      // Show success feedback immediately
      setSnackbar({
        open: true,
        message: '🎉 Correct! Moving to next question...',
        severity: 'success'
      })
      
      // Move to next question after delay
      setTimeout(() => {
        moveToNextQuestion()
      }, 2500) // Wait 2.5 seconds before moving to next question
    } else {
      // Show incorrect feedback
      setSnackbar({
        open: true,
        message: '❌ Not quite right. Try again!',
        severity: 'error'
      })
    }
  }

  const moveToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    console.log('Moving to next question:', currentQuestionIndex, '->', nextIndex, 'Total questions:', topicQuestions.length)
    
    if (nextIndex < topicQuestions.length) {
      setCurrentQuestionIndex(nextIndex)
      setSelectedAnswer(null)
      setShowResult(false)
      setUserCode('')
      setResult(null)
    } else {
      // All questions completed, could show completion message or cycle back
      setCurrentQuestionIndex(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setUserCode('')
      setResult(null)
      setSnackbar({
        open: true,
        message: `🎉 Great job! You've completed all ${topicQuestions.length} questions in this topic!`,
        severity: 'success'
      })
    }
  }

  const handleSubmitAnswer = () => {
    setShowResult(true)
  }

  const resetCode = () => {
    setUserCode('')
    setResult(null)
  }

  const runCode = () => {
    try {
      const consoleOutput = []
      const mockConsole = {
        log: (...args) => {
          consoleOutput.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '))
        }
      }

      const func = new Function('console', userCode)
      func(mockConsole)

      const output = consoleOutput.join('\n')
      const isCorrect = output === currentTopicQuestion.expectedOutput

      setResult({
        output,
        isCorrect,
        expected: currentTopicQuestion.expectedOutput
      })

      if (isCorrect) {
        setScore(score + 10)
        setStreak(streak + 1)
        setSnackbar({
          open: true,
          message: '🎉 Correct! Well done!',
          severity: 'success'
        })
      } else {
        setStreak(0)
      }
    } catch (error) {
      setResult({
        output: `Error: ${error.message}`,
        isCorrect: false,
        expected: currentTopicQuestion.expectedOutput
      })
    }
  }

  // Generate step-by-step code breakdown
  const generateCodeBreakdown = (code) => {
    if (!code || typeof code !== 'string') {
      return [];
    }
    
    const lines = code.trim().split('\n')
    const breakdown = []
    const variables = new Map() // Track variable states
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('//')) {
        let explanation = ''
        
        // Variable declarations with initialization
        if (trimmedLine.match(/^(var|let|const)\s+\w+\s*=\s*.+/)) {
          const match = trimmedLine.match(/^(var|let|const)\s+(\w+)\s*=\s*(.+);?/)
          if (match) {
            const [, , varName, value] = match
            variables.set(varName, value)
            
            if (value.match(/^\w+$/)) {
              // Assignment from another variable
              const sourceValue = variables.get(value) || value
              explanation = `📦 Create variable '${varName}' and assign it the value of '${value}' (which is ${sourceValue})`
            } else {
              explanation = `📦 Create variable '${varName}' and assign it the value ${value}`
            }
            variables.set(varName, value)
          }
        }
        // Variable reassignment
        else if (trimmedLine.match(/^\w+\s*=\s*.+/)) {
          const match = trimmedLine.match(/^(\w+)\s*=\s*(.+);?/)
          if (match) {
            const [, varName, newValue] = match
            const oldValue = variables.get(varName) || 'undefined'
            explanation = `🔄 Change variable '${varName}' from ${oldValue} to ${newValue}`
            variables.set(varName, newValue)
          }
        }
        // Console.log
        else if (trimmedLine.includes('console.log')) {
          const match = trimmedLine.match(/console\.log\((.+)\)/)
          if (match) {
            const [, content] = match
            const currentValue = variables.get(content) || content
            explanation = `🖥️ Output the current value of '${content}' to console (which is ${currentValue})`
          }
        }
        // Array operations
        else if (trimmedLine.includes('.push(')) {
          const match = trimmedLine.match(/(\w+)\.push\((.+)\)/)
          if (match) {
            const [, arrayName, value] = match
            explanation = `➕ Add ${value} to the end of array '${arrayName}'`
          }
        }
        else if (trimmedLine.includes('.pop(')) {
          const match = trimmedLine.match(/(\w+)\.pop\(\)/)
          if (match) {
            const [, arrayName] = match
            explanation = `➖ Remove and return the last element from array '${arrayName}'`
          }
        }
        // Object property access
        else if (trimmedLine.includes('.') && !trimmedLine.includes('console.log')) {
          const match = trimmedLine.match(/(\w+)\.(\w+)/)
          if (match) {
            const [, objName, property] = match
            explanation = `🔍 Access property '${property}' of object '${objName}'`
          }
        }
        // Function calls
        else if (trimmedLine.includes('(') && trimmedLine.includes(')')) {
          explanation = `⚡ Execute function: ${trimmedLine}`
        }
        // Default explanation
        else {
          explanation = `📋 Execute: ${trimmedLine}`
        }
        
        breakdown.push({
          lineNumber: index + 1,
          code: trimmedLine,
          explanation
        })
      }
    })
    
    return breakdown
  }

  // Detailed syntax explanation for each line
  const getLineExplanation = (line) => {
    const trimmed = line.trim()
    
    // Object creation with properties
    if (trimmed.includes('const') && trimmed.includes('{') && trimmed.includes(':')) {
      const match = trimmed.match(/const\s+(\w+)\s*=\s*{\s*([^}]+)\s*}/)
      if (match) {
        const [, varName, properties] = match
        const propExplanations = properties.split(',').map(prop => {
          const [key, value] = prop.split(':').map(p => p.trim())
          return `• "${key}" is the property name, ${value} is its value`
        }).join(' ')
        return `📦 Creates an object called "${varName}". The curly braces { } create an object. Inside: ${propExplanations}. This means ${varName}.${properties.split(':')[0].trim()} will equal ${properties.split(':')[1].trim()}`
      }
    }
    
    // Variable assignment from another variable
    if (trimmed.includes('const') && !trimmed.includes('{') && !trimmed.includes('[')) {
      const match = trimmed.match(/const\s+(\w+)\s*=\s*([^;]+)/)
      if (match) {
        const [, newVar, source] = match
        if (source.trim().match(/^\w+$/)) {
          return `🔗 Creates a new variable "${newVar}" that points to the same object as "${source.trim()}". They both reference the same memory location, so changes to one affect the other!`
        }
      }
    }
    
    // Property modification
    if (trimmed.includes('.') && trimmed.includes('=') && !trimmed.includes('const') && !trimmed.includes('let')) {
      const match = trimmed.match(/(\w+)\.(\w+)\s*=\s*([^;]+)/)
      if (match) {
        const [, objName, property, value] = match
        return `✏️ Changes the "${property}" property of object "${objName}" to ${value.trim()}. The dot (.) is how we access object properties. Since objects are referenced, this change affects all variables pointing to the same object!`
      }
    }
    
    // Console.log with property access
    if (trimmed.includes('console.log') && trimmed.includes('.')) {
      const match = trimmed.match(/console\.log\(([^)]+)\)/)
      if (match) {
        const content = match[1].trim()
        if (content.includes('.')) {
          const [objName, property] = content.split('.')
          return `🖨️ Prints the value of property "${property}" from object "${objName}". The dot (.) accesses the property, so this will print whatever value is currently stored in ${objName}.${property}`
        }
      }
    }
    
    // Array creation
    if (trimmed.includes('[') && trimmed.includes(']')) {
      const match = trimmed.match(/const\s+(\w+)\s*=\s*\[([^\]]*)\]/)
      if (match) {
        const [, varName, elements] = match
        return `📋 Creates an array called "${varName}". Square brackets [ ] create arrays. Elements: ${elements || 'empty'}. Arrays use zero-based indexing (first item is index 0).`
      }
    }
    
    // Function declarations
    if (trimmed.startsWith('function')) {
      const match = trimmed.match(/function\s+(\w+)\s*\(([^)]*)\)/)
      if (match) {
        const [, funcName, params] = match
        return `⚙️ Declares a function named "${funcName}". The parentheses ( ) contain parameters: ${params || 'none'}. Functions are reusable blocks of code.`
      }
    }
    
    // Return statements
    if (trimmed.startsWith('return')) {
      const value = trimmed.replace('return', '').replace(';', '').trim()
      return `🔄 Returns the value: ${value}. This ends the function and sends this value back to wherever the function was called.`
    }
    
    // Let/var declarations
    if (trimmed.startsWith('let') || trimmed.startsWith('var')) {
      const match = trimmed.match(/(let|var)\s+(\w+)\s*=\s*([^;]+)/)
      if (match) {
        const [, keyword, varName, value] = match
        return `📦 Creates a variable "${varName}" with value ${value.trim()}. "${keyword}" is the declaration keyword - ${keyword === 'let' ? 'block-scoped and can be reassigned' : 'function-scoped and can be redeclared'}.`
      }
    }
    
    // Simple console.log
    if (trimmed.includes('console.log')) {
      return `🖨️ Prints output to the console. Whatever is inside the parentheses ( ) gets displayed.`
    }
    
    // Default explanation
    return `📋 Executes: ${trimmed}`
  }

  // Get topic explanation and examples
  const getTopicInfo = (topicId) => {
    const topicInfo = {
      variables: {
        title: "JavaScript Variables", 
        description: "Variables in JavaScript are containers that store data values. You can think of them as labeled boxes that hold information you want to use later in your program.",
        keyPoints: [
          "Variables are declared using 'let', 'const', or 'var'",
          "'let' allows reassignment, 'const' does not", 
          "Variable names should be descriptive and follow camelCase",
          "Variables can store different data types"
        ],
        example: `// Declaring variables
let userName = "Alice";
const age = 25;
let isStudent = true;

// Using variables
console.log("Hello, " + userName);
console.log("Age: " + age);`,
        expectedOutput: `Hello, Alice
Age: 25`,
        explanation: "In this example, we declare three variables with different data types: a string for the name, a number for age, and a boolean for student status."
      },
      arrays: {
        title: "JavaScript Arrays",
        description: "Arrays are ordered lists that can store multiple values in a single variable. Each value has an index (position) starting from 0.",
        keyPoints: [
          "Arrays are created using square brackets []",
          "Elements are accessed using index numbers [0], [1], [2]...",
          "Arrays have many built-in methods like push(), pop(), map()",
          "Arrays can store different data types"
        ],
        example: `// Creating an array
let fruits = ["apple", "banana", "orange"];

// Accessing elements  
console.log(fruits[0]); // "apple"
console.log(fruits.length); // 3

// Adding elements
fruits.push("grape");
console.log(fruits); // ["apple", "banana", "orange", "grape"]`,
        expectedOutput: `apple
3
["apple", "banana", "orange", "grape"]`,
        explanation: "Arrays use zero-based indexing, meaning the first element is at index 0. The length property tells us how many elements are in the array."
      },
      functions: {
        title: "JavaScript Functions",
        description: "Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.",
        keyPoints: [
          "Functions are declared using the 'function' keyword or arrow syntax",
          "Functions can accept parameters (inputs) and return values (outputs)",
          "Functions create their own scope for variables",
          "Functions should have descriptive names that explain what they do"
        ],
        example: `// Function declaration
function greetUser(name) {
    return "Hello, " + name + "!";
}

// Arrow function
const addNumbers = (a, b) => {
    return a + b;
};

// Using functions
console.log(greetUser("Bob")); // "Hello, Bob!"
console.log(addNumbers(5, 3)); // 8`,
        expectedOutput: `Hello, Bob!
8`,
        explanation: "Functions encapsulate code that can be called multiple times with different inputs, making your code more organized and reusable."
      },
      objects: {
        title: "JavaScript Objects", 
        description: "Objects are collections of key-value pairs that represent real-world entities. They group related data and functions together.",
        keyPoints: [
          "Objects are created using curly braces {}",
          "Properties are accessed using dot notation (obj.property) or brackets (obj['property'])",
          "Objects can contain various data types including other objects and functions",
          "Objects are reference types, not primitive types"
        ],
        example: `// Creating an object
let person = {
    name: "Sarah",
    age: 30,
    city: "New York",
    greet: function() {
        return "Hi, I'm " + this.name;
    }
};

// Accessing properties
console.log(person.name); // "Sarah"
console.log(person.greet()); // "Hi, I'm Sarah"

// Adding new properties
person.email = "sarah@email.com";`,
        expectedOutput: `Sarah
Hi, I'm Sarah`,
        explanation: "Objects allow us to group related information together. The 'this' keyword refers to the object itself when used inside object methods."
      },
      loops: {
        title: "JavaScript Loops",
        description: "Loops allow you to execute code repeatedly until a certain condition is met. They're essential for processing collections of data.",
        keyPoints: [
          "for loops are great for iterating a specific number of times",
          "while loops continue until a condition becomes false", 
          "for...of loops iterate over arrays and other iterables",
          "for...in loops iterate over object properties"
        ],
        example: `// For loop
for (let i = 0; i < 5; i++) {
    console.log("Count: " + i);
}

// For...of loop with array
let colors = ["red", "green", "blue"];
for (let color of colors) {
    console.log("Color: " + color);
}

// While loop
let count = 0;
while (count < 3) {
    console.log("While count: " + count);
    count++;
}`,
        expectedOutput: `Count: 0
Count: 1
Count: 2
Count: 3
Count: 4
Color: red
Color: green
Color: blue
While count: 0
While count: 1
While count: 2`,
        explanation: "Different types of loops serve different purposes. Choose the loop type that best fits your specific use case."
      }
    };

    return topicInfo[topicId] || {
      title: "JavaScript Concepts",
      description: "Learn fundamental JavaScript programming concepts and techniques.",
      keyPoints: ["Practice writing clean, readable code", "Understand core programming principles"],
      example: "// Your JavaScript journey starts here!\nconsole.log('Hello, World!');",
      expectedOutput: "Hello, World!",
      explanation: "Keep practicing and you'll master these concepts!"
    };
  };

  // Reset question index when topic or difficulty changes
  useEffect(() => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setUserCode('')
    setResult(null)
  }, [activeTopic, selectedDifficulty])

  // Initialize code when topic changes
  useEffect(() => {
    if (currentTopicQuestion) {
      setUserCode('')
      setResult(null)
      setSelectedAnswer(null)
      setShowResult(false)
      setAboutTabValue(0) // Reset to "About Topic" tab
    }
  }, [activeTopic, currentTopicQuestion, selectedDifficulty])

  // Google-inspired Theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1a73e8', // Google Blue
        light: '#4285f4',
        dark: '#1557b0',
      },
      secondary: {
        main: '#34a853', // Google Green
      },
      success: {
        main: '#34a853', // Google Green
      },
      warning: {
        main: '#fbbc04', // Google Yellow
      },
      error: {
        main: '#ea4335', // Google Red
      },
      background: {
        default: darkMode ? '#202124' : '#ffffff',
        paper: darkMode ? '#303134' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e8eaed' : '#202124',
        secondary: darkMode ? '#9aa0a6' : '#5f6368',
      },
    },
    typography: {
      fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 500,
        letterSpacing: '0',
      },
      h5: {
        fontWeight: 500,
        letterSpacing: '0',
      },
      h6: {
        fontWeight: 500,
        letterSpacing: '0',
      },
      body1: {
        letterSpacing: '0.25px',
      },
      body2: {
        letterSpacing: '0.25px',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
        letterSpacing: '0.25px',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            padding: '8px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
          },
        },
      },
    },
  })

  // Mobile detection
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Show loading state while database loads
  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            backgroundColor: darkMode ? '#202124' : '#ffffff'
          }}
        >
          <CircularProgress size={60} sx={{ color: '#1a73e8', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#5f6368' }}>
            Loading JavaScript Questions...
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368', mt: 1 }}>
            Preparing your learning experience
          </Typography>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Top AppBar - Google Style */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: darkMode ? '#202124' : '#ffffff',
          borderBottom: 1,
          borderBottomColor: darkMode ? '#3c4043' : '#e8eaed',
        }}
      >
        <Toolbar sx={{ minHeight: '64px' }}>
          {/* Mobile Menu Button - Hidden on Desktop */}
          {isMobile && (
            <IconButton
              edge="start"
              onClick={toggleMobileDrawer}
              sx={{ 
                mr: 2,
                color: darkMode ? '#e8eaed' : '#5f6368'
              }}
              aria-label="menu"
            >
              <Menu />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', mr: isMobile ? 1 : 3 }}>
            <Code sx={{ mr: isMobile ? 1 : 2, color: '#1a73e8' }} />
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontWeight: 400,
                fontSize: isMobile ? '18px' : '22px',
                color: darkMode ? '#e8eaed' : '#5f6368',
                letterSpacing: '0',
              }}
            >
              {isMobile ? 'JS Lab' : 'JS Learning Lab'}
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1 : 3 }}>
            {/* Score and Streak - Responsive */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobile ? 1 : 2,
              backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
              borderRadius: '20px',
              px: isMobile ? 1.5 : 2,
              py: 0.5,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmojiEvents sx={{ color: '#fbbc04', fontSize: '18px' }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#3c4043' }}>
                  {score}
                </Typography>
              </Box>
              <Box sx={{ 
                width: '1px', 
                height: '16px', 
                backgroundColor: darkMode ? '#5f6368' : '#dadce0' 
              }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Whatshot sx={{ color: '#ea4335', fontSize: '18px' }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: darkMode ? '#e8eaed' : '#3c4043' }}>
                  {streak}
                </Typography>
              </Box>
            </Box>

            {/* Difficulty Level Select - Google Style */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel sx={{ 
                color: darkMode ? '#9aa0a6' : '#5f6368', 
                '&.Mui-focused': { color: '#1a73e8' },
                fontSize: '14px',
              }}>
                Difficulty
              </InputLabel>
              <Select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                label="Difficulty"
                sx={{
                  borderRadius: '8px',
                  backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#5f6368' : '#dadce0',
                    borderWidth: '1px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1a73e8',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1a73e8',
                    borderWidth: '2px',
                  },
                  '& .MuiSelect-icon': {
                    color: darkMode ? '#9aa0a6' : '#5f6368',
                  }
                }}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="easy">🟢 Easy</MenuItem>
                <MenuItem value="medium">🟡 Medium</MenuItem>
                <MenuItem value="hard">🔴 Hard</MenuItem>
              </Select>
            </FormControl>

            {/* Shuffle Questions Button */}
            <IconButton 
              onClick={handleShuffleQuestions}
              disabled={!databaseQuestions.length}
              sx={{ 
                borderRadius: '50%',
                p: 1,
                backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                color: databaseQuestions.length ? (darkMode ? '#e8eaed' : '#5f6368') : '#9aa0a6',
                '&:hover': {
                  backgroundColor: databaseQuestions.length ? (darkMode ? '#5f6368' : '#e8eaed') : 'transparent',
                },
                '&.Mui-disabled': {
                  color: '#9aa0a6',
                },
              }}
              title="Shuffle Questions"
            >
              <Shuffle />
            </IconButton>

            {/* Theme Toggle - Google Style */}
            <IconButton 
              onClick={() => setDarkMode(!darkMode)} 
              sx={{ 
                borderRadius: '50%',
                p: 1,
                backgroundColor: darkMode ? '#3c4043' : '#f8f9fa',
                color: darkMode ? '#e8eaed' : '#5f6368',
                '&:hover': {
                  backgroundColor: darkMode ? '#5f6368' : '#e8eaed',
                },
              }}
            >
              {darkMode ? <LightMode sx={{ fontSize: '20px' }} /> : <DarkMode sx={{ fontSize: '20px' }} />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onOpen={() => setMobileDrawerOpen(true)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 320,
            backgroundColor: darkMode ? '#292a2d' : '#f8f9fa',
            borderRight: 1,
            borderColor: darkMode ? '#3c4043' : '#e8eaed'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ 
            mb: 3, 
            fontWeight: 600,
            color: darkMode ? '#e8eaed' : '#202124',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <MenuBook sx={{ fontSize: 20, color: '#1a73e8' }} />
            JavaScript Topics
          </Typography>
          
          {/* Mobile Topic List */}
          <List sx={{ p: 0 }}>
            {topics.map((topic) => (
              <ListItemButton
                key={topic.id}
                selected={activeTopic === topic.id}
                onClick={() => {
                  setActiveTopic(topic.id)
                  setCurrentQuestionIndex(0)
                  setSelectedAnswer(null)
                  setShowResult(false)
                  setMobileDrawerOpen(false)
                }}
                sx={{ 
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: activeTopic === topic.id ? '#1a73e8' : 'transparent',
                  color: activeTopic === topic.id ? '#ffffff' : (darkMode ? '#e8eaed' : '#202124'),
                  '&:hover': {
                    backgroundColor: activeTopic === topic.id ? '#1557b0' : (darkMode ? '#3c4043' : '#f1f3f4')
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#1a73e8',
                    '&:hover': {
                      backgroundColor: '#1557b0'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: activeTopic === topic.id ? '#ffffff' : '#1a73e8',
                  minWidth: 36 
                }}>
                  {topic.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={topic.name}
                  primaryTypographyProps={{
                    fontWeight: activeTopic === topic.id ? 600 : 400
                  }}
                />
              </ListItemButton>
            ))}
          </List>

          {/* Mobile Controls */}
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: darkMode ? '#3c4043' : '#e8eaed' }}>
            <Typography variant="subtitle2" sx={{ 
              mb: 2, 
              fontWeight: 600,
              color: darkMode ? '#e8eaed' : '#202124'
            }}>
              Difficulty
            </Typography>
            
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <Select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                sx={{ 
                  backgroundColor: darkMode ? '#3c4043' : '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: darkMode ? '#5f6368' : '#dadce0'
                  }
                }}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="easy">🟢 Easy</MenuItem>
                <MenuItem value="medium">🟡 Medium</MenuItem>
                <MenuItem value="hard">🔴 Hard</MenuItem>
              </Select>
            </FormControl>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                handleShuffleQuestions()
                setMobileDrawerOpen(false)
              }}
              startIcon={<Shuffle />}
              sx={{ 
                mb: 2,
                textTransform: 'none',
                borderColor: darkMode ? '#5f6368' : '#dadce0',
                color: darkMode ? '#e8eaed' : '#202124'
              }}
            >
              Shuffle Questions
            </Button>

            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{ 
                color: darkMode ? '#e8eaed' : '#5f6368',
                backgroundColor: darkMode ? '#3c4043' : '#f1f3f4',
                '&:hover': {
                  backgroundColor: darkMode ? '#5f6368' : '#e8eaed'
                }
              }}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Main Layout - Google Style */}
      <Box sx={{ 
        height: 'calc(100vh - 80px)', 
        display: 'flex',
        backgroundColor: darkMode ? '#202124' : '#ffffff',
      }}>
        {/* Sidebar (Left full height) - Responsive */}
        <Paper 
          elevation={0}
          sx={{ 
            width: 280,
            display: { xs: 'none', md: 'flex' }, // Hide on mobile
            flexDirection: 'column',
            borderRadius: 0,
            borderRight: 1,
            borderColor: darkMode ? '#3c4043' : '#e8eaed',
            backgroundColor: darkMode ? '#292a2d' : '#f8f9fa',
          }}
        >
          {/* Sidebar Header */}
          <Box sx={{ 
            p: 3, 
            borderBottom: 1, 
            borderColor: darkMode ? '#3c4043' : '#e8eaed',
            backgroundColor: darkMode ? '#292a2d' : '#f8f9fa',
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: darkMode ? '#e8eaed' : '#3c4043',
                fontSize: '16px',
              }}
            >
              <MenuBook sx={{ fontSize: 20, color: '#1a73e8' }} />
              JavaScript Topics
            </Typography>
          </Box>

          {/* Navigation Items - Google Style */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {topics.map((topic) => (
              <Box
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: activeTopic === topic.id 
                    ? (darkMode ? '#1a73e8' : '#e8f0fe') 
                    : 'transparent',
                  color: activeTopic === topic.id 
                    ? (darkMode ? '#ffffff' : '#1a73e8')
                    : (darkMode ? '#e8eaed' : '#3c4043'),
                  '&:hover': {
                    backgroundColor: activeTopic === topic.id 
                      ? (darkMode ? '#1557b0' : '#d2e3fc')
                      : (darkMode ? '#3c4043' : '#f1f3f4'),
                  },
                  transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
                  border: activeTopic === topic.id 
                    ? `1px solid ${darkMode ? '#1a73e8' : '#dadce0'}` 
                    : '1px solid transparent',
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    fontWeight: activeTopic === topic.id ? 500 : 400,
                    fontSize: '14px',
                    letterSpacing: '0.25px',
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{topic.icon}</span>
                  {topic.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Main Content Area - Google Style */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Content (Top 60%) - Responsive */}
          <Box sx={{ 
            height: isMobile ? 'auto' : '60%', 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            borderBottom: isMobile ? 0 : 1, 
            borderColor: darkMode ? '#3c4043' : '#e8eaed',
          }}>
            {/* Question (Left 50%) - Responsive */}
            <Paper 
              elevation={0}
              sx={{ 
                width: isMobile ? '100%' : '50%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                borderRight: isMobile ? 0 : 1,
                borderBottom: isMobile ? 1 : 0,
                borderColor: darkMode ? '#3c4043' : '#e8eaed',
                backgroundColor: darkMode ? '#292a2d' : '#ffffff',
              }}
            >
              <Box sx={{ 
                p: 3, 
                borderBottom: 1, 
                borderColor: darkMode ? '#3c4043' : '#e8eaed',
                backgroundColor: darkMode ? '#1f2022' : '#f8f9fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 500,
                  fontFamily: 'Google Sans, Roboto, sans-serif',
                  color: darkMode ? '#e8eaed' : '#202124',
                }}>
                  Question
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="body2" sx={{ 
                    px: 2, 
                    py: 0.8, 
                    backgroundColor: darkMode ? '#3c4043' : '#f1f3f4', 
                    color: darkMode ? '#e8eaed' : '#202124',
                    borderRadius: '16px',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    fontFamily: 'Google Sans, Roboto, sans-serif',
                  }}>
                    {currentQuestionIndex + 1} / {topicQuestions.length}
                    {selectedDifficulty !== 'all' && (
                      <Box component="span" sx={{ ml: 1, opacity: 0.8 }}>
                        ({selectedDifficulty === 'easy' ? '🟢' : selectedDifficulty === 'medium' ? '🟡' : '🔴'})
                      </Box>
                    )}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    onClick={() => setShowTopicInfo(true)}
                    sx={{ 
                      px: 2, 
                      py: 0.8, 
                      backgroundColor: '#1a73e8', 
                      color: '#ffffff',
                      borderRadius: '16px',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      fontFamily: 'Google Sans, Roboto, sans-serif',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#1557b2',
                        boxShadow: '0 2px 8px rgba(26, 115, 232, 0.3)'
                      }
                    }}>
                    {topics.find(t => t.id === activeTopic)?.name || activeTopic}
                  </Typography>
                  {currentTopicQuestion && (
                    <Typography variant="body2" sx={{ 
                      px: 2, 
                      py: 0.8, 
                      backgroundColor: currentDifficulty === 'easy' ? '#34a853' : 
                                     currentDifficulty === 'medium' ? '#fbbc04' : '#ea4335',
                      color: '#ffffff',
                      borderRadius: '16px',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      fontFamily: 'Google Sans, Roboto, sans-serif',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: currentDifficulty === 'easy' ? '#2d8f42' : 
                                       currentDifficulty === 'medium' ? '#f9ab00' : '#d33b2f',
                      }
                    }}>
                      {currentDifficulty}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                {currentTopicQuestion && topicQuestions.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Question Text */}
                    <Typography variant="h6" sx={{ 
                      fontWeight: 400, 
                      fontSize: '1.125rem',
                      color: darkMode ? '#e8eaed' : '#202124',
                      fontFamily: 'Google Sans, Roboto, sans-serif',
                      lineHeight: 1.5,
                      mb: 1
                    }}>
                      {currentTopicQuestion.question}
                    </Typography>

                    {/* Code Sample */}
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        backgroundColor: '#272822',
                        borderColor: darkMode ? '#3c4043' : '#e8eaed',
                        fontFamily: 'monospace',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        boxShadow: darkMode 
                          ? '0 1px 3px rgba(0,0,0,0.3)' 
                          : '0 1px 3px rgba(60,64,67,0.3)',
                      }}
                    >
                      <Box sx={{ height: '150px' }}>
                        <CodeEditor 
                          value={normalizedQuestion?.starterCode || ''}
                          onChange={() => {}} // Read-only
                          readOnly={true}
                        />
                      </Box>
                    </Paper>

                    {/* Multiple Choice Options */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Choose the correct output:
                      </Typography>
                      
                      {/* 2x2 Grid Layout for Multiple Choice */}
                      <RadioGroup
                        value={selectedAnswer || ''}
                        onChange={(e) => handleAnswerSelect(e.target.value)}
                      >
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: '1fr 1fr', 
                          gap: isMobile ? 2 : 1 
                        }}>
                          {getMultipleChoiceOptions(currentTopicQuestion).map((option) => (
                            <FormControlLabel
                              key={option.id}
                              value={option.id}
                              control={<Radio size={isMobile ? "medium" : "small"} />}
                              label={
                                <Typography variant="body2" sx={{ 
                                  fontFamily: 'monospace', 
                                  fontSize: isMobile ? '0.9rem' : '0.875rem'
                                }}>
                                  {option.id}. {option.text}
                                </Typography>
                              }
                              sx={{ 
                                margin: 0,
                                p: isMobile ? 2 : 1,
                                border: 1,
                                borderRadius: isMobile ? 2 : 1,
                                borderColor: selectedAnswer === option.id ? 'primary.main' : 'divider',
                                backgroundColor: selectedAnswer === option.id ? 'primary.light' : 'transparent',
                                minHeight: isMobile ? 56 : 'auto',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  backgroundColor: 'primary.light'
                                },
                                transition: 'all 0.2s ease',
                                '& .MuiFormControlLabel-label': {
                                  fontSize: '0.875rem'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </RadioGroup>
                    </Box>

                    {/* Submit Button */}
                    <Button
                      variant="contained"
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Submit Answer
                    </Button>

                    {/* Result */}
                    {showResult && (
                      <Alert 
                        severity={getMultipleChoiceOptions(currentTopicQuestion).find(o => o.id === selectedAnswer)?.isCorrect ? 'success' : 'error'}
                        sx={{ mt: 2 }}
                      >
                        <Typography variant="body2">
                          {getMultipleChoiceOptions(currentTopicQuestion).find(o => o.id === selectedAnswer)?.isCorrect 
                            ? '🎉 Correct! Great job!' 
                            : '❌ Incorrect. Try again!'}
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                )}
                
                {/* No Questions Available Message */}
                {topicQuestions.length === 0 && (
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    py: 4,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                      📚 No Questions Available
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      No {selectedDifficulty !== 'all' ? selectedDifficulty + ' level ' : ''}questions found for {topics.find(t => t.id === activeTopic)?.name || activeTopic}.
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Try selecting a different difficulty level or topic.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Code Editor (Right 50%) - Responsive */}
            <Paper 
              elevation={0}
              sx={{ 
                width: isMobile ? '100%' : '50%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                backgroundColor: darkMode ? '#292a2d' : '#ffffff',
              }}
            >
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                backgroundColor: darkMode ? '#1f2022' : '#f8f9fa',
                borderBottom: 1,
                borderColor: darkMode ? '#3c4043' : '#e8eaed',
                minHeight: 48
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  px: 3,
                  py: 1.5,
                  backgroundColor: darkMode ? '#292a2d' : '#ffffff',
                  borderTopRightRadius: '8px',
                  borderRight: 1,
                  borderColor: darkMode ? '#3c4043' : '#e8eaed',
                  borderTop: 3,
                  borderTopColor: '#1a73e8',
                  gap: 1
                }}>
                  <Code sx={{ fontSize: 16, color: darkMode ? '#e8eaed' : '#5f6368' }} />
                  <Typography variant="body2" sx={{
                    fontWeight: 500,
                    fontFamily: 'Google Sans, Roboto, sans-serif',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}>
                    script.js
                  </Typography>
                </Box>
                
                <Box sx={{ ml: 'auto', pr: 3, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={resetCode}
                    startIcon={<Refresh />}
                    sx={{
                      fontFamily: 'Google Sans, Roboto, sans-serif',
                      fontWeight: 500,
                      color: darkMode ? '#aecbfa' : '#1a73e8',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: darkMode ? 'rgba(174, 203, 250, 0.08)' : 'rgba(26, 115, 232, 0.08)',
                      }
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ 
                flex: 1, 
                overflow: 'hidden',
                minHeight: isMobile ? '300px' : '400px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CodeEditor 
                  value={userCode}
                  onChange={setUserCode}
                  darkMode={true}
                />
              </Box>
            </Paper>
          </Box>

          {/* Bottom Area (40%) - Responsive */}
          <Box sx={{ 
            height: isMobile ? 'auto' : '40%', 
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            {/* About Question (Left 50%) - Responsive */}
            <Paper 
              elevation={0}
              sx={{ 
                width: isMobile ? '100%' : '50%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                borderRight: isMobile ? 0 : 1,
                borderBottom: isMobile ? 1 : 0,
                borderColor: darkMode ? '#3c4043' : '#e8eaed',
                backgroundColor: darkMode ? '#292a2d' : '#ffffff',
              }}
            >
              <Box sx={{ 
                borderBottom: 1, 
                borderColor: darkMode ? '#3c4043' : '#e8eaed',
                backgroundColor: darkMode ? '#1f2022' : '#f8f9fa'
              }}>
                <Tabs 
                  value={aboutTabValue} 
                  onChange={(event, newValue) => setAboutTabValue(newValue)}
                  sx={{ minHeight: 48 }}
                >
                  <Tab label="About Question" sx={{ textTransform: 'none', fontWeight: 600 }} />
                  <Tab label="How to Solve" sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {/* About Question Tab */}
                {aboutTabValue === 0 && currentTopicQuestion && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      � About {topics.find(t => t.id === activeTopic)?.name || activeTopic}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      {(() => {
                        const topicInfo = getTopicInfo(activeTopic);
                        return (
                          <>
                            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                              {topicInfo.description}
                            </Typography>
                            
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                              💡 Key Concepts:
                            </Typography>
                            {topicInfo.keyPoints.map((point, index) => (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                  •
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                                  {point}
                                </Typography>
                              </Box>
                            ))}
                          </>
                        );
                      })()}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      {(() => {
                        const topicInfo = getTopicInfo(activeTopic);
                        return (
                          <>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                              💻 Example Code:
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                              Here's a practical example demonstrating {topics.find(t => t.id === activeTopic)?.name || activeTopic} concepts:
                            </Typography>
                            <Paper sx={{ 
                              p: 1.5, 
                              backgroundColor: '#272822',
                              borderColor: '#49483e',
                              border: '1px solid #49483e',
                              mb: 2
                            }}>
                              <Typography 
                                component="pre" 
                                variant="body2" 
                                sx={{ 
                                  color: '#f8f8f2',
                                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                  margin: 0,
                                  fontSize: '0.9rem',
                                  lineHeight: 1.4,
                                  whiteSpace: 'pre-wrap'
                                }}
                              >
                                {topicInfo.example}
                              </Typography>
                            </Paper>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5, fontStyle: 'italic' }}>
                              {topicInfo.explanation}
                            </Typography>
                            
                            {/* Expected Output Section */}
                            <Box sx={{ mt: 3 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                                ✅ Expected Output:
                              </Typography>
                              <Typography variant="body2" sx={{ mb: 2 }}>
                                When you run this code, it produces:
                              </Typography>
                              <Paper sx={{ 
                                p: 1.5, 
                                backgroundColor: '#1e1e1e',
                                borderColor: '#4CAF50',
                                border: '1px solid #4CAF50'
                              }}>
                                <Typography 
                                  component="pre" 
                                  variant="body2" 
                                  sx={{ 
                                    color: '#4CAF50',
                                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                    margin: 0,
                                    fontSize: '0.9rem',
                                    lineHeight: 1.4,
                                    whiteSpace: 'pre-wrap'
                                  }}
                                >
                                  {topicInfo.expectedOutput}
                                </Typography>
                              </Paper>
                            </Box>
                          </>
                        );
                      })()}
                    </Box>

                    {currentTopicQuestion.starterCode && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                          � Code Sample:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          The code below is what you need to analyze. Read through it carefully and predict what will happen when it runs.
                        </Typography>
                        <Paper sx={{ 
                          p: 1.5, 
                          backgroundColor: '#272822',
                          borderColor: '#49483e',
                          border: '1px solid #49483e',
                          mb: 2
                        }}>
                          <Typography 
                            component="pre" 
                            variant="body2" 
                            sx={{ 
                              color: '#f8f8f2',
                              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                              margin: 0,
                              fontSize: '0.9rem',
                              lineHeight: 1.4
                            }}
                          >
                            {currentTopicQuestion.starterCode}
                          </Typography>
                        </Paper>
                        
                        {/* Syntax Breakdown Section */}
                        <Box sx={{ mt: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                            🔍 Breaking Down the Syntax:
                          </Typography>
                          {currentTopicQuestion.starterCode && (
                            <Box>
                              {currentTopicQuestion.starterCode.split('\n').map((line, index) => {
                                const trimmedLine = line.trim()
                                if (!trimmedLine || trimmedLine.startsWith('//')) return null
                                
                                return (
                                  <Box key={index} sx={{ mb: 2, pl: 1, borderLeft: '3px solid', borderLeftColor: 'primary.light' }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                        backgroundColor: '#f5f5f5',
                                        p: 1,
                                        borderRadius: 0.5,
                                        mb: 1,
                                        fontSize: '0.85rem'
                                      }}
                                    >
                                      {trimmedLine}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                      {enhanceTextWithKeywords(getLineExplanation(trimmedLine))}
                                    </Typography>
                                  </Box>
                                )
                              })}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}



                    {currentTopicQuestion.hint && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                          � Helpful Hint:
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          mb: 2, 
                          fontStyle: 'italic',
                          backgroundColor: 'info.light',
                          color: 'info.contrastText',
                          p: 2,
                          borderRadius: 1
                        }}>
                          {currentTopicQuestion.hint}
                        </Typography>
                      </Box>
                    )}

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        🤔 How to Approach:
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        1. Read the code carefully from top to bottom<br/>
                        2. Track what happens to each <ClickableKeyword keyword="variable">variable</ClickableKeyword><br/>
                        3. Consider the order of operations<br/>
                        4. Think about what gets logged or returned<br/>
                        5. Enter your prediction in the code editor and run it to check!
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* How to Solve Tab */}
                {aboutTabValue === 1 && currentTopicQuestion && (
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                      � How to Solve This Question
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        📋 What You Need to Do:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {enhanceTextWithKeywords(normalizedQuestion?.question || '')}
                      </Typography>
                    </Box>

                    {currentTopicQuestion.starterCode && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                          💻 Question Code:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          The code below is what you need to analyze. Read through it carefully and predict what will happen when it runs.
                        </Typography>
                        <Paper sx={{ 
                          p: 1.5, 
                          backgroundColor: '#272822',
                          borderColor: '#49483e',
                          border: '1px solid #49483e',
                          mb: 2
                        }}>
                          <Typography 
                            component="pre" 
                            variant="body2" 
                            sx={{ 
                              color: '#f8f8f2',
                              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                              margin: 0,
                              fontSize: '0.9rem',
                              lineHeight: 1.4
                            }}
                          >
                            {currentTopicQuestion.starterCode}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                    

                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        💡 What to Look For:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                        {currentTopicQuestion.hint || 'Look at the code structure and try to understand what each part does.'}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                        🔍 Code Breakdown:
                      </Typography>
                      {(currentTopicQuestion.starterCode || currentTopicQuestion.code) && generateCodeBreakdown(currentTopicQuestion.starterCode || currentTopicQuestion.code).map((step, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Typography variant="caption" sx={{ 
                              backgroundColor: 'primary.main', 
                              color: 'white', 
                              px: 1, 
                              py: 0.5, 
                              borderRadius: 1,
                              fontWeight: 600,
                              minWidth: '30px',
                              textAlign: 'center'
                            }}>
                              {step.lineNumber}
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              <Paper sx={{ 
                                p: 1, 
                                mb: 1,
                                backgroundColor: '#272822',
                                borderColor: '#49483e',
                                border: '1px solid #49483e'
                              }}>
                                <Typography 
                                  component="pre" 
                                  variant="body2" 
                                  sx={{ 
                                    color: '#f8f8f2',
                                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                                    margin: 0,
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  {step.code}
                                </Typography>
                              </Paper>
                              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
                                {step.explanation}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                      {!(currentTopicQuestion.starterCode || currentTopicQuestion.code) && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                            No starter code available for this question.
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        🔍 Why This Happens:
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {currentTopicQuestion.explanation}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                        ✅ Final Output:
                      </Typography>
                      <Paper sx={{ 
                        p: 1.5, 
                        backgroundColor: '#272822',
                        borderColor: '#a6e22e',
                        border: '2px solid #a6e22e'
                      }}>
                        <Typography 
                          component="pre" 
                          variant="body2" 
                          sx={{ 
                            color: '#a6e22e',
                            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                            margin: 0,
                            fontSize: '0.9rem',
                            fontWeight: 600
                          }}
                        >
                          {normalizedQuestion?.expectedOutput || currentTopicQuestion.expectedOutput}
                        </Typography>
                      </Paper>
                    </Box>

                    <Alert severity="success" sx={{ mt: 2 }}>
                      <strong>💡 Pro Tip:</strong> Walk through each line mentally before selecting your answer. Understanding the execution order is key!
                    </Alert>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Console (Right 50%) - Responsive */}
            <Paper 
              elevation={0}
              sx={{ 
                width: isMobile ? '100%' : '50%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                backgroundColor: darkMode ? '#292a2d' : '#ffffff',
              }}
            >
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                backgroundColor: darkMode ? '#1f2022' : '#f8f9fa',
                borderBottom: 1,
                borderColor: darkMode ? '#3c4043' : '#e8eaed',
                minHeight: 48
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  px: 3,
                  py: 1.5,
                  backgroundColor: darkMode ? '#292a2d' : '#ffffff',
                  borderTopRightRadius: '8px',
                  borderRight: 1,
                  borderTop: 3,
                  borderColor: darkMode ? '#3c4043' : '#e8eaed',
                  borderTopColor: '#34a853',
                  gap: 1
                }}>
                  <Terminal sx={{ fontSize: 16, color: darkMode ? '#e8eaed' : '#5f6368' }} />
                  <Typography variant="body2" sx={{
                    fontWeight: 500,
                    fontFamily: 'Google Sans, Roboto, sans-serif',
                    color: darkMode ? '#e8eaed' : '#202124',
                  }}>
                    Console
                  </Typography>
                </Box>
                
                <Box sx={{ ml: 'auto', pr: 3 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={runCode}
                    startIcon={<PlayArrow />}
                    sx={{ 
                      borderRadius: '24px',
                      backgroundColor: '#34a853',
                      fontFamily: 'Google Sans, Roboto, sans-serif',
                      fontWeight: 500,
                      textTransform: 'none',
                      px: 3,
                      py: 1,
                      boxShadow: '0 1px 3px rgba(60,64,67,0.3)',
                      '&:hover': {
                        backgroundColor: '#2d8f42',
                        boxShadow: '0 2px 8px rgba(52, 168, 83, 0.3)',
                      }
                    }}
                  >
                    Run
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ 
                flex: 1, 
                overflow: 'auto', 
                p: 3, 
                backgroundColor: '#272822',
                color: '#f8f8f2',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}>
                {result ? (
                  <Fade in timeout={300}>
                    <div>
                      <ResultDisplay 
                        result={result} 
                      />
                    </div>
                  </Fade>
                ) : (
                  <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#75715e'
                  }}>
                    <Terminal sx={{ fontSize: 48, mb: 2, opacity: 0.3, color: '#49483e' }} />
                    <Typography variant="body1" sx={{ color: '#75715e' }}>
                      Click "Run" to execute your code
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: '#49483e' }}>
                      Output will appear here
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* Topic Information Dialog */}
      <Dialog 
        open={showTopicInfo} 
        onClose={() => setShowTopicInfo(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
            📚 {topics.find(t => t.id === activeTopic)?.name || activeTopic}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            {activeTopic === 'variables' && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  Variables are containers for storing data values. In JavaScript, you can declare variables using <strong>var</strong>, <strong>let</strong>, or <strong>const</strong> keywords.
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
                  📚 Variable Declaration Syntax:
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <code>var name = value;</code> - Function-scoped, can be redeclared
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <code>let name = value;</code> - Block-scoped, cannot be redeclared
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <code>const name = value;</code> - Block-scoped, cannot be reassigned
                  </Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
                  🔍 Data Types You'll See:
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Numbers:</strong> <code>let x = 5;</code> <code>let y = 3.14;</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Strings:</strong> <code>let name = "Hello";</code> <code>let msg = 'World';</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Booleans:</strong> <code>let isTrue = true;</code> <code>let isFalse = false;</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Objects:</strong> <code>{`let obj = { x: 1, y: 2 };`}</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Arrays:</strong> <code>let arr = [1, 2, 3];</code>
                  </Typography>
                </Box>
                
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', mt: 2 }}>
                  Key concept: Variables store references to values, and understanding scope and hoisting is crucial for predicting code behavior.
                </Typography>
              </Box>
            )}
            
            {activeTopic === 'arrays' && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  Arrays are ordered collections that can hold multiple values in a single variable. Each element has an index position starting from 0.
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
                  📚 Array Syntax:
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Creation:</strong> <code>let arr = [1, 2, 3];</code> or <code>let arr = new Array();</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Access:</strong> <code>arr[0]</code> gets first element, <code>arr[1]</code> gets second
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Length:</strong> <code>arr.length</code> returns number of elements
                  </Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
                  🔧 Common Methods:
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <code>arr.push(item)</code> - Adds to end
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <code>arr.pop()</code> - Removes from end
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <code>arr.slice(start, end)</code> - Creates a copy of portion
                  </Typography>
                </Box>
              </Box>
            )}
            
            {activeTopic === 'objects' && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  Objects are collections of key-value pairs that represent real-world entities. They're fundamental to JavaScript programming.
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
                  📚 Object Syntax:
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Object Literal:</strong> <code>{`{ key: value, name: "John", age: 25 }`}</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Dot notation:</strong> <code>obj.property</code> or <code>obj.method()</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Bracket notation:</strong> <code>obj["property"]</code> or <code>obj[variable]</code>
                  </Typography>
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
                  🔍 What <code>{`{ x: 1 }`}</code> means:
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    This creates an object with one property named "x" that has the value 1. You can access it with <code>obj.x</code> which returns <code>1</code>.
                  </Typography>
                </Box>
              </Box>
            )}
            
            {activeTopic === 'functions' && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  Functions are reusable blocks of code designed to perform specific tasks. They can accept parameters and return values.
                </Typography>
                
                <Typography variant="h6" sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
                  📚 Function Syntax:
                </Typography>
                <Box sx={{ ml: 2, mb: 3 }}>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Declaration:</strong> <code>function name(params) {`{ return value; }`}</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Expression:</strong> <code>const fn = function(params) {`{ return value; }`};</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Arrow Function:</strong> <code>const fn = (params) =&gt; value;</code>
                  </Typography>
                  <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                    • <strong>Call:</strong> <code>functionName(arguments)</code>
                  </Typography>
                </Box>
              </Box>
            )}
            
            {(activeTopic === 'loops' || activeTopic === 'closures' || activeTopic === 'promises' || activeTopic === 'es6' || activeTopic === 'dom') && (
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {activeTopic === 'loops' && 
                  'Loops allow you to execute code repeatedly based on conditions. Common types include for loops (counting), while loops (condition-based), and forEach loops (array iteration). Loops are essential for processing collections of data and automating repetitive tasks.'
                }
                {activeTopic === 'closures' && 
                  'Closures occur when an inner function has access to variables from its outer (enclosing) function even after the outer function has finished executing. They are powerful for creating private variables, function factories, and maintaining state in functional programming.'
                }
                {activeTopic === 'promises' && 
                  'Promises represent the eventual completion (or failure) of an asynchronous operation. They provide a cleaner alternative to callbacks for handling async code. Promises have three states: pending, fulfilled, or rejected, and can be chained with .then() and .catch().'
                }
                {activeTopic === 'es6' && 
                  'ES6 (ECMAScript 2015) introduced many modern JavaScript features like arrow functions, template literals, destructuring, spread operator, classes, modules, and more. These features make JavaScript code more concise, readable, and powerful.'
                }
                {activeTopic === 'dom' && 
                  'The DOM represents the structure of HTML documents as a tree of objects. JavaScript can manipulate the DOM to dynamically change content, structure, and styling of web pages. Common operations include selecting elements, modifying content, and handling events.'
                }
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTopicInfo(false)} variant="contained">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}

export default App