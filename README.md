# JS Learning Lab 🚀

**Tagline:** *Sharpen your JavaScript skills — one random question at a time.*

A modern, interactive web application for practicing JavaScript concepts through randomized coding challenges. Perfect for developers looking to improve their JavaScript knowledge with hands-on practice.

![JS Challenge Lab Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=JS+Challenge+Lab)

## ✨ Features

### 🎯 Core Functionality
- **Random Question Generator**: Practice with questions covering arrays, scope, closures, promises, and more
- **Difficulty Levels**: Choose from Beginner, Intermediate, or Advanced challenges
- **Category Filtering**: Focus on specific topics like Functions, Objects, Async/Await, etc.
- **Interactive Code Editor**: Powered by Monaco Editor with syntax highlighting and auto-formatting
- **Real-time Code Execution**: Run your JavaScript code safely in a sandboxed environment
- **Instant Feedback**: Compare your output with expected results

### 🎮 Learning Features
- **Smart Hint System**: Get contextual hints when you're stuck
- **Detailed Explanations**: Understand the "why" behind each answer
- **Progress Tracking**: Monitor your score and current streak
- **Gamification**: Streak counters and score tracking to keep you motivated

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes for comfortable coding
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Clean Interface**: Distraction-free environment focused on learning

## 🛠️ Tech Stack

| Purpose | Technology |
|---------|------------|
| **Frontend** | React 18 + Vite |
| **Code Editor** | Monaco Editor (VS Code's editor) |
| **Styling** | Material UI + Custom CSS |
| **Icons** | Lucide React |
| **Code Execution** | Safe JavaScript eval with custom console |
| **Build Tool** | Vite |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd js-challenge-lab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📚 Question Categories

- **Variables**: Basic variable assignment and primitives
- **Arrays**: Array methods, manipulation, and iteration
- **Strings**: String methods and manipulation
- **Objects**: Object properties, methods, and references
- **Functions**: Function declarations, expressions, and scope
- **Scope**: Variable scope, hoisting, and closure concepts
- **Closures**: Advanced closure patterns and use cases
- **Promises**: Asynchronous programming with Promises
- **Async/Await**: Modern async programming patterns
- **Prototypes**: Prototype chain and inheritance
- **Operators**: Type coercion and operator behavior
- **Boolean**: Truthy/falsy values and boolean logic
- **Array Methods**: map, filter, reduce, and other array methods
- **Destructuring**: Object and array destructuring patterns

## 🎯 How to Use

1. **Select Your Level**: Choose from Beginner, Intermediate, or Advanced
2. **Pick a Category**: Focus on specific JavaScript concepts or select "All"
3. **Read the Question**: Understand what the code should output
4. **Write/Modify Code**: Use the Monaco editor to write your solution
5. **Run Your Code**: Click "Run Code" to execute and see results
6. **Get Feedback**: Compare your output with the expected result
7. **Learn More**: Use hints and explanations to understand concepts
8. **Track Progress**: Monitor your score and maintain your streak!

## 🔧 Project Structure

```
src/
├── components/
│   ├── CodeEditor.jsx       # Monaco editor wrapper
│   ├── QuestionDisplay.jsx  # Question rendering component
│   ├── ResultDisplay.jsx    # Results and feedback component
│   └── ProgressBar.jsx      # Progress tracking (optional)
├── data/
│   └── questions.js         # Question database
├── App.jsx                  # Main application component
├── index.css                # Global styles and Tailwind imports
└── main.jsx                 # React application entry point
```

## 🎨 Customization

### Adding New Questions

Edit `src/data/questions.js` to add new challenges:

```javascript
{
  id: 15,
  difficulty: "intermediate",
  category: "Arrays",
  question: "What will be the output of the following code?",
  starterCode: `const arr = [1, 2, 3];
console.log(arr.push(4));`,
  expectedOutput: "4",
  hint: "The push method returns the new length of the array.",
  explanation: "Array.push() adds elements to the end and returns the new length."
}
```

### Styling

The app uses Tailwind CSS with custom color schemes defined in `tailwind.config.js`. You can customize:
- Color palette
- Dark mode behavior
- Component styling
- Responsive breakpoints

### Code Execution

The code execution system uses a safe `new Function()` approach with a mocked console object. For production use, consider additional security measures.

## 🚦 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Add your changes and new questions
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Ideas for Contributions
- Add more JavaScript questions and categories
- Implement user accounts and progress saving
- Add support for TypeScript challenges
- Create a leaderboard system
- Add question difficulty ratings from users
- Implement spaced repetition algorithm

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Code editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- Styled with [Material UI](https://mui.com/) and Custom CSS
- Icons from [Lucide](https://lucide.dev/)

---

**Happy Coding! 🎉** Start sharpening your JavaScript skills today with JS Challenge Lab!

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
