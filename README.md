# PollApp - Modern Polling Application

A Next.js 15+ application for creating and participating in polls, built with Shadcn/ui components and TypeScript.

## Features

- **User Authentication**: Login and registration system
- **Poll Management**: Create, view, and manage polls
- **Voting System**: Participate in polls with real-time results
- **Modern UI**: Beautiful interface built with Shadcn/ui components
- **Responsive Design**: Works seamlessly on all devices
- **TypeScript**: Full type safety throughout the application

## Project Structure

```
alx-polly/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # User login page
│   │   └── register/            # User registration page
│   ├── polls/                   # Poll-related pages
│   │   ├── page.tsx            # Polls listing page
│   │   ├── create/             # Create new poll page
│   │   └── [id]/               # Individual poll view page
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   └── polls/              # Poll management endpoints
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout with header
│   └── page.tsx                # Homepage
├── components/                   # Reusable components
│   ├── ui/                     # Shadcn/ui components
│   ├── forms/                  # Form components
│   └── layout/                 # Layout components (Header, etc.)
├── lib/                         # Utility libraries
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   └── validations/            # Zod validation schemas
├── hooks/                       # Custom React hooks
└── providers/                   # Context providers
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Validation**: Zod
- **State Management**: React hooks (ready for context/Redux)

## Key Components

### Authentication
- Login and registration forms
- Form validation with Zod
- Responsive design with Shadcn/ui

### Polls
- Poll creation with dynamic options
- Poll listing with search and filtering
- Individual poll view with voting
- Real-time results display

### Layout
- Responsive header with navigation
- User menu for authenticated users
- Mobile-friendly design

## Next Steps

This is a scaffolded application ready for:

1. **Backend Integration**: Connect to your preferred backend (Next.js API routes, external API, etc.)
2. **Database Setup**: Implement data persistence (PostgreSQL, MongoDB, etc.)
3. **Authentication**: Add real authentication (NextAuth.js, Clerk, etc.)
4. **Real-time Features**: Implement WebSocket connections for live updates
5. **Advanced Features**: Add poll analytics, user profiles, poll sharing, etc.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
