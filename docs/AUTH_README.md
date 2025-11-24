# Authentication Implementation

## Overview
The ScorePulse app now includes a complete authentication system with login and signup screens using DummyJSON API.

## Features Implemented

### 1. Login Screen
- Username/Email input field
- Password input field with secure text entry
- Form validation
- Navigation to signup screen
- "Welcome Back" greeting

### 2. Signup Screen
- First Name input field
- Last Name input field
- Email input field with validation
- Password input field (minimum 6 characters)
- Comprehensive form validation

### 3. Authentication System
- **Auth Context**: Global authentication state management
- **Auth Service**: API integration with DummyJSON
- **Persistent Storage**: User session saved with AsyncStorage
- **Protected Routes**: Automatic redirection based on auth state

## Testing the App

### Test Login with DummyJSON Users
Use these credentials to test the login:

```
Username: emilys
Password: emilyspass
```

Other test users available at: https://dummyjson.com/users

### Test Signup
1. Enter any first name, last name, email, and password (6+ characters)
2. The app will simulate user creation
3. You'll be automatically logged in

## API Integration

### Login Endpoint
```
POST https://dummyjson.com/auth/login
Body: { username, password }
```

### Signup Endpoint
```
POST https://dummyjson.com/users/add
Body: { firstName, lastName, email, password }
```

## How to Run

```bash
npx expo start
```

Then press:
- `i` for iOS simulator
- `a` for Android emulator
- Scan QR code for Expo Go

## File Structure

```
app/
  (auth)/
    _layout.tsx          # Auth stack navigator
    login.tsx            # Login screen
    signup.tsx           # Signup screen
  _layout.tsx            # Root layout with auth guard

components/ui/
  text-input.tsx         # Reusable input component
  button.tsx             # Reusable button component

context/
  auth-context.tsx       # Auth state management

services/
  auth.service.ts        # API integration

types/
  auth.ts                # TypeScript interfaces
```

## Validation Rules

### Login
- Username/Email: Required
- Password: Required

### Signup
- First Name: Required
- Last Name: Required
- Email: Required, valid email format
- Password: Required, minimum 6 characters

## Next Steps

1. Add "Forgot Password" functionality
2. Implement biometric authentication
3. Add social login (Google, Facebook)
4. Create user profile screen
5. Add logout functionality to tab navigation
