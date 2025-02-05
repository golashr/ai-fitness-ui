# AI Fitness Planner

A modern fitness application that provides personalized workout plans using AI technology.

## Features

- **Authentication**

  - Email/Password Sign In
  - Google OAuth Integration
  - Multi-Factor Authentication (MFA)
  - Password Reset Functionality
  - Email Verification

- **User Management**
  - Secure User Profiles
  - Password Management
  - Session Handling

## Tech Stack

- **Frontend Framework**

  - [Next.js 14](https://nextjs.org/) - React Framework
  - [TypeScript](https://www.typescriptlang.org/) - Type Safety
  - [Tailwind CSS](https://tailwindcss.com/) - Styling

- **State Management**

  - [Redux Toolkit](https://redux-toolkit.js.org/) - State Management
  - [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) - API Data Fetching

- **Authentication & Backend**

  - [Supabase](https://supabase.com/) - Backend as a Service
  - OAuth Integration
  - MFA Support

- **Deployment**
  - [Vercel](https://vercel.com) - Hosting Platform

## Getting Started

1. Clone the repository

```bash
git clone git@github.com:golashr/ai-fitness-ui.git
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`

4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
├── components/             # Reusable components
├── lib/                    # Utility functions and configurations
└── redux/                  # Redux state management
    └── features/
        └── auth/          # Authentication feature
            ├── types.ts   # Type definitions
            ├── thunks.ts  # Async actions
            ├── slice.ts   # Redux slice
            └── index.ts   # Feature exports
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Planned Features & Improvements

### Enhanced Authentication

- [ ] Email Verification Flow

  - Custom verification page
  - Resend verification email functionality
  - Better error handling and user feedback

- [ ] TOTP-based MFA

  - QR code generation
  - TOTP setup workflow
  - Backup codes generation
  - MFA recovery process

- [ ] SMS-based Advanced MFA (requires Supabase Pro)
  - Phone number verification
  - SMS code delivery
  - Fallback mechanisms
  - Recovery options

### Future Improvements

- [ ] Session management improvements
- [ ] Better loading states and transitions
- [ ] Enhanced error handling
- [ ] Comprehensive test coverage
- [ ] Performance optimizations

## Authentication Flow

### Sign Up Process

1. Initial User Signup

   - User submits signup form (email, password, name)
   - Create auth user in Supabase
   - Send verification email
   - Show verification screen
   - No profile creation at this stage

2. Email Verification

   - User receives verification email
   - Clicks verification link
   - Redirected to signin page
   - Auth record is marked as verified (confirmed_at is set)

3. First Sign In (Post Verification)
   - User signs in with credentials
   - System checks for existing profile
   - If no profile exists:
     - Create user profile
     - Store additional user data
   - Redirect to dashboard

### Benefits

- Clean separation between auth and profile creation
- Ensures profiles only exist for verified users
- No orphaned profile records
- Simplified RLS policies
- Better data integrity
- Reduced complexity in signup flow

### States

- Unverified: Auth record exists, no profile
- Verified: Auth record confirmed, profile created
- Complete: User fully onboarded
