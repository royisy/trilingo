# Trilingo

A word memorizing webapp for language learning.  
Demo: [https://trilingo.app/](https://trilingo.app/)

## Stack

### Frontend app:

- TypeScript
- [React.js](https://react.dev/) - frontend library
- [Dexie.js](https://dexie.org/) - IndexedDB Wrapper
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [daisyUI](https://daisyui.com/) - UI component library
- [Vite](https://vitejs.dev/) - dev server
- [Vitest](https://vitest.dev/) - for unit testing

### Generating deck CSV files ([documentation](docs/deck-generator.md)):

- Python
- [ChatGPT API](https://platform.openai.com/docs/introduction) - for generating deck data
- [Pytest](https://docs.pytest.org/) - for unit testing

## Development Setup

1. Clone the repository:

```
git clone https://github.com/royisy/trilingo.git
```

2. Start Docker.
3. Open the project in VSCode.
4. Reopen in container.

## Commands

### Run Dev Server:

```
npm run dev
```

Visit: [http://localhost:5173/](http://localhost:5173/)

### Run Unit Tests

```
npm run test run
```
