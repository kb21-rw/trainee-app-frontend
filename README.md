# Trainee App Frontend

## Overview

The Trainee App frontend is the user interface for a training management tool that streamlines tracking participants' performance through coaches' feedback. This interface provides role-based access for Prospects, Applicants, Trainees, Coaches, and Admins, allowing efficient management of users, cohorts, forms, and evaluations.

## Key Features

1. Applying: Prospects can view open applications and apply to join cohorts.
2. Evaluating: Coaches can assess applicants and trainees by filling out admin-created forms.
3. Feedback Management: Coaches can view feedback provided by other coaches.
4. Role-Based Access:
   - Admin: Full access to manage users, cohorts, forms, and feedback.
   - Coaches: Can evaluate and view participant performance but cannot modify other coaches' feedback.
   - Applicants: Limited access to view and update personal information and submitted application.
   - Trainees: Can not log in anymore

## Technologies Used

1. React (with Vite and TypeScript) - Frontend framework.
2. React Hook Form (with Zod) - Form management and validation.
3. Material UI (MUI) - Complex components like data grids.
4. Redux Toolkit - State management.
5. Day.js - Date manipulation.
6. Tailwind CSS - Styling.

## Getting started

1. Clone the repository:

```bash
git clone https://github.com/kb21-rw/trainee-app-frontend.git
```

2. Navigate to the repository:

```bash
cd trainee-app-frontend
```

3. Install dependencies:

```shell
npm install
```

4. Start the development server (make sure you have .env file before running this command):

```shell
npm run dev
```

Open your web browser and access the app at http://localhost:5173.

## Code Contribution Guidelines

<details>
  <summary>Click to Expand</summary>
  
  ### 1. Project Structure

- Organize components by feature or function.
- Keep a `components` directory for reusable components and a `pages` directory for route-level components.
- there's a separate `hooks` folder for custom hooks and `utils` for helper functions.

### 2. Component Structure

- **Function Components Only**: Use functional components with React Hooks. Avoid using class components.
- **Naming Conventions**:
  - Use `PascalCase` for components (`UserProfile`).
  - Use `camelCase` for functions and variables (`handleSubmit`).
- **File Naming**: Match the file name with the component name (e.g., `UserProfile.js` for the `UserProfile` component).
- **Folder Structure**: If a component has multiple files (styles, tests, etc.), create a folder for it (`UserProfile/index.js`, `UserProfile/UserProfile.test.js`).

### 3. Styling

- Stick to tailwind while styling unless there's a specific reason to not use it
- **Use classnames:** when some styles are applied conditionally, use classnames for clean and improved code readability

### 4. React Router

- **Route Naming**: Use clear and descriptive path names for routes (`/user-profile` instead of `/user`).
- **Dynamic Routes**: When using dynamic routes, ensure parameters are clearly named (`/profile/:userId`).

### 5. State Management

- **Component State**: Keep the state close to where it’s used (lifting state up only when necessary).
- **Redux API**: For global state (e.g., user authentication), use React Context. For large or complex state, use Redux library.
- **Avoid Prop Drilling**: Use Context API or custom hooks to pass data instead of deep prop drilling.

### 7. Error Handling

- **API Errors**: Display clear error messages to users for API-related issues.
- **Boundary Errors**: Use `ErrorBoundary` components to catch and handle unexpected component-level errors.
- **Error Messages**: Log detailed error information for debugging, but show simple, user-friendly messages.

### 8. Code Formatting

- **Prettier and ESLint**: Use Prettier for consistent formatting and ESLint for code linting. Avoid disabling these tools as much as possible.
- **Line Length**: Keep line length under 100 characters for readability.
- **Commenting**:
  - Write concise comments explaining the _why_ (not the _what_).
  - Use JSDoc format for documenting functions and components when necessary.

### 9. Git Workflow

- **Branch Naming**: Follow the convention of `feature/`, `fix/`, and `hotfix/` branches (`feature/user-profile`).
- **Commit Messages**: Use descriptive commit messages following the format:
  - `feat`: New feature
  - `fix`: Bug fix
  - `refactor`: Code change that does not fix a bug or add a feature
- **Pull Requests**: Ensure each PR has a summary and limit PR size for easy review.
</details>
