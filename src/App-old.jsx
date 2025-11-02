import { useState, useEffect } from 'react'
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
  Fade
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
  MenuBook
} from '@mui/icons-material'

import { questions } from './data/questions'
import CodeEditor from './components/CodeEditor'
import ResultDisplay from './components/ResultDisplay'

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
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [userCode, setUserCode] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  // Get questions for active topic
  const getTopicQuestions = (topicId) => {
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
    return questions.filter(q => q.category === topicMap[topicId])
  }

  const topicQuestions = getTopicQuestions(activeTopic)
  const currentTopicQuestion = topicQuestions[0] // For now, use first question

  // Multiple choice options
  const getMultipleChoiceOptions = (question) => {
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
  }

  const handleSubmitAnswer = () => {
    setShowResult(true)
  }

  const resetCode = () => {
    setUserCode(currentTopicQuestion?.starterCode || '')
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

  // Initialize code when topic changes
  useEffect(() => {
    if (currentTopicQuestion) {
      setUserCode(currentTopicQuestion.starterCode || '')
      setResult(null)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }, [activeTopic, currentTopicQuestion])

  // Theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2563eb',
      },
      success: {
        main: '#059669',
      },
      warning: {
        main: '#d97706',
      },
      error: {
        main: '#dc2626',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Top AppBar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Code sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            JS Learning Lab
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmojiEvents sx={{ color: 'warning.main' }} />
                <Typography variant="body2">{score}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Whatshot sx={{ color: 'error.main' }} />
                <Typography variant="body2">{streak}</Typography>
              </Box>
            </Box>

            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Layout */}
      <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex' }}>
        {/* Sidebar (Left full height) */}
        <Paper 
          elevation={0}
          sx={{ 
            width: 280,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 0,
            borderRight: 1,
            borderColor: 'divider',
            backgroundColor: 'grey.50'
          }}
        >
          {/* Sidebar Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <MenuBook sx={{ fontSize: 20 }} />
              JavaScript Topics
            </Typography>
          </Box>

          {/* Navigation Items */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
            {topics.map((topic) => (
              <Box
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  backgroundColor: activeTopic === topic.id ? 'primary.light' : 'transparent',
                  color: activeTopic === topic.id ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    backgroundColor: activeTopic === topic.id ? 'primary.light' : 'grey.100'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 2, fontWeight: 500 }}>
                  <span style={{ fontSize: '1.2rem' }}>{topic.icon}</span>
                  {topic.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Content (Top 50%) */}
          <Box sx={{ height: '50%', display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
            {/* Question (Left 50%) */}
            <Paper 
              elevation={0}
              sx={{ 
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                borderRight: 1,
                borderColor: 'divider'
              }}
            >
              <Box sx={{ 
                p: 2, 
                borderBottom: 1, 
                borderColor: 'divider',
                backgroundColor: 'grey.50'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Question
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                {currentTopicQuestion && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Question Text */}
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {currentTopicQuestion.question}
                    </Typography>

                    {/* Code Sample */}
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2,
                        backgroundColor: 'grey.50',
                        fontFamily: 'monospace'
                      }}
                    >
                      <Typography 
                        component="pre" 
                        variant="body2"
                        sx={{ 
                          margin: 0,
                          fontSize: '0.9rem',
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.4
                        }}
                      >
                        {currentTopicQuestion.starterCode}
                      </Typography>
                    </Paper>

                    {/* Multiple Choice Options */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                        Choose the correct output:
                      </Typography>
                      
                      {getMultipleChoiceOptions(currentTopicQuestion).map((option) => (
                        <Box
                          key={option.id}
                          onClick={() => handleAnswerSelect(option.id)}
                          sx={{
                            p: 2,
                            mb: 1,
                            border: 1,
                            borderColor: selectedAnswer === option.id ? 'primary.main' : 'divider',
                            borderRadius: 2,
                            cursor: 'pointer',
                            backgroundColor: selectedAnswer === option.id ? 'primary.light' : 'background.paper',
                            '&:hover': {
                              borderColor: 'primary.main',
                              backgroundColor: 'primary.light'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Typography variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                            {option.id}. {option.text}
                          </Typography>
                        </Box>
                      ))}
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
              </Box>
            </Paper>

            {/* About Topic (Right 50%) */}
            <Paper 
              elevation={0}
              sx={{ 
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0
              }}
            >
              <Box sx={{ 
                p: 2, 
                borderBottom: 1, 
                borderColor: 'divider',
                backgroundColor: 'grey.50'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  About {topics.find(t => t.id === activeTopic)?.name}
                </Typography>
              </Box>
              
              <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {activeTopic === 'variables' && 
                    'Variables are containers for storing data values. In JavaScript, you can declare variables using var, let, or const keywords. Variables can hold different types of data like numbers, strings, booleans, objects, and more. Understanding variable scope and hoisting is crucial for writing effective JavaScript code.'
                  }
                  {activeTopic === 'arrays' && 
                    'Arrays are ordered collections of items (elements) that can hold multiple values in a single variable. Each element has an index position starting from 0. Arrays provide many built-in methods like push(), pop(), slice(), map(), filter(), and reduce() for manipulation and transformation.'
                  }
                  {activeTopic === 'functions' && 
                    'Functions are reusable blocks of code designed to perform specific tasks. They can accept parameters (inputs) and return values (outputs). Functions help organize code, avoid repetition, and create modular programs. JavaScript supports function declarations, expressions, and arrow functions.'
                  }
                  {activeTopic === 'objects' && 
                    'Objects are collections of key-value pairs that represent real-world entities. Properties store data, while methods are functions that belong to the object. Objects are fundamental to JavaScript and enable object-oriented programming patterns.'
                  }
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
                  {activeTopic === 'async' && 
                    'Async/await is a syntax for working with asynchronous code that makes it look and behave more like synchronous code. The async keyword declares an asynchronous function, while await pauses execution until a Promise resolves, making async code easier to read and debug.'
                  }
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Bottom Area (50%) */}
          <Box sx={{ height: '50%', display: 'flex' }}>
            {/* Code Input Area (Left 50%) */}
            <Paper 
              elevation={0}
              sx={{ 
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0,
                borderRight: 1,
                borderColor: 'divider'
              }}
            >
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'grey.100',
                borderBottom: 1,
                borderColor: 'divider',
                minHeight: 48
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  backgroundColor: 'background.paper',
                  borderTopRightRadius: 1,
                  borderRight: 1,
                  borderTop: 3,
                  borderColor: 'primary.main',
                  gap: 1
                }}>
                  <Code sx={{ fontSize: 16 }} />
                  <Typography variant="body2" fontWeight={600}>
                    script.js
                  </Typography>
                </Box>
                
                <Box sx={{ ml: 'auto', pr: 2, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={resetCode}
                    startIcon={<Refresh />}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <CodeEditor 
                  value={userCode}
                  onChange={setUserCode}
                  darkMode={darkMode}
                />
              </Box>
            </Paper>

            {/* Console (Right 50%) */}
            <Paper 
              elevation={0}
              sx={{ 
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 0
              }}
            >
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'grey.100',
                borderBottom: 1,
                borderColor: 'divider',
                minHeight: 48
              }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1,
                  backgroundColor: 'background.paper',
                  borderTopRightRadius: 1,
                  borderRight: 1,
                  borderTop: 3,
                  borderColor: 'success.main',
                  gap: 1
                }}>
                  <Terminal sx={{ fontSize: 16 }} />
                  <Typography variant="body2" fontWeight={600}>
                    Console
                  </Typography>
                </Box>
                
                <Box sx={{ ml: 'auto', pr: 2 }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={runCode}
                    startIcon={<PlayArrow />}
                    sx={{ borderRadius: 2 }}
                  >
                    Run
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                {result ? (
                  <Fade in timeout={300}>
                    <div>
                      <ResultDisplay 
                        result={result} 
                        onShowExplanation={() => setShowExplanation(true)}
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
                    color: 'text.secondary'
                  }}>
                    <Terminal sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
                    <Typography variant="body1">
                      Click "Run" to execute your code
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Output will appear here
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

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