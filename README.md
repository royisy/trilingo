# Trilingo

A word memorizing webapp for language learning.  
Demo: [https://trilingo.app/](https://trilingo.app/)

<div style="display: inline-block;">
  <img src="https://user-images.githubusercontent.com/28505196/261851814-9de3a934-208b-4185-bdfb-f020f7b16cd8.png" alt="Home" width="300">
  <img src="https://user-images.githubusercontent.com/28505196/261851820-e8af65fb-63d1-4f78-ac82-d3694a322f79.png" alt="Practice" width="300">
</div>

## Stack

### Frontend App:

- TypeScript
- [React.js](https://react.dev/) - frontend library
- [Dexie.js](https://dexie.org/) - IndexedDB Wrapper
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [daisyUI](https://daisyui.com/) - UI component library
- [Vite](https://vitejs.dev/) - dev server
- [Vitest](https://vitest.dev/) - for unit testing

### Generating Deck CSV Files ([Documentation](docs/deck-generator.md)):

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
