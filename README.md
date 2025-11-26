# GamerApp - Gaming Clips Platform

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.5.0-blue?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Modern video clips platform built with Angular 20 | Firebase Backend | Video Processing with FFmpeg**

## Overview

GamerApp is a full-stack video clips sharing platform designed for gamers to upload, manage, and share their gaming highlights. Built with Angular 20 using standalone components architecture, Firebase for backend services, and client-side video processing with FFmpeg WebAssembly.

### Key Features

- 🎥 **Video Upload & Processing** - Client-side screenshot generation using FFmpeg.js
- 🔐 **Firebase Authentication** - Secure user authentication with custom error handling
- 📦 **Cloud Storage** - Firebase Storage for videos and thumbnails
- 🗄️ **Firestore Database** - NoSQL database for clip metadata and user data
- 🎨 **Glassmorphism UI** - Modern glassmorphic design with TailwindCSS
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts
- ⚡ **Performance Optimized** - OnPush change detection, lazy loading, and reactive patterns
- 🎬 **Video.js Integration** - Professional video player with custom themes

## Technology Stack

![Angular](https://img.shields.io/badge/Angular%2020-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript%205.9-3178C6?style=flat-square&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS%207.8-B7178C?style=flat-square&logo=reactivex&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS%203.2-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase%2012-FFCA28?style=flat-square&logo=firebase&logoColor=black)

### Core Dependencies

```json
{
  "@angular/core": "^20.3.4",
  "@angular/fire": "^20.0.1",
  "firebase": "^12.4.0",
  "@ffmpeg/ffmpeg": "^0.11.6",
  "video.js": "^7.15.4",
  "tailwindcss": "^3.2.6",
  "ngx-mask": "^20.0.3",
  "rxjs": "^7.8.2"
}
```

## Architecture

### Angular 20 Modern Patterns

- **Standalone Components** - Fully standalone architecture, no NgModules
- **Signals API** - Reactive state management with `viewChild()` and `afterNextRender()`
- **inject() Function** - Modern dependency injection pattern
- **takeUntilDestroyed()** - Automatic subscription cleanup with DestroyRef
- **Reactive Forms** - Type-safe form validation with FormControl/FormGroup
- **Router Guards** - Route protection and data resolution

### Project Structure

```
src/app/
├── services/           # Core services
│   ├── auth.service.ts        # Firebase authentication
│   ├── clip.service.ts        # Clip CRUD operations + Firestore
│   ├── ffmpeg.service.ts      # Video processing
│   └── modal.service.ts       # Modal state management
├── models/
│   └── clip.model.ts          # TypeScript interfaces
├── shared/             # Reusable components
│   ├── modal/
│   ├── alert/
│   ├── input/
│   └── directives/            # Custom directives
├── user/               # Authentication components
│   ├── auth-modal/
│   ├── login/
│   └── register/
├── video/              # Video management
│   ├── upload/                # Upload with FFmpeg processing
│   ├── edit/                  # Clip editing
│   └── manage/                # User clips dashboard
├── home/               # Landing page with hero video
├── clip/               # Video player page
└── clips-list/         # Paginated clips feed
```

## Features Deep Dive

### 1. Video Upload & Processing

- Drag-and-drop file upload
- Client-side video screenshot generation using FFmpeg WebAssembly
- Dual upload progress tracking (video + screenshot)
- Firebase Storage integration with resumable uploads
- Form validation with reactive forms

**Key Files:**
- `src/app/video/upload/upload.component.ts`
- `src/app/services/ffmpeg.service.ts`

### 2. Authentication System

- Firebase Auth integration
- Custom error messages for authentication failures
- Reactive user state with `authState()` observable
- Protected routes with route guards
- User profile management with displayName sync

**Key Files:**
- `src/app/services/auth.service.ts`
- `src/app/user/login/login.component.ts`
- `src/app/user/register/register.component.ts`

### 3. Clip Management

- Firestore CRUD operations
- Paginated clips feed with infinite scroll
- User-specific clip dashboard
- Edit/delete functionality with ownership validation
- Real-time updates with Firestore observers

**Key Files:**
- `src/app/services/clip.service.ts`
- `src/app/video/manage/manage.component.ts`

### 4. Video Playback

- Video.js integration with custom themes
- Responsive video player
- Thumbnail previews
- Fallback image handling for 404 screenshots

**Key Files:**
- `src/app/clip/clip.component.ts`

## Installation

### Prerequisites

- Node.js v18+
- Angular CLI 20+
- npm or yarn
- Firebase account with project setup

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Robotic1804/GamerApp.git
cd GamerApp
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Create environment files based on examples:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.prod.example.ts src/environments/environment.prod.ts
```

Update `src/environments/environment.ts` with your Firebase credentials:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  }
};
```

4. **Run development server**
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

5. **Build for production**
```bash
npm run build
# Output: dist/clips/
```

## Firebase Setup

### Required Services

1. **Authentication**
   - Enable Email/Password authentication
   - Configure authorized domains

2. **Firestore Database**
   - Create `clips` collection
   - Set security rules (see below)

3. **Storage**
   - Create buckets for videos and screenshots
   - Configure CORS for storage

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clips/{clipId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.uid;
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /clips/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Development

### Code Quality

- **TypeScript Strict Mode** - Enabled for type safety
- **OnPush Change Detection** - Performance optimization
- **Reactive Programming** - RxJS operators for data streams
- **Memory Leak Prevention** - `takeUntilDestroyed()` pattern

### Angular 20 Best Practices Applied

- ✅ Standalone components architecture
- ✅ Signals API for DOM references
- ✅ inject() function over constructor injection
- ✅ takeUntilDestroyed() for automatic cleanup
- ✅ afterNextRender() for SSR compatibility
- ✅ Reactive programming with async pipe
- ✅ Route-level code splitting
- ✅ Custom directives for reusable logic

### Recent Improvements

- Fixed Firebase injection context warnings
- Implemented displayName sync with reload()
- Added Firestore fallback for user data
- Fixed EventBlockerDirective standalone configuration
- Added comprehensive error handling
- Implemented memory leak prevention patterns
- Added fallback images for missing screenshots

## Deployment

### Vercel Deployment

The project is configured for Vercel deployment with included environment files.

1. **Deploy to Vercel**
```bash
vercel --prod
```

2. **Set environment variables in Vercel dashboard**
   - Add all Firebase configuration variables
   - Enable environment variables for production

### Build Configuration

- **Output Path**: `dist/clips/`
- **Bundle Budget**: 5MB initial, 50KB per component style
- **FFmpeg Assets**: Copied to output during build

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
ng test --code-coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Known Issues

- FFmpeg WebAssembly requires CORS headers for production
- Large video uploads may require Storage quota increase
- Video.js themes require manual asset copying

## Future Enhancements

- [ ] Real-time comments system
- [ ] Like/favorite functionality
- [ ] User profiles with statistics
- [ ] Video categories and tags
- [ ] Search and filtering
- [ ] Social sharing integration
- [ ] Progressive Web App (PWA) support

## License

This project is licensed under the MIT License.

## Author

**Norman Navarro**
- GitHub: [@Robotic1804](https://github.com/Robotic1804)
- Email: norman-navarro@norman-webdesigner.com

---

Built with ❤️ using Angular 20 and Firebase
