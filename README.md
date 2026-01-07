# Salesforce Interview Prep Dashboard

A high-fidelity, interactive Interview Prep Dashboard for the "Full Stack Engineer (Scheduling ECCH)" role at Salesforce.

## Features

### 1. Salesforce Interview Questions
- **Comprehensive Question Bank**: 20+ real interview questions from Salesforce Software Engineer interviews
- **Categorized by Topic**: System Design, Frontend, LeetCode, Backend, and Salesforce-Specific
- **Search & Filter**: Find questions by keyword, category, or tags
- **Expandable Answers**: Click to reveal detailed answers with best practices

### 2. JS Trivia "Deep Dive" Lab
- **Closure Playground**: Interactive demonstration of how closures maintain private variables in memory
- **Microtask vs Macrotask Simulator**: Visual Event Loop simulator showing execution order of Promises vs setTimeout
- **Pure Function Checker**: Analyze code to determine if a function is pure or has side effects

### 3. Scheduling System Architect
- **Database Schema Designer**: Visual canvas to design scheduling database schemas with drag-and-drop tables
- **Concurrency Simulator**: Interactive demonstration of Optimistic vs Pessimistic locking strategies

### 4. Active Recall Quizzer
- Flashcard deck covering Salesforce-centric topics:
  - Large Data Volumes (LDV)
  - Data Skew
  - CSS Grid for calendars
  - INP (Interaction to Next Paint) optimization

## Tech Stack

- **React 18** with functional components and hooks
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5174`)

## Project Structure

```
src/
├── components/
│   ├── SalesforceInterviewQuestions.jsx
│   ├── JSTriviaLab.jsx
│   ├── js-trivia/
│   │   ├── ClosurePlayground.jsx
│   │   ├── EventLoopSimulator.jsx
│   │   └── PureFunctionChecker.jsx
│   ├── SchedulingArchitect.jsx
│   ├── scheduling/
│   │   ├── SchemaCanvas.jsx
│   │   └── ConcurrencySimulator.jsx
│   └── ActiveRecallQuizzer.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Layout

The app features a **left sidebar navigation** for easy access to all sections:
- Interview Questions (default view)
- JS Trivia Lab
- Scheduling Architect
- Active Recall Quizzer

## Design System

The app uses Salesforce Lightning Design System inspired colors:
- Primary Blue: `#0176D3`
- Dark Blue: `#014486`
- Light Blue: `#E5F5FF`
- Gray: `#706E6B`
- Light Gray: `#F3F2F2`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
