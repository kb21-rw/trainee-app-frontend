# Trainee App Frontend

## Overview

The Trainee App frontend is the user interface for a training management tool that streamlines tracking participants' performance through coaches' feedback. This interface provides role-based access for Prospects, Applicants, Trainees, Coaches, and Admins, allowing efficient management of users, cohorts, forms, and evaluations.

## Key Features

1. Applying: Prospects can view open applications and apply to join cohorts.
2. Evaluating: Coaches can assess applicants and trainees by filling out admin-created forms.
3. Feedback Management: Coaches can view feedback provided by other coaches.
4. Role-Based Access:
   -  Admin: Full access to manage users, cohorts, forms, and feedback.
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
