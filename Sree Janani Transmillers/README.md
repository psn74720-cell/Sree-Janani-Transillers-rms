# Sree Janani Transmillers - RMS Business Portal

A modern web application for managing production and sales operations for a concrete and brick manufacturing business.

## Features

- **Authentication System**: Secure login and signup with role-based access (Owner/Employee)
- **Dashboard**: Overview of business metrics and operations
- **Production Management**: Track production records for:
  - Ready Mix Concrete
  - CLC Brick
  - Platform Block
- **Sales Management**: Manage sales records with customer information, payment tracking, and invoicing

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database & Authentication)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Sree Janani Transmillers"
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

Then edit `.env` with your actual values:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** Get these values from your [Supabase project settings](https://app.supabase.com/project/YOUR_PROJECT/settings/api)

4. Run the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
├── src/
│   ├── components/       # React components
│   │   ├── Auth/         # Authentication components
│   │   ├── Dashboard/    # Dashboard components
│   │   ├── Production/   # Production management
│   │   └── Sales/        # Sales management
│   ├── contexts/         # React contexts (Auth)
│   ├── lib/              # Utilities (Supabase client)
│   └── main.tsx          # Entry point
├── supabase/
│   └── migrations/       # Database migrations
└── public/               # Static assets
```

## Database

The application uses Supabase for backend services. Database schema is defined in `supabase/migrations/`.

## Deployment

This project can be deployed to various platforms:

### Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatically on push

### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

### GitHub Pages
1. Configure in repository Settings → Pages
2. Set build folder to `dist`
3. Add environment variables in GitHub Actions secrets

See `GITHUB_SETUP.md` for detailed deployment instructions.

## Verification

After cloning, verify your setup using `VERIFICATION_CHECKLIST.md`.

## License

MIT License - See [LICENSE](LICENSE) file for details.

