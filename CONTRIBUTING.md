# Contributing to Academic Performance Prediction System

Thank you for your interest in contributing to the **Academic Performance Prediction System**! We welcome contributions from developers, researchers, and students.

---

## 📜 Table of Contents

1. [Code of Conduct](#-code-of-conduct)
2. [How Can I Contribute?](#-how-can-i-contribute)
   - [Reporting Bugs](#reporting-bugs)
   - [Suggesting Enhancements](#suggesting-enhancements)
   - [Pull Requests](#pull-requests)
3. [Local Development Setup](#-local-development-setup)
4. [Coding & Style Guidelines](#-coding--style-guidelines)
5. [Commit Message Conventions](#-commit-message-conventions)

---

## 🤝 Code of Conduct

Please help maintain a welcoming, respectful, and collaborative environment for all contributors. Treat everyone with respect regardless of background or experience level.

---

## 💡 How Can I Contribute?

### Reporting Bugs
If you encounter a bug or unexpected behavior:
1. Check the [Issues](../../issues) tab to verify if the issue has already been reported.
2. If not, open a new issue with a clear title and detailed description:
   - Steps to reproduce the problem.
   - Expected vs. actual behavior.
   - Screenshots or console log tracebacks (if applicable).
   - Your OS, Node.js version, and browser specifications.

### Suggesting Enhancements
We welcome feature suggestions (e.g., adding additional ML algorithms like Polynomial Regression, extra visualization charts, or export features):
1. Open a new issue with the label `enhancement`.
2. Provide a detailed explanation of the proposed feature and its benefits to the project.

### Pull Requests
1. Fork the repository and create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and ensure your code follows project conventions.
3. Run the linter to verify formatting and lint rules:
   ```bash
   npm run lint
   ```
4. Commit your changes with a descriptive message.
5. Push to your branch and open a **Pull Request (PR)** against `main`.

---

## 💻 Local Development Setup

1. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/academic-performance-prediction-system.git
   cd "Academic Performance Prediction System"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build and test production build:**
   ```bash
   npm run build
   ```

---

## 🎨 Coding & Style Guidelines

- **React & JSX:** Use functional components with hooks.
- **Styling:** Modular Sass/SCSS files located in `src/styles/`. Keep component styles modular and reusable.
- **Linting:** Follow ESLint configurations (`npm run lint`).
- **Clean Code:** Use clear variable names and write meaningful inline comments for mathematical calculations (e.g., regression coefficient calculations).

---

## 📝 Commit Message Conventions

We recommend following the [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` A new feature for the user
- `fix:` A bug fix
- `docs:` Documentation only changes (e.g. updating README or CONTRIBUTING)
- `style:` Formatting, missing semi-colons, CSS updates without logic changes
- `refactor:` Code changes that neither fix a bug nor add a feature
- `test:` Adding or updating tests

*Example:*
```bash
git commit -m "feat: add scatter plot visualization for regression line"
```

Thank you for contributing! 🚀
