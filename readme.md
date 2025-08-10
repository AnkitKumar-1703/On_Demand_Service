# On-Demand Service Platform

[![Live Site](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://on-demand-service-omega.vercel.app)
[![Status](https://img.shields.io/badge/Status-Active-success)](#)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)](#)

A modern web platform that connects users with service providers (e.g., home maintenance, cleaning, repair, tutoring, etc.) on demand. This repository contains the source code for the client / server (depending on implementation) that powers booking, managing, and tracking services in real-time.

> NOTE: This is an initial README draft. Feel free to adjust sections based on the actual architecture and code layout as the project evolves.

## Table of Contents
- [Key Features](#key-features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Screenshots / Demo](#screenshots--demo)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API (If Applicable)](#api-if-applicable)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [FAQ](#faq)
- [License](#license)
- [Contact](#contact)

## Key Features
- User registration & authentication (JWT / sessions)
- Profile management (users & service providers)
- Service catalog with categories & filtering
- Search functionality (by location, service type, etc.)
- Multi-language support, allowing users to experience the platform in their preferred language.
- Real-time availability & booking workflow
- Dynamic pricing (per hour / fixed / tiered)
- Scheduling 
- Order lifecycle: Requested → Accepted → In Progress → Completed / Cancelled
- In-app notifications (web sockets / polling)
- Ratings & reviews system
- Admin dashboard (manage users, providers, services, reports)
- Mobile-responsive UI & accessible components
- Deployment on Vercel (preview & production)

## Architecture Overview

```
( Client )  -->  REST API  -->  ( Backend API )  -->  Database (Prisma)
                   |                             
                   └--> Realtime Layer (Socket.io)
```

- **Client**: React application built with Vite
- **Backend API**: Express.js server handling API requests
- **Database**: SQL database accessed via Prisma ORM
- **Realtime**: Socket.io for real-time communication

Possible patterns:
- Monorepo or separated `client` and `server`
- MVC / Clean Architecture / Modular service layers
- External services: Email (SendGrid), Queue (Bull / Redis), File storage (S3 / Cloudinary)

## Tech Stack

| Layer | Suggested / Placeholder |
|-------|--------------------------|
| Frontend | React / Tailwind CSS |
| Backend | Node.js (Express ) |
| Database | MongoDB  |
| Realtime | Socket.io  |
| Auth | JWT  |
| ORM | Prisma (if using SQL) / Mongoose (if using MongoDB) |
| Language | i18Next |
| Deployment | Vercel (frontend) / Render  (backend) |


## Screenshots / Demo

### Landing Page
![Landing Page](frontend/assets/screenshots/landing-page.jpg)

### Multilingual Support
![Multilingual Support](frontend/assets/screenshots/multilingual.jpg)

### User Dashboard
![User Dashboard](frontend/assets/screenshots/user-dashboard.jpg)

### Worker Dashboard
![Worker Dashboard](frontend/assets/screenshots/worker-dashboard.jpg)

### Worker Services
![Worker Services](frontend/assets/screenshots/worker-services.jpg)


## Project Structure

```
root/
  client/             # Frontend application
  server/             # Backend API (if separate)
  prisma/             # Database schema (if using Prisma)
  scripts/            # Automation scripts
  docs/               # Additional documentation
  .env.example        # Example environment variables
  readme.md           # Project README
```

## Getting Started
### Prerequisites
- Node.js (LTS recommended)
- Package manager: npm / pnpm / yarn
- Database: MongoDB / PostgreSQL (or other SQL)


### Clone the Repository
```
git clone https://github.com/AnkitKumar-1703/On_Demand_Service.git
cd On_Demand_Service
```

### Install Dependencies
If monorepo with separate projects:
```
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```
Or single project:
```
npm install
```

## Environment Variables
Create a `.env` file (or multiple, e.g., `.env.local`). Example:
```
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/on_demand
JWT_SECRET=replace_me
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
EMAIL_API_KEY=replace_me
CLOUDINARY_API_KEY=replace_me
CLOUDINARY_API_SECRET=replace_me
```
Provide an `.env.example` file for contributors.

## Running the App
### Development
```
# Frontend 
npm run dev

# Backend
npm run dev
```
### Production Build
```
npm run build
npm start
```

## API 
Example REST endpoints:
```
GET    /api/services
POST   /api/bookings
GET    /api/bookings/:id
POST   /api/auth/login
POST   /api/reviews
```


## Testing
```
npm test
npm run test:watch
npm run lint
npm run format
```


## Deployment
- Frontend: Vercel (auto-deploy from main / PR previews)
- Backend: Deploy to Render / Railway / AWS / Fly.io
- Environment secrets configured via dashboard / GitHub Actions

## Roadmap
- [ ] Finalize core data models
- [ ] Implement authentication & authorization
- [ ] Service provider onboarding flow
- [ ] Booking scheduling logic
- [ ] Payment integration
- [ ] Realtime status tracking
- [ ] Reviews & ratings
- [ ] Admin analytics & reporting
- [ ] Automated tests & CI pipeline
- [ ] Internationalization (i18n)

## Contributing
Contributions are welcome!
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/awesome-feature`
3. Commit changes: `git commit -m "feat: add awesome feature"`
4. Push: `git push origin feat/awesome-feature`
5. Open a Pull Request

Use conventional commits if possible (feat:, fix:, docs:, chore:, refactor:, test:, perf:).

## FAQ
**Q: Is there a mobile app?**
A: Not yet – potentially via React Native / Expo later.

**Q: How do I run only the backend?**
A: Enter the `server` directory and run `npm run dev` (if separate backend).

**Q: Can I deploy my own instance?**
A: Yes. Follow the environment setup, configure secrets, and deploy frontend + backend.

## License
No license specified yet. (Consider adding MIT / Apache-2.0.)

## Contact
Created by [Ankit Kumar](https://github.com/AnkitKumar-1703)

- Live App: https://on-demand-service-omega.vercel.app
- Issues: Use the GitHub Issues tab
- Suggestions: Open a discussion or issue

---
If you find this useful, consider starring the repository!