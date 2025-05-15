# Timer Application

This is a React application for managing timers.

## Features

- Add timers with name, duration, and category.
- View timers grouped by category.
- Start, pause, and reset individual timers.
- Progress visualization for each timer.
- Bulk actions (start, pause, reset) for categories.
- Timer completion alerts.
- Timer history.
- Customizable halfway alerts.

## Project Structure

```
healthflex/
├── public/
├── src/
│   ├── components/
│   │   ├── AddTimerForm.js
│   │   ├── TimerItem.js
│   │   ├── TimerList.js
│   │   └── CategorySection.js
│   ├── contexts/
│   │   └── TimerContext.js
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   └── HistoryScreen.js
│   ├── utils/
│   │   └── localStorage.js
│   ├── App.js
│   ├── index.js
│   └── reportWebVitals.js
├── package.json
└── README.md
```

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Run the application: `npm start`
