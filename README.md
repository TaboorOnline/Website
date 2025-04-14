# Hilal Tech - Company Website & Admin Dashboard

A modern, multi-language, high-performance company website and admin dashboard built with React, TypeScript, and Supabase.

## Features

### Landing Page
- Modern, responsive design with smooth animations using Framer Motion
- Multilingual support (English & Arabic) with RTL layout
- Light and dark mode themes
- Dynamic content sections:
  - Hero section with call-to-action buttons
  - Services showcase
  - Project portfolio
  - Team members display
  - Customer reviews
  - Company timeline
  - Blog section
  - Contact form

### Admin Dashboard
- Protected by authentication (Supabase Auth)
- Comprehensive management panels:
  - User management
  - Services management
  - Team management
  - Reviews management
  - Blog posts management
  - Inbox for contact messages
  - Task management system
  - Website statistics
- Full internationalization support
- Responsive layout with light/dark themes

## Tech Stack

- **Frontend**: React.js + TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Forms**: React Hook Form + Yup validation
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Animations**: Framer Motion
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier, Husky, Lint-Staged

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/hilal-tech.git
cd hilal-tech
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file based on `.env.example` and add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and visit `http://localhost:5173`

## Project Structure

```
/
├── .env
├── .eslintrc.json
├── .gitignore
├── .husky/
│   └── pre-commit
├── .lintstagedrc
├── .prettierrc
├── devSummary.md
├── eslint.config.js
├── index.html
├── info.txt
├── LICENSE
├── node_modules/ (ignored)
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   └── vite.svg
├── README.md
├── src/
│   ├── app/
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── LandingLayout.tsx
│   │   ├── routes.tsx
│   │   └── supabaseClient.ts
│   ├── App.tsx
│   ├── assets/
│   │   └── react.svg
│   ├── global.css
│   ├── main.tsx
│   ├── modules/
│   │   ├── auth/
│   │   │   └── pages/
│   │   │       ├── ForgotPassword.tsx
│   │   │       ├── Login.tsx
│   │   │       ├── Register.tsx
│   │   │       └── ResetPassword.tsx
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── BlogPostFormModal.tsx
│   │   │   │   ├── DashboardHeader.tsx
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── DeleteConfirmationModal.tsx
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── ReviewFormModal.tsx
│   │   │   │   ├── ServiceFormModal.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── TaskFormModal.tsx
│   │   │   │   ├── TeamMemberFormModal.tsx
│   │   │   │   └── UserFormModal.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useDashboardStats.ts
│   │   │   │   ├── useServiceManagement.ts
│   │   │   │   └── useUserManagement.ts
│   │   │   ├── pages/
│   │   │   │   ├── Blog.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Inbox.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   ├── Reviews.tsx
│   │   │   │   ├── Services.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   │   ├── Stats.tsx
│   │   │   │   ├── Tasks.tsx
│   │   │   │   ├── Team.tsx
│   │   │   │   └── Users.tsx
│   │   │   └── services/
│   │   │       ├── blogService.ts
│   │   │       ├── dashboardService.ts
│   │   │       ├── messageService.ts
│   │   │       ├── reviewService.ts
│   │   │       ├── serviceService.ts
│   │   │       ├── statsService.ts
│   │   │       ├── taskService.ts
│   │   │       ├── teamService.ts
│   │   │       └── userService.ts
│   │   └── landing/
│   │       ├── components/
│   │       │   ├── BlogPreview.tsx
│   │       │   ├── ContactForm.tsx
│   │       │   ├── Hero.tsx
│   │       │   ├── Projects.tsx
│   │       │   ├── Reviews.tsx
│   │       │   ├── Services.tsx
│   │       │   ├── Team.tsx
│   │       │   └── Timeline.tsx
│   │       ├── hooks/
│   │       ├── pages/
│   │       │   ├── About.tsx
│   │       │   ├── Blog.tsx
│   │       │   ├── Contact.tsx
│   │       │   ├── Home.tsx
│   │       │   └── Services.tsx
│   │       └── services/
│   │           ├── blogService.ts
│   │           ├── contactService.ts
│   │           ├── landingService.ts
│   │           └── reviewService.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Image.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── NotFound.tsx
│   │   │   └── Select.tsx
│   │   ├── constants/
│   │   │   ├── index.ts
│   │   │   └── locales/
│   │   │       ├── ar.json
│   │   │       └── en.json
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useIntersectionObserver.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   ├── useScrollPosition.ts
│   │   │   ├── useSupabaseQuery.ts
│   │   │   └── useTheme.tsx
│   │   ├── store/
│   │   │   ├── useAppStore.ts
│   │   │   └── useDashboardStore.ts
│   │   ├── types/
│   │   │   └── types.ts
│   │   └── utils/
│   │       ├── i18n.ts
│   │       └── theme.ts
│   └── vite-env.d.ts
├── tailwind.config.cjs
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.paths.json
└── vite.config.ts

```

## Database Schema

The application uses the following Supabase tables:

- **profiles**: User profiles with roles
- **services**: Company services
- **team_members**: Team member information
- **projects**: Portfolio projects
- **reviews**: Customer reviews
- **blog_posts**: Blog content
- **contact_messages**: Messages from contact form
- **company_history**: Timeline events
- **tasks**: Task management system
- **site_statistics**: Website analytics

## Deployment

1. Build the production version:
```bash
npm run build
# or
yarn build
```

2. Test the production build locally:
```bash
npm run preview
# or
yarn preview
```

3. Deploy to your preferred hosting platform:
- Vercel
- Netlify
- GitHub Pages
- AWS Amplify
- Firebase Hosting

## Features to Add in Future

- Email notifications for new contact messages
- Advanced analytics dashboard
- Social media integration
- Integration with payment gateways
- PDF report generation
- Mobile app version using React Native

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Supabase](https://supabase.com) for backend services
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React Icons](https://react-icons.github.io/react-icons/) for icons
- [React Hook Form](https://react-hook-form.com/) for form handling