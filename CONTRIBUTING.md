# Contributing to Frigg's Gate

Thank you for your interest in contributing to Frigg's Gate! This document provides guidelines and information for contributors to help maintain code quality and project consistency.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- Yarn package manager (`npm install -g yarn`)
- Git
- Basic knowledge of React, TypeScript, and Next.js

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/friggs-gate.git
   cd friggs-gate
   ```
3. **Set up the frontend**:
   ```bash
   cd frontend
   yarn install
   yarn dev
   ```
4. **Verify the setup** by opening [http://localhost:3000](http://localhost:3000)

## Development Workflow

### Branch Management

- **Main branch**: `main` - Production-ready code
- **Feature branches**: `feature/descriptive-name` - New features
- **Bug fixes**: `fix/issue-description` - Bug fixes
- **Documentation**: `docs/update-description` - Documentation updates

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   cd frontend
   yarn lint
   yarn build
   ```

4. **Commit your changes** with clear, descriptive messages:
   ```bash
   git add .
   git commit -m "Add: descriptive commit message"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## Coding Standards

### TypeScript & React

- Use **TypeScript** for all new components and utilities
- Follow **React functional components** with hooks
- Use **proper typing** for props, state, and function parameters
- Prefer **named exports** over default exports for components

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings
- **Semicolons**: Required
- **Trailing commas**: Use in objects and arrays
- **Line length**: Max 100 characters

### Component Structure

```tsx
// Good example
interface ChatWindowProps {
  conversationId: string;
  onMessage?: (message: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  onMessage
}) => {
  // Component implementation
};
```

### Styling Guidelines

- Use **Tailwind CSS** for utility-first styling
- Use **Chakra UI** components for consistent design system
- Avoid inline styles unless absolutely necessary
- Follow the existing color scheme and spacing conventions

## Component Guidelines

### File Naming

- **Components**: PascalCase (e.g., `ChatWindow.tsx`)
- **Utils**: camelCase (e.g., `sendFeedback.tsx`)
- **Types**: PascalCase with `.types.ts` suffix

### Component Best Practices

- Keep components **focused and single-purpose**
- Use **custom hooks** for complex state logic
- Implement **proper error boundaries**
- Add **loading states** for async operations
- Include **accessibility attributes**

### State Management

- Use React's built-in state management (`useState`, `useReducer`)
- Lift state up when needed for component communication
- Consider context for truly global state
- Avoid prop drilling beyond 2-3 levels

## Testing

### Running Tests

```bash
cd frontend
yarn test        # Run test suite
yarn test:watch  # Run tests in watch mode
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for complex components
- Mock external dependencies
- Test error scenarios and edge cases

## Documentation

### Code Documentation

- Use **JSDoc** comments for complex functions
- Document **prop interfaces** with descriptions
- Include **usage examples** for reusable components

### README Updates

- Update README.md if you add new features
- Include setup instructions for new dependencies
- Add usage examples for new functionality

## Pull Request Process

### Before Submitting

1. **Rebase** your branch on the latest main
2. **Run all tests** and ensure they pass
3. **Check linting** with `yarn lint`
4. **Build successfully** with `yarn build`
5. **Update documentation** if needed

### PR Requirements

- **Clear title** describing the change
- **Detailed description** explaining the why and what
- **Link to related issues** if applicable
- **Screenshots** for UI changes
- **Breaking changes** noted in description

### Review Process

1. **Automated checks** must pass (linting, build, tests)
2. **Code review** by at least one maintainer
3. **Manual testing** for significant changes
4. **Documentation review** if docs are updated

## Issue Reporting

### Bug Reports

Include:
- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (browser, OS, Node version)
- **Screenshots** if relevant

### Feature Requests

Include:
- **Clear description** of the desired feature
- **Use case** explaining why it's needed
- **Proposed implementation** if you have ideas
- **Mockups or examples** if applicable

## Architecture Guidelines

### Frontend Architecture

- Follow the existing **component structure** in `app/components/`
- Use **App Router** patterns for new pages
- Maintain **separation of concerns** between UI and business logic
- Follow **React Server Components** patterns where applicable

### API Integration

- Use the existing **Bifröst API contract** in `docs/bifrost_api_contract.md`
- Handle **error states** gracefully
- Implement **proper loading states**
- Add **retry logic** for failed requests

## Communication

### Questions and Discussions

- Use **GitHub Issues** for bug reports and feature requests
- Use **GitHub Discussions** for questions and general discussion
- Include **relevant context** and examples in your posts

### Getting Help

If you need help:
1. Check existing **documentation** and **issues**
2. Search **GitHub Discussions**
3. Create a **new issue** with the "question" label
4. Be specific about what you're trying to achieve

## Recognition

Contributors who make significant contributions will be:
- **Acknowledged** in the project README
- **Listed** in the CONTRIBUTORS file
- **Invited** to join the maintainer team for exceptional contributions

## License

By contributing to Frigg's Gate, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to Frigg's Gate! Your efforts help build a better cognitive architecture for everyone.