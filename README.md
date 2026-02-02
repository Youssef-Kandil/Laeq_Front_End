# Laeq_Front_End
=======

## Getting Started

- git remote add origin https://github.com/Youssef-Kandil/Laeq_Front_End.git
- npm install
- npm run build
- npm run start


## Documentation

All project documentation is centralized in the `Docs` folder:

- **Figma Design**  
  - Contains the full UI/UX design for the application.  
  - Can be used as the single source of truth for layouts, components, and visual guidelines.

- **Database ERD**  
  - A complete ERD (Entity Relationship Diagram) for the database.  
  - Helps understand all entities, relations, and how data flows across the system.

- **Backend Prisma Schema**  
  - The backend source code includes a full Prisma schema that reflects the actual production database structure.  
  - When in doubt about fields or relations, you can rely on the Prisma schema alongside the ERD.

- **Team Skills Document**  
  - A dedicated document that outlines the team skills and responsibilities.  
  - Useful for onboarding, task distribution, and understanding who owns which parts of the system.


## Front-End Stack:
- Next.js
- Shadcn Ui Kit
- Typescript
- Node.js
- Style With Module Css
- Lint / Es67
- React-Query
- Next-auth
- React-Icons / Lottie-react 


## Server & Storge:
- Main Server is VPS  in Hostinger account laeq365.com (Front-end / back-end / DB);
- Media Storage In Google Cloude Account (All PDF Reports / Assets Images / Other)
- Use PM2 To Run the Code 

## Project Structure

- **src/app/[locale]**  
  - Contains all application pages per language (Next.js App Router).  
  - Each page composes shared components from `src/app/components` and calls hooks/services as needed.

- **src/app/components**  
  - **components/global**: Reusable UI components (buttons, inputs, tables, cards, popups, etc.) used across the whole project.  
  - **components/dashboard**: Dashboard‑specific components (e.g. `Nave`, `Aside`, `LaeqNave`, `LaeqAside`) used to build the internal layout.  
  - **components/website**: Components dedicated to public website / landing pages.

- **src/app/Hooks**  
  - Custom hooks (e.g. `useLogin`, `useAssets`, `useTemplates`, …).  
  - Each hook encapsulates business logic and data fetching (React Query, API calls) and is consumed by pages or components.

- **src/app/lib**  
  - **ApiService.ts**: Centralized API layer (requests, headers, auth handling, etc.).  
  - **firebase.ts / TrelloService.ts**: Integrations with external services (Firebase, Trello).

- **src/app/providers**  
  - Wraps the app with global providers (React Query Provider, auth/expiration guards, etc.).  
  - Prepares shared context (session, caching, guards) that is available to all pages.

- **src/app/services**  
  - Higher-level services built on top of `ApiService` (e.g. `login_services`, `signup_services`, JWT verification).  
  - Used by hooks or pages instead of calling the API directly.

- **src/app/Types**  
  - Shared TypeScript types and interfaces for core entities (users, templates, assets, reports, etc.).  
  - Keeps the codebase strongly typed and consistent.

- **src/app/utils**  
  - Generic utility functions (date helpers, encryption/decryption, regex, image helpers, PDF helpers, `mapLinks`, etc.).  
  - UI-agnostic helpers used across multiple modules.

- **src/app/config**  
  - Static configuration data (navigation titles, aside titles, sectors list, team members, identity, …).  
  - Feeds components with static content instead of hard‑coding it inside components.

---

## Component Architecture & Relations

- **Pages (`[locale]` directory)**  
  - Define what the user sees (screen layout & routing).  
  - Use Dashboard components (like `Nave`, `Aside`) to build the main page layout.  
  - Inside each page, global components from `components/global` (such as `Table`, `CheckList_Card`, `QuestionFormComponent`, …) are composed to build the UI.

- **Components & Hooks**  
  - Components focus on **UI** only (render data and handle user interactions).  
  - Whenever data or side‑effects are needed:
    - The component calls the appropriate hook (e.g. `useTasks`, `useTemplates`, `useLogin`).  
    - The hook uses `services`, `ApiService`, and `utils` to handle the business logic and data fetching.  
  - This creates a clear separation between **UI** (components) and **business/data layer** (hooks + services + lib).

- **Providers**  
  - `MainProviders` and related provider components wrap the entire app with:
    - React Query Provider for caching and async state.  
    - Guards such as `CheckAdminGuard` and `ExpirationGuard` for permissions and session validity.  
  - Pages and components can rely on these global contexts without duplicating logic.


