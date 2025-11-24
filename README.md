# ScorePulse - Live Sports App 🏆

A React Native mobile application for viewing live sports matches, teams, and players. Built with Expo, TypeScript, and TheSportsDB API.

## Features

- 🏅 View live sports matches and scores
- 👥 Browse teams and player information
- 🔐 User authentication with dummy API
- 📱 Cross-platform support (iOS, Android, Web)
- 🎨 Modern UI with best practices

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **API**: TheSportsDB (https://www.thesportsdb.com/api.php)
- **Authentication**: DummyJSON API (https://dummyjson.com/docs)

## Get Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

## Project Structure

This project uses [file-based routing](https://docs.expo.dev/router/introduction) with the **app** directory.

```
app/                    # Main application directory
  (tabs)/              # Tab-based navigation
  _layout.tsx          # Root layout
components/            # Reusable components
  ui/                  # UI components
constants/             # App constants and themes
hooks/                 # Custom React hooks
assets/                # Images and other assets
```

## Development Guidelines

- **Feature-based commits**: Make commits related to specific features
- **Proper validations**: Implement appropriate input validations
- **Decoupled code**: Structure code to be modular and easy to test
- **Best Practices**: Adhere to React Native and TypeScript best practices

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)
- [TheSportsDB API Documentation](https://www.thesportsdb.com/api.php)

## License

This project is for educational purposes.
